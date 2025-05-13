import Product from "../Model/ProductModel.js";
import InventoryMovement from "../Model/InventoryMovementModel.js";
import pdfkit from 'pdfkit';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Helper Function to Log Movement (No changes) ---
const logInventoryMovement = async (productId, changeType, quantityChange, quantityBefore, quantityAfter, notes = '') => {
    try {
        const movement = new InventoryMovement({ productId, changeType, quantityChange, quantityBefore, quantityAfter, notes });
        await movement.save();
    } catch (err) {
        console.error("Error logging inventory movement:", err);
    }
};

// --- Helper Function to Check Low Stock (No changes) ---
const checkLowStock = (product) => {
    if (product.quantity <= product.lowStockThreshold) {
        console.warn(`LOW STOCK ALERT: Product "${product.name}" (ID: ${product._id}) has quantity ${product.quantity}, which is at or below the threshold of ${product.lowStockThreshold}.`);
    }
};

// --- CRUD Functions ---
export const getAllProducts = async (req, res, next) => {
    let products;
    try {
        products = await Product.find();
    } catch (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ message: "Server error fetching products" });
    }
    return res.status(200).json({ products });
};

export const addProducts = async (req, res, next) => {
    const { name, description, price, quantity, category, lowStockThreshold, supplierInfo } = req.body;
    let imagePath = "/default-product-image.jpg";
    if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
    }
    if (!name || !description || price == null || quantity == null || !category) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    let product;
    try {
        const initialQuantity = Number(quantity);
        product = new Product({
            name, description, price: Number(price), quantity: initialQuantity, category,
            imageUrl: imagePath,
            lowStockThreshold: lowStockThreshold != null ? Number(lowStockThreshold) : undefined,
            supplierInfo: supplierInfo || ''
        });
        await product.save();
        await logInventoryMovement(product._id, 'initial', initialQuantity, 0, initialQuantity, 'Product created');
        checkLowStock(product);
    } catch (err) {
        console.error("Error adding product:", err);
        if (req.file && product && !product._id) { try { fs.unlinkSync(req.file.path); } catch (unlinkErr) { console.error(`Error deleting orphaned upload ${req.file.filename}:`, unlinkErr); } }
        if (err.name === 'ValidationError') return res.status(400).json({ message: "Validation Error", errors: err.errors });
        return res.status(500).json({ message: "Unable to add product" });
    }
    return res.status(201).json({ product });
};

export const getById = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid product ID format" });
    let product;
    try { product = await Product.findById(id); }
    catch (err) { console.error(`Error fetching product by ID ${id}:`, err); return res.status(500).json({ message: "Server error fetching product" }); }
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ product });
};

export const updateProduct = async (req, res, next) => {
    const id = req.params.id;
    const { name, description, price, quantity, category, lowStockThreshold, supplierInfo } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid product ID format" });
    if (!name || !description || price == null || quantity == null || !category) return res.status(400).json({ message: "Missing required fields" });
    let productBefore, updatedProduct, oldImagePath = null;
    try {
        productBefore = await Product.findById(id);
        if (!productBefore) { if (req.file) { fs.unlinkSync(req.file.path); } return res.status(404).json({ message: "Product not found for update" }); }
        let newImagePath = productBefore.imageUrl;
        if (req.file) { newImagePath = `/uploads/${req.file.filename}`; oldImagePath = productBefore.imageUrl; }
        const quantityBeforeUpdate = productBefore.quantity; const quantityAfterUpdate = Number(quantity);
        productBefore.name = name; productBefore.description = description; productBefore.price = Number(price);
        productBefore.quantity = quantityAfterUpdate; productBefore.category = category; productBefore.imageUrl = newImagePath;
        productBefore.lowStockThreshold = lowStockThreshold != null ? Number(lowStockThreshold) : productBefore.lowStockThreshold;
        productBefore.supplierInfo = supplierInfo != null ? supplierInfo : productBefore.supplierInfo;
        updatedProduct = await productBefore.save();
        if (quantityBeforeUpdate !== quantityAfterUpdate) { const quantityChange = quantityAfterUpdate - quantityBeforeUpdate; await logInventoryMovement(updatedProduct._id, 'manual_update', quantityChange, quantityBeforeUpdate, quantityAfterUpdate, 'Product details updated'); }
        checkLowStock(updatedProduct);
        if (oldImagePath && oldImagePath !== "/default-product-image.jpg" && oldImagePath !== newImagePath) { const fullOldPath = path.join(__dirname, '..', oldImagePath); try { if (fs.existsSync(fullOldPath)) { fs.unlinkSync(fullOldPath); } } catch (unlinkErr) { console.error(`Error deleting old image ${oldImagePath}:`, unlinkErr); } }
    } catch (err) {
        console.error(`Error updating product ${id}:`, err);
        if (req.file && err) { try { fs.unlinkSync(req.file.path); } catch (unlinkErr) { console.error(`Error deleting uploaded file after update error for ${id}:`, unlinkErr); } }
        if (err.name === 'ValidationError') return res.status(400).json({ message: "Validation Error", errors: err.errors });
        return res.status(500).json({ message: "Unable to update product details" });
    }
    return res.status(200).json({ product: updatedProduct });
};

