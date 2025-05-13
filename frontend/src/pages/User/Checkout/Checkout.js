import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserNav from '../../../Components/UserNav/UserNav'; // Adjust path if needed
import { useCart } from '../../../context/CartContext';
import { AuthContext } from '../../../context/AuthContext'; // To get logged-in user info
import './Checkout.css';

const API_BASE_URL = "http://localhost:5000"; // Use a base URL

function Checkout() {
    const { items, getTotalAmount, clearCart } = useCart();
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userName: '',
        deliveryAddress: '',
        phone: '', // Optional but good practice
        // email: '', // Can be added if needed
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pre-fill name if user is logged in
    useEffect(() => {
        if (authCtx.isLoggedIn && authCtx.user) {
            setFormData(prev => ({ ...prev, userName: authCtx.user.name || '' }));
            // Optionally pre-fill email too if available and needed
            // setFormData(prev => ({ ...prev, email: authCtx.user.email || '' }));
        }
    }, [authCtx.isLoggedIn, authCtx.user]);

    // Redirect if cart is empty
    useEffect(() => {
        if (items.length === 0 && !isLoading) {
            console.log("Cart is empty, redirecting to products.");
            navigate('/products');
        }
    }, [items, isLoading, navigate]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Basic Validation
        if (!formData.userName || !formData.deliveryAddress) {
            setError("Please fill in your Name and Delivery Address.");
            return;
        }
        if (items.length === 0) {
             setError("Your cart is empty. Cannot proceed.");
             return;
        }

        setIsLoading(true);

        // --- Prepare data for the current backend structure ---
        // Create a summary description for the 'product' field
        let productDescription = "Multiple Items";
        if (items.length === 1) {
            productDescription = items[0].name;
        } else if (items.length > 1) {
             // More detailed summary if needed
             productDescription = `${items[0].name} and ${items.length - 1} other item(s)`;
        }

        const orderData = {
            userName: formData.userName,
            // Send summary description as 'product'
            product: productDescription,
            // Send total item count as 'quantity'
            quantity: items.length,
            deliveryAddress: formData.deliveryAddress,
            // Add phone/email if your backend model supports it
            // phone: formData.phone,
            date: new Date().toISOString(), // Send current date in ISO format
            // Optional: Send total amount if backend stores it
            // totalAmount: getTotalAmount(),
            // Status will be set to 'Pending' by the backend (as per AddOrder component logic)
        };
        // --- End Data Preparation ---


        try {
            console.log("Submitting Order:", orderData);
            const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
            console.log("Order submission response:", response.data);

            // Order successful
            clearCart(); // Clear the cart
            alert('Order placed successfully!'); // Simple success message
            // Redirect to a success page or home
            navigate('/'); // Redirect to home for now

        } catch (err) {
            console.error("Error placing order:", err.response || err);
            setError(`Failed to place order: ${err.response?.data?.message || 'Server error. Please try again.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Render nothing or a loading indicator if cart is empty and redirecting
     if (items.length === 0 && !isLoading) {
         return null; // Or a loading indicator while redirect happens
     }

    return (
        <div>
            <UserNav />
            <div className="checkout-page-container">
                <h1>Checkout</h1>
                <div className="checkout-content">
                    {/* Order Summary Section */}
                    <div className="order-summary-section">
                        <h2>Order Summary</h2>
                        {items.map(item => (
                            <div key={item._id} className="summary-item">
                                <span>{item.name} (x{item.quantity})</span>
                                <span>LKR {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <hr />
                        <div className="summary-total">
                            <strong>Total ({items.length} items):</strong>
                            <strong>LKR {getTotalAmount().toFixed(2)}</strong>
                        </div>
                    </div>

                    {/* Shipping Details Form Section */}
                    <div className="shipping-details-section">
                        <h2>Shipping Details</h2>
                        <form onSubmit={handleSubmit} noValidate>
                            {error && <p className="checkout-error">{error}</p>}
                            <div className="form-group">
                                <label htmlFor="userName">Full Name</label>
                                <input
                                    type="text"
                                    id="userName"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                             <div className="form-group">
                                <label htmlFor="phone">Phone Number (Optional)</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="deliveryAddress">Delivery Address</label>
                                <textarea
                                    id="deliveryAddress"
                                    name="deliveryAddress"
                                    rows="4"
                                    value={formData.deliveryAddress}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            {/* Add Email field if needed */}
                            {/* <div className="form-group">... Email Input ...</div> */}

                            <button type="submit" className="place-order-button" disabled={isLoading || items.length === 0}>
                                {isLoading ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
