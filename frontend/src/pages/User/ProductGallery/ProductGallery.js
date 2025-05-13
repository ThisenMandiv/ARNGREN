import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProductGallery.css';
import UserNav from '../../../Components/UserNav/UserNav';
import { FiSearch } from 'react-icons/fi'; // Import search icon

const BACKEND_URL = "http://localhost:5000";

function ProductGallery() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State for search input
    // Coupon state
    const [couponCode, setCouponCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState(null); // { percentage, code }
    const [couponMessage, setCouponMessage] = useState("");
    const [isCouponLoading, setIsCouponLoading] = useState(false);

    // Fetch all products once on mount
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${BACKEND_URL}/products`);
                setProducts(response.data.products || []);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Could not load products. Please try again later.");
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // --- Frontend Filtering Logic (Placeholder) ---
    // In a real app, you'd trigger a new API call with the search term:
    // useEffect(() => { fetchProducts(searchTerm); }, [searchTerm]);
    const filteredProducts = useMemo(() => {
        if (!searchTerm) {
            return products; // No search term, return all products
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return products.filter(product =>
            product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            product.category.toLowerCase().includes(lowerCaseSearchTerm) ||
            product.description.toLowerCase().includes(lowerCaseSearchTerm)
            // Add more fields to search if needed (e.g., supplierInfo)
        );
    }, [products, searchTerm]); // Recalculate only when products or searchTerm change
    // --- End Placeholder ---

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const getImageUrl = (imagePath) => {
        if (imagePath && imagePath !== "/default-product-image.jpg") {
            return `${BACKEND_URL}${imagePath}`;
        }
        return "/default-product-image.jpg";
    };

    // Coupon apply logic
    const handleCouponApply = async () => {
        setCouponMessage("");
        setIsCouponLoading(true);
        try {
            const res = await axios.post(`${BACKEND_URL}/api/coupons/validate`, { code: couponCode });
            if (res.data.valid || res.data.coupon) {
                // Accept either valid: true or coupon object
                const percentage = res.data.percentage || (res.data.coupon && res.data.coupon.percentage);
                setAppliedDiscount({ percentage, code: couponCode });
                setCouponMessage(`Coupon applied! ${percentage}% off on all products.`);
            } else {
                setAppliedDiscount(null);
                setCouponMessage(res.data.message || "Invalid coupon code.");
            }
        } catch (err) {
            setAppliedDiscount(null);
            setCouponMessage(err.response?.data?.message || "Invalid or expired coupon code.");
        } finally {
            setIsCouponLoading(false);
        }
    };

    // Calculate discounted price
    const getDiscountedPrice = (price) => {
        if (appliedDiscount && appliedDiscount.percentage) {
            return (price * (1 - appliedDiscount.percentage / 100)).toFixed(2);
        }
        return price.toFixed(2);
    };

    return (
        <div>
            <UserNav />
            <div className="product-gallery-container">
                <h1>Our Products</h1>

                {/* --- Search Bar --- */}
                <div className="gallery-search-bar">
                    <input
                        type="text"
                        placeholder="Search by name, category, description..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input-gallery"
                    />
                   
                </div>
                {/* --- End Search Bar --- */}

                {/* --- Coupon Section --- */}
                <div className="coupon-section">
                    <input
                        type="text"
                        placeholder="Enter coupon code"
                        className="coupon-input"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                        disabled={isCouponLoading}
                    />
                    <button className="coupon-button" onClick={handleCouponApply} disabled={isCouponLoading || !couponCode}>
                        {isCouponLoading ? "Applying..." : "Apply"}
                    </button>
                </div>
                {couponMessage && (
                    <div className="coupon-message">
                        {couponMessage}
                    </div>
                )}
                {/* --- End Coupon Section --- */}

                {isLoading && <p className="loading-message">Loading products...</p>}
                {error && <p className="error-message">{error}</p>}

                {!isLoading && !error && (
                    filteredProducts.length > 0 ? (
                        <div className="gallery-grid">
                            {filteredProducts.map(product => (
                                <Link to={`/product/${product._id}`} key={product._id} className="gallery-card-link">
                                    <div className="gallery-card">
                                        <div className="gallery-card-image">
                                             <img
                                                 src={getImageUrl(product.imageUrl)}
                                                 alt={product.name}
                                                 onError={(e) => { e.target.onerror = null; e.target.src="/default-product-image.jpg"; }}
                                             />
                                        </div>
                                        <div className="gallery-card-details">
                                            <h3>{product.name}</h3>
                                            <p className="gallery-card-category">{product.category}</p>
                                            <p className="gallery-card-price">
                                                LKR {getDiscountedPrice(product.price)}
                                                {appliedDiscount && appliedDiscount.percentage && (
                                                    <span className="original-price"> LKR {product.price.toFixed(2)}</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                         // Display message based on whether there was an initial search term
                        <p className="no-results-message">
                            {searchTerm ? `No products found matching "${searchTerm}".` : "No products available."}
                        </p>
                    )
                )}
            </div>
        </div>
    );
}

export default ProductGallery;