export const deleteProduct = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid product ID format" });
    let product;
    try {
        product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found for deletion" });
        const quantityBeforeDelete = product.quantity; const imagePathToDelete = product.imageUrl;
        await Product.findByIdAndDelete(id);
        await logInventoryMovement(id, 'deletion', -quantityBeforeDelete, quantityBeforeDelete, 0, 'Product deleted');
        if (imagePathToDelete && imagePathToDelete !== "/default-product-image.jpg") { const fullPath = path.join(__dirname, '..', imagePathToDelete); try { if (fs.existsSync(fullPath)) { fs.unlinkSync(fullPath); } } catch (unlinkErr) { console.error(`Error deleting image file ${imagePathToDelete} for deleted product ${id}:`, unlinkErr); } }
    } catch (err) {
        console.error(`Error deleting product ${id}:`, err);
        return res.status(500).json({ message: "Unable to delete product" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
};

// --- Stock Movement & History Functions ---
export const recordSale = async (req, res, next) => {
    const id = req.params.id; const { quantitySold, notes } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid product ID format" });
    if (quantitySold == null || isNaN(quantitySold) || Number(quantitySold) <= 0 || !Number.isInteger(Number(quantitySold))) return res.status(400).json({ message: "Quantity sold must be a positive whole number" });
    const saleAmount = Number(quantitySold);
    try {
        const product = await Product.findById(id); if (!product) return res.status(404).json({ message: "Product not found for sale" });
        const quantityBefore = product.quantity; if (quantityBefore < saleAmount) return res.status(400).json({ message: `Insufficient stock. Only ${quantityBefore} available.` });
        const quantityAfter = quantityBefore - saleAmount; product.quantity = quantityAfter; await product.save();
        await logInventoryMovement(product._id, 'sale', -saleAmount, quantityBefore, quantityAfter, notes || 'Sale recorded'); checkLowStock(product);
        return res.status(200).json({ message: "Sale recorded successfully", product });
    } catch (err) { console.error(`Error recording sale for product ${id}:`, err); if (err.name === 'ValidationError') return res.status(400).json({ message: "Validation Error", errors: err.errors }); return res.status(500).json({ message: "Server error recording sale" }); }
};

export const restockProduct = async (req, res, next) => {
    const id = req.params.id; const { quantityRestocked, notes } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid product ID format" });
    if (quantityRestocked == null || isNaN(quantityRestocked) || Number(quantityRestocked) <= 0 || !Number.isInteger(Number(quantityRestocked))) return res.status(400).json({ message: "Quantity restocked must be a positive whole number" });
    const restockAmount = Number(quantityRestocked);
    try {
        const product = await Product.findById(id); if (!product) return res.status(404).json({ message: "Product not found for restock" });
        const quantityBefore = product.quantity; const quantityAfter = quantityBefore + restockAmount; product.quantity = quantityAfter; await product.save();
        await logInventoryMovement(product._id, 'restock', restockAmount, quantityBefore, quantityAfter, notes || 'Restock recorded');
        return res.status(200).json({ message: "Restock recorded successfully", product });
    } catch (err) { console.error(`Error restocking product ${id}:`, err); if (err.name === 'ValidationError') return res.status(400).json({ message: "Validation Error", errors: err.errors }); return res.status(500).json({ message: "Server error restocking product" }); }
};

export const getProductMovementHistory = async (req, res, next) => {
    const id = req.params.id; if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid product ID format" });
    try {
        const productExists = await Product.findById(id).select('_id'); if (!productExists) return res.status(404).json({ message: "Product not found" });
        const history = await InventoryMovement.find({ productId: id }).sort({ timestamp: -1 }); return res.status(200).json({ history });
    } catch (err) { console.error(`Error fetching history for product ${id}:`, err); return res.status(500).json({ message: "Server error fetching product history" }); }
};

// --- PDF Report Function ---
export const generateInventoryReport = async (req, res, next) => {
    console.log("Attempting to generate PDF report...");
    try {
        console.log("Fetching products for report...");
        const products = await Product.find().sort({ category: 1, name: 1 });
        console.log(`Found ${products.length} products.`);

        const doc = new pdfkit({ size: 'A4', margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="inventory_report_${Date.now()}.pdf"`);

        doc.pipe(res);

        doc.fontSize(18).text('Inventory Report', { align: 'center' });
        doc.fontSize(10).text(`Generated: ${new Date().toLocaleString('en-LK', { timeZone: 'Asia/Colombo' })}`, { align: 'center'});
        doc.moveDown(2);

        const tableTop = doc.y;
        const itemX = 50; const categoryX = 150; const quantityX = 250;
        const thresholdX = 320; const priceX = 400; const statusX = 470;
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Name', itemX, tableTop); doc.text('Category', categoryX, tableTop);
        doc.text('Quantity', quantityX, tableTop, { width: 60, align: 'right' });
        doc.text('Threshold', thresholdX, tableTop, { width: 60, align: 'right' });
        doc.text('Price (LKR)', priceX, tableTop, { width: 60, align: 'right' });
        doc.text('Status', statusX, tableTop);

        // ... rest of the PDF generation code ...
    } catch (err) {
        console.error("Error generating PDF report:", err);
        return res.status(500).json({ message: "Error generating inventory report" });
    }
}; 