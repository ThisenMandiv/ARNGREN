// src/pages/User/UserOrderHistory/UserOrderHistory.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserNav from '../../../Components/UserNav/UserNav'; // Adjust path
import { AuthContext } from '../../../context/AuthContext'; // To get user name
import './UserOrderHistory.css'; // Create this CSS

const API_BASE_URL = "http://localhost:5000";

function UserOrderHistory() {
    const authCtx = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            // Ensure user context is loaded before fetching
            if (!authCtx.isLoggedIn || !authCtx.user?.name) {
                setError("User data not available. Please log in again.");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                // Fetch ALL orders (Backend ideally should have a /my-orders endpoint)
                const response = await axios.get(`${API_BASE_URL}/orders`);
                const allOrders = response.data.orders || [];

                // --- Frontend Filtering (Insecure Placeholder) ---
                // Filter orders where userName matches the logged-in user's name
                const userOrders = allOrders.filter(order => order.userName === authCtx.user.name);
                // --- End Placeholder ---

                console.log(`Found ${userOrders.length} orders for user ${authCtx.user.name}`);
                setOrders(userOrders);

            } catch (err) {
                console.error("Error fetching order history:", err);
                setError(`Failed to load order history: ${err.response?.data?.message || 'Server error'}`);
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
        // Dependency array includes user info to refetch if user changes (though unlikely in this flow)
    }, [authCtx.isLoggedIn, authCtx.user?.name]);

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-LK', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
        } catch (e) { return 'Invalid Date'; }
    };

     // Status badge helper
    const getStatusClass = (status) => `order-status-badge status-${status?.toLowerCase() || 'unknown'}`;


    return (
        <div>
            <UserNav />
            <div className="user-page-container"> {/* Use a common container class */}
                <h1>Your Order History</h1>
                <Link to="/profile" className="back-link">&larr; Back to Profile</Link>

                {isLoading && <p className="loading-message">Loading order history...</p>}
                {error && <p className="error-message">{error}</p>}

                {!isLoading && !error && (
                    orders.length === 0 ? (
                        <p className="no-results-message">You haven't placed any orders yet.</p>
                    ) : (
                        <div className="order-history-list">
                            {orders.map((order) => (
                                <div key={order._id} className="order-history-item">
                                    <div className="order-item-header">
                                        <h3>Order #{order._id.slice(-8)}</h3> {/* Shortened ID */}
                                        <span className={getStatusClass(order.status)}>{order.status}</span>
                                    </div>
                                    <div className="order-item-body">
                                        <p><strong>Date:</strong> {formatDate(order.date)}</p>
                                        <p><strong>Items:</strong> {order.product} ({order.quantity} total items)</p> {/* Display summary */}
                                        <p><strong>Delivering To:</strong> {order.deliveryAddress}</p>
                                        {/* Add Total Amount if available in order model */}
                                        {/* <p><strong>Total:</strong> LKR {order.totalAmount?.toFixed(2)}</p> */}
                                    </div>
                                     {/* Optional: Link to a detailed order view page if you create one */}
                                     {/* <div className="order-item-footer">
                                         <Link to={`/order/${order._id}`}>View Details</Link>
                                     </div> */}
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default UserOrderHistory;
