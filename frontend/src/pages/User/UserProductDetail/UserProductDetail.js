import React, { useState, useEffect, useContext } from 'react'; // Import useContext
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserProductDetail.css';
import UserNav from '../../../Components/UserNav/UserNav';
import { CartContext } from '../../../context/CartContext'; // Import CartContext
import CustomizationModal from '../../../Components/customization/CustomizationModal';

const BACKEND_URL = "http://localhost:5000";

function UserProductDetail() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const cartCtx = useContext(CartContext); // Get cart context
    const [isCustomizationModalOpen, setCustomizationModalOpen] = useState(false);

    useEffect(() => {
        // ... (existing fetchProduct logic remains the same) ...
        const fetchProduct = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${BACKEND_URL}/products/${productId}`);
                setProduct(response.data.product);
            } catch (err) {
                console.error("Error fetching product details:", err.response || err.message);
                if (err.response && err.response.status === 404) {
                    setError("Product not found.");
                } else {
                    setError("Failed to load product details.");
                }
                setProduct(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        } else {
            setError("Invalid product request.");
            setIsLoading(false);
        }
    }, [productId]);


    const getImageUrl = (imagePath) => {
        // ... (existing logic) ...
        if (imagePath && imagePath !== "/default-product-image.jpg") {
            return `${BACKEND_URL}${imagePath}`;
        }
        return "/default-product-image.jpg";
    };

    // --- Add to Cart Handler ---
    const handleAddToCart = () => {
        if (product) {
            // Pass the necessary product details
            cartCtx.addItem({
                _id: product._id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl // Optional: for cart display
                // Add other details if needed in the cart
            });
            alert(`${product.name} added to cart!`); // Simple feedback
        }
    };
    // --- Customizations Handler ---
    const handleCustomizations = () => {
        setCustomizationModalOpen(true);
    };
    // --- End Add to Cart Handler ---


    if (isLoading) {
        // ... (existing loading state) ...
         return <div><UserNav /><div className="user-detail-container loading">Loading...</div></div>;
    }

    if (error) {
        // ... (existing error state) ...
         return <div><UserNav /><div className="user-detail-container error">Error: {error} <Link to="/products">Back to Products</Link></div></div>;
    }

    if (!product) {
        // ... (existing no product state) ...
         return <div><UserNav /><div className="user-detail-container">Product not available. <Link to="/products">Back to Products</Link></div></div>;
    }

    return (
        <div>
            <UserNav />
            <div className="user-detail-container">
                {/* ... (breadcrumb) ... */}
                 <div className="user-detail-breadcrumb">
                    <Link to="/products">Products</Link> &gt; {product.category} &gt; {product.name}
                </div>
                <div className="user-detail-content">
                    {/* ... (image section) ... */}
                    <div className="user-detail-image-section">
                        <img
                            src={getImageUrl(product.imageUrl)}
                            alt={product.name}
                            onError={(e) => { e.target.onerror = null; e.target.src="/default-product-image.jpg"; }}
                        />
                    </div>
                    <div className="user-detail-info-section">
                        {/* ... (product info, price, stock status) ... */}
                         <h1>{product.name}</h1>
                        <span className="user-detail-category">{product.category}</span>
                        <p className="user-detail-description">{product.description}</p>
                        <p className="user-detail-price">LKR {product.price.toFixed(2)}</p>

                        {product.quantity > 0 ? (
                            product.quantity <= product.lowStockThreshold ? (
                                <p className="stock-status low-stock">Low Stock!</p>
                            ) : (
                                <p className="stock-status in-stock">In Stock ({product.quantity} available)</p>
                            )
                        ) : (
                            <p className="stock-status out-of-stock">Out of Stock</p>
                        )}

                        {/* Updated Add to Cart and Customizations Buttons */}
                        <button
                            className="add-to-cart-btn"
                            disabled={product.quantity === 0}
                            onClick={handleAddToCart}
                        >
                            {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button
                            className="customizations-btn"
                            onClick={handleCustomizations}
                            style={{ marginLeft: '1rem' }}
                        >
                            Customizations
                        </button>
                        <CustomizationModal
                            isOpen={isCustomizationModalOpen}
                            onClose={() => setCustomizationModalOpen(false)}
                            product={product}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProductDetail;
