import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetailPage.css'; // Create this CSS file

const BACKEND_URL = "http://localhost:5000"; // Ensure this is correct

function ProductDetailPage() {
const { productId } = useParams(); // Get the ID from the URL parameter
const navigate = useNavigate();
const [product, setProduct] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
const fetchProductDetails = async () => {
setIsLoading(true);
setError(null);
console.log(`Fetching details for product ID: ${productId}`);
try {
const response = await axios.get(`${BACKEND_URL}/products/${productId}`);
console.log("Product data received:", response.data);
setProduct(response.data.product); // Assuming backend returns { product: {...} }
} catch (err) {
console.error("Error fetching product details:", err.response || err.message);
if (err.response && err.response.status === 404) {
setError("Product not found.");
} else {
setError("Failed to load product details. Please try again.");
}
setProduct(null);
} finally {
setIsLoading(false);
}
};

if (productId) {
fetchProductDetails();
} else {
setError("No product ID provided."); // Should not happen with correct routing
setIsLoading(false);
}

}, [productId]); // Re-fetch if productId changes

const getImageUrl = (imagePath) => {
if (imagePath && imagePath !== "/default-product-image.jpg") {
return `${BACKEND_URL}${imagePath}`;
}
return "/default-product-image.jpg"; // Path in frontend public folder
};

// Handler to navigate to update page
const handleUpdateClick = () => {
navigate(`/productdetails/${productId}/update`);
};

// Handler to navigate to history page
const handleHistoryClick = () => {
navigate(`/productdetails/${productId}/history`);
};


// --- Render Logic ---
if (isLoading) {
return (
<div>

<div className="detail-page-container loading">Loading product details...</div>
</div>
);
}

if (error) {
return (
<div>

<div className="detail-page-container error">
Error: {error} <br />
<Link to="/productdetails">Back to Product List</Link>
</div>
</div>
);
}

if (!product) {
// This case might be redundant if error handles 'not found', but good practice
return (
<div>

<div className="detail-page-container">Product data unavailable.</div>
</div>
);
}

// Product loaded successfully
const isLowStock = product.quantity <= product.lowStockThreshold;

return (
<div>

<div className="detail-page-container">
<Link to="/productdetails" className="back-link">&larr; Back to Product List</Link>

<div className="product-detail-content">
<div className="product-detail-image-container">
<img
src={getImageUrl(product.imageUrl)}
alt={product.name}
className="product-detail-image"
onError={(e) => { e.target.onerror = null; e.target.src="/default-product-image.jpg"; }}
/>
{isLowStock && <span className="low-stock-badge detail-low-stock">Low Stock</span>}
</div>

<div className="product-detail-info">
<h1>{product.name}</h1>
<p className="product-detail-category">Category: {product.category}</p>
<p className="product-detail-description">{product.description}</p>
<hr />
<p><strong>Price:</strong> LKR {product.price.toFixed(2)}</p>
<p><strong>Quantity in Stock:</strong> {product.quantity}</p>
<p><strong>Low Stock Threshold:</strong> {product.lowStockThreshold}</p>
{product.supplierInfo && <p><strong>Supplier Info:</strong> {product.supplierInfo}</p>}
<p><strong>Last Updated:</strong> {new Date(product.updatedAt).toLocaleString('en-LK', { timeZone: 'Asia/Colombo' })}</p>

<div className="product-detail-actions">
<button onClick={handleUpdateClick} className="action-button update-button">Update Product</button>
<button onClick={handleHistoryClick} className="action-button history-button">View History</button>
{/* Add Sale/Restock buttons here if needed on detail page */}
</div>
</div>
</div>
</div>
</div>
);
}

export default ProductDetailPage;
