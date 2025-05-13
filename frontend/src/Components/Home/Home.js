import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import "./Home.css";
import axios from 'axios';

function Home() {
const [products, setProducts] = useState([]);
const [isLoading, setIsLoading] = useState(true); // Added loading state
const [error, setError] = useState(null); // Added error state
const backendURL = "http://localhost:5000"; // Define your backend URL

useEffect(() => {
const fetchProducts = async () => {
setIsLoading(true); // Start loading
setError(null); // Clear previous errors
try {
// Fetch all products
const response = await axios.get(`${backendURL}/products`);
setProducts(response.data.products || []); // Ensure products is an array
} catch (error) {
console.error("Error fetching products:", error);
setError("Failed to load featured products. Please try again later."); // Set error message
setProducts([]); // Clear products on error
} finally {
setIsLoading(false); // Stop loading regardless of success/failure
}
};

fetchProducts();
}, []); // Empty dependency array means this runs once on mount

// --- Filtering Logic ---
// Filter for Gemstones category
const gemstones = products.filter(product => product.category === 'Gemstones');

// Filter for Jewelry categories (adjust array as needed based on your exact categories)
const jewelryCategories = ['Rings', 'Necklaces', 'Bracelets', 'Earrings']; // Define jewelry categories
const jewelleries = products.filter(product => jewelryCategories.includes(product.category));

// --- Helper function for image source ---
const getImageUrl = (imagePath) => {
if (imagePath && imagePath !== "/default-product-image.jpg") {
// *** CORRECT URL CONSTRUCTION ***
return `${backendURL}${imagePath}`;
}
// Return path to default image in the frontend's public folder
return "/default-product-image.jpg";
};

return (
<div className="home-container">
<Nav />

{/* Hero Section */}
<div className="hero-section">
<div className="hero-content">
<h1>Gems & Jewelry Inventory Management</h1>
<p>
Track your precious gems and jewelry with ease. Ensure seamless stock
management, accurate valuations, and organized categorization.
</p>
</div>
</div>

{/* Display Loading or Error Message */}
{isLoading && <p className="loading-message">Loading featured items...</p>}
{error && <p className="error-message">{error}</p>}

{/* Featured Gems Section - Only render if not loading and no error */}
{!isLoading && !error && gemstones.length > 0 && (
<div className="featured-products">
<h2>Exquisite Gemstones</h2>
<div className="product-list">
{/* Display only the first few items, e.g., first 5 */}
{gemstones.slice(0, 5).map((gem) => (
<div key={gem._id} className="product-card">
<div className="product-card-image">
<img
src={getImageUrl(gem.imageUrl)}
alt={gem.name}
// Add onError handler for fallback
onError={(e) => { e.target.onerror = null; e.target.src="/default-product-image.jpg"; }}
/>
</div>
<div className="product-card-details">
<h3>{gem.name}</h3>
<p>{gem.description}</p>
</div>
</div>
))}
</div>
</div>
)}
{!isLoading && !error && gemstones.length === 0 && (
<div className="featured-products"><p className="no-results">No gemstones to display.</p></div>
)}


{/* Featured Jewelleries Section - Only render if not loading and no error */}
{!isLoading && !error && jewelleries.length > 0 && (
<div className="featured-products">
<h2>Featured Jewelleries</h2>
<div className="product-list">
{/* Display only the first few items, e.g., first 5 */}
{jewelleries.slice(0, 5).map((jewelry) => (
<div key={jewelry._id} className="product-card">
<div className="product-card-image">
<img
src={getImageUrl(jewelry.imageUrl)}
alt={jewelry.name}
// Add onError handler for fallback
onError={(e) => { e.target.onerror = null; e.target.src="/default-product-image.jpg"; }}
/>
</div>
<div className="product-card-details">
<h3>{jewelry.name}</h3>
<p>{jewelry.description}</p>
</div>
</div>
))}
</div>
</div>
)}
{!isLoading && !error && jewelleries.length === 0 && (
<div className="featured-products"><p className="no-results">No jewelry items to display.</p></div>
)}

</div>
);
}

export default Home;
