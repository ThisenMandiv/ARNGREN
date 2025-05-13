import React, { useState, useEffect, useCallback } from 'react';

import axios from "axios";
import Product from '../../../Components/Product/Product';
import "./ProductList.css";

// *** RENAME THIS CONSTANT ***
const PRODUCTS_API_URL = "http://localhost:5000/products"; // Renamed from URL

function Products() {
const [products, setProducts] = useState([]);
const [searchQuery, setSearchQuery] = useState("");
const [filteredProducts, setFilteredProducts] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

// Fetch products function
const fetchProducts = useCallback(async () => {
setIsLoading(true); setError(null);
try {
// *** Use the new constant name ***
const res = await axios.get(PRODUCTS_API_URL);
const fetchedProducts = res.data.products || [];
setProducts(fetchedProducts); setFilteredProducts(fetchedProducts);
} catch (err) {
console.error("Error fetching products:", err.response ? err.response.data : err.message);
setError("Failed to load products. Please try again later.");
setProducts([]); setFilteredProducts([]);
} finally { setIsLoading(false); }
}, []); // fetchProducts depends on the constant, but it doesn't change, so empty array is fine

// Initial fetch
useEffect(() => { fetchProducts(); }, [fetchProducts]);

// Handle search filtering
useEffect(() => {
const lowerCaseQuery = searchQuery.toLowerCase();
const results = products.filter((product) =>
product.name.toLowerCase().includes(lowerCaseQuery) ||
product.description.toLowerCase().includes(lowerCaseQuery) ||
product.category.toLowerCase().includes(lowerCaseQuery) ||
(product.supplierInfo && product.supplierInfo.toLowerCase().includes(lowerCaseQuery)) ||
product.price.toString().includes(lowerCaseQuery) ||
product.quantity.toString().includes(lowerCaseQuery)
);
setFilteredProducts(results);
}, [searchQuery, products]);


// --- PDF Download Handler ---
const handleDownloadReport = async () => {
console.log("Initiating PDF download...");
setError(null);
try {
// *** Use the new constant name for the base URL ***
const reportURL = `${PRODUCTS_API_URL}/report/pdf`;
console.log(`Requesting PDF from: ${reportURL}`);
const response = await axios.get(reportURL, {
responseType: 'blob',
});

console.log("Received response from server. Status:", response.status);

if (response.data instanceof Blob && response.data.type === 'application/pdf') {
console.log("Response is a PDF Blob. Size:", response.data.size);
const file = new Blob([response.data], { type: 'application/pdf' });

// *** Now 'URL' refers to the correct browser object ***
console.log("Checking window.URL object before createObjectURL:", typeof window.URL, window.URL); // Use window.URL explicitly if needed, but just URL should work now

if (typeof URL.createObjectURL === 'function') { // This check should now pass
const fileURL = URL.createObjectURL(file);
console.log("Blob URL created:", fileURL);

const link = document.createElement('a');
link.href = fileURL;
const filename = `inventory_report_${Date.now()}.pdf`;
link.setAttribute('download', filename);
document.body.appendChild(link);
console.log(`Clicking download link for: ${filename}`);
link.click();

console.log("Cleaning up download link and Blob URL...");
document.body.removeChild(link);
URL.revokeObjectURL(fileURL); // Use the global URL here too
console.log("Cleanup complete.");
} else {
console.error("FATAL: URL.createObjectURL is still not available or not a function!");
setError("Failed to download PDF: Browser function unavailable (createObjectURL).");
alert("Failed to download PDF: Browser function unavailable. Check console.");
}

} else {
console.error("Received unexpected response type or data format.");
console.error("Response Data:", response.data);
let errorMsg = "Failed to download PDF: Unexpected response from server.";
if (response.data instanceof Blob) {
try {
const errorText = await response.data.text();
console.error("Error response content (as text):", errorText);
errorMsg = `Failed to download PDF. Server Error: ${errorText.substring(0, 150)}...`;
} catch (textError) { console.error("Could not read error response blob as text.", textError); }
}
setError(errorMsg);
alert(errorMsg + " Check console for details.");
}

} catch (err) {
console.error("!!! Error during PDF download request:", err.response || err.message || err);
let errorMsg = `Failed to download PDF report: ${err.message || 'Network or server error'}`;
if (err.response) {
console.error("Server Error Response Data:", err.response.data);
errorMsg = `Failed to download PDF report: ${err.response.data.message || `Server error ${err.response.status}`}`;
}
setError(errorMsg);
alert(errorMsg + " Check console for details.");
}
};

// --- WhatsApp Handler (No changes needed) ---
const handleSendWhatsApp = () => {
const productCount = filteredProducts.length;
const lowStockCount = filteredProducts.filter(p => p.quantity <= (p.lowStockThreshold ?? 5)).length;
const message = `Inventory Summary:\nTotal Products: ${productCount}\nLow Stock Items: ${lowStockCount}\n\n(Automated message)`;
const phoneNumber = "+94722495421"; // Replace if needed
const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
window.open(whatsappUrl, "_blank", "noopener,noreferrer");
};

// --- Render Logic (No changes needed) ---
return (
<div className="products-page-container">
<div className="products-content"> <h1>Product Inventory</h1>
<div className="toolbar">
<div className="search-container">
<input type="text" name="search" className="search-input" placeholder="Search by name, category, supplier..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search Products"/>
</div>
<div className="action-buttons">
<button className="action-btn download-btn" onClick={handleDownloadReport}> Download PDF Report </button>
<button className="action-btn whatsapp-btn" onClick={handleSendWhatsApp}> Send Summary (WhatsApp) </button>
</div>
</div>
{isLoading && <p className="loading-message">Loading products...</p>}
{error && <p className="error-message">{error}</p>}
{!isLoading && !error && (
filteredProducts.length === 0 ? (
<p className="no-results"> {products.length > 0 ? "No products match your search." : "No products found in inventory."} </p>
) : (
<div className="products-grid">
{filteredProducts.map((product) => (
<Product key={product._id} product={product} refreshProducts={fetchProducts} />
))}
</div>
)
)}
</div>
</div>
);
}
export default Products;
