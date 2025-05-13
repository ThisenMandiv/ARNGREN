import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Product.css'; // Adjust path if needed

function Product(props) {
    // Destructure props
    const { _id, name, description, price, quantity, category, imageUrl, lowStockThreshold = 5 } = props.product; // Removed unused supplierInfo
    const refreshProducts = props.refreshProducts;
    // const navigate = useNavigate(); // Removed unused navigate

    // State for errors and processing
    const [actionError, setActionError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const isLowStock = quantity <= lowStockThreshold;

    // Construct image URL
    const productImage = imageUrl && imageUrl !== "/default-product-image.jpg"
        ? `http://localhost:5000${imageUrl}` // Ensure your backend serves images correctly
        : "/default-product-image.jpg"; // Path to default image in public folder

    // --- Event Handlers (Delete, Sale, Restock) ---
    const handleDelete = async () => {
        if (isProcessing) return;
        const confirmation = window.confirm(`Are you sure you want to delete the product: ${name}? This action cannot be undone.`);
        if (confirmation) {
            setIsProcessing(true);
            setActionError('');
            try {
                // Use correct admin API endpoint if different, otherwise /products is fine
                await axios.delete(`http://localhost:5000/products/${_id}`);
                alert(`${name} deleted successfully.`);
                if (refreshProducts) refreshProducts(); // Refresh the list
            } catch (err) {
                console.error("Error deleting product:", err.response ? err.response.data : err.message);
                setActionError(`Failed to delete: ${err.response?.data?.message || 'Server error'}`);
                // Keep isProcessing false only on error here, success implies component removal
                 setIsProcessing(false);
            }
            // No finally block needed here if component unmounts on success
        }
    };

    const handleSale = async () => {
        if (isProcessing) return;
        const quantitySold = prompt(`Enter quantity sold for ${name} (Current stock: ${quantity}):`, "1");
        if (quantitySold === null) return; // User cancelled prompt
        const amount = Number(quantitySold);

        // Input validation
        if (isNaN(amount) || amount <= 0 || !Number.isInteger(amount)) {
            setActionError("Please enter a valid positive whole number for quantity sold.");
            return;
        }
        if (amount > quantity) {
            setActionError(`Cannot sell ${amount}, only ${quantity} in stock.`);
            return;
        }

        setIsProcessing(true);
        setActionError('');
        try {
            await axios.post(`http://localhost:5000/products/${_id}/sale`, { quantitySold: amount });
            alert(`Sale of ${amount} ${name}(s) recorded.`);
            if (refreshProducts) refreshProducts();
        } catch (err) {
            console.error("Error recording sale:", err.response ? err.response.data : err.message);
            setActionError(`Sale failed: ${err.response?.data?.message || 'Server error'}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRestock = async () => {
         if (isProcessing) return;
        const quantityRestocked = prompt(`Enter quantity restocked for ${name} (Current stock: ${quantity}):`, "10");
        if (quantityRestocked === null) return; // User cancelled prompt
        const amount = Number(quantityRestocked);

        // Input validation
        if (isNaN(amount) || amount <= 0 || !Number.isInteger(amount)) {
            setActionError("Please enter a valid positive whole number for quantity restocked.");
            return;
        }

        setIsProcessing(true);
        setActionError('');
        try {
            await axios.post(`http://localhost:5000/products/${_id}/restock`, { quantityRestocked: amount });
            alert(`Restock of ${amount} ${name}(s) recorded.`);
            if (refreshProducts) refreshProducts();
        } catch (err) {
            console.error("Error recording restock:", err.response ? err.response.data : err.message);
            setActionError(`Restock failed: ${err.response?.data?.message || 'Server error'}`);
        } finally {
            setIsProcessing(false);
        }
    };
    // --- End Event Handlers ---

    return (
        <div className={`product-card ${isLowStock ? 'low-stock' : ''}`}>
            {/* Link to the ADMIN update page, not the user detail page */}
            {/* Optional: Remove the main link wrapper if clicking the card shouldn't navigate */}
            {/* <Link to={`/admin/update/${_id}`} className="product-link-wrapper"> */}
                <div className="product-image-container">
                    <img src={productImage} alt={name} className="product-image" onError={(e) => { e.target.onerror = null; e.target.src="/default-product-image.jpg"; console.warn(`Error loading image: ${productImage}`) }} />
                    {isLowStock && <span className="low-stock-badge">Low Stock</span>}
                </div>
                <div className="product-details-summary">
                    <h3>{name}</h3>
                    <p className="product-description-summary">{description.substring(0, 80)}{description.length > 80 ? '...' : ''}</p>
                    <p><strong>Category:</strong> {category}</p>
                    <p><strong>Price:</strong> LKR {price.toFixed(2)}</p>
                    <p><strong>Quantity:</strong> {quantity}</p>
                </div>
            {/* </Link> */} {/* End Optional Link Wrapper */}


            {/* Admin Actions */}
            <div className="product-actions">
                <button onClick={handleSale} className="action-button sale-button" disabled={isProcessing || quantity <= 0}> Record Sale </button>
                <button onClick={handleRestock} className="action-button restock-button" disabled={isProcessing}> Restock </button>
                {/* Link to the ADMIN update page */}
                <Link to={`/admin/update/${_id}`} className="action-button update-link"> Update </Link>
                 {/* Link to the ADMIN history page */}
                <Link to={`/admin/history/${_id}`} className="action-button history-link"> History </Link>
                <button onClick={handleDelete} className="action-button delete-button" disabled={isProcessing}> Delete </button>
                {actionError && <p className="error-message product-action-error">{actionError}</p>}
            </div>
        </div>
    );
}
export default Product;
