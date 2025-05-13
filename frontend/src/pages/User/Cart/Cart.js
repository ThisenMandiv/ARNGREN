// src/pages/User/Cart/Cart.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // Ensure Link is imported
import UserNav from '../../../Components/UserNav/UserNav';
import { useCart } from '../../../context/CartContext';
import './Cart.css';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

const BACKEND_URL = "http://localhost:5000";

function Cart() {
    const { items, removeItem, getTotalAmount, updateQuantity, clearCart } = useCart();

    const handleQuantityChange = (id, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity > 0) {
            updateQuantity(id, newQuantity);
        }
    };

    const handleRemoveItem = (id) => {
        if (window.confirm('Are you sure you want to remove this item from the cart?')) {
            removeItem(id);
        }
    };

    const getImageUrl = (imagePath) => {
        if (imagePath && imagePath !== "/default-product-image.jpg") {
            return `${BACKEND_URL}${imagePath}`;
        }
        return "/default-product-image.jpg";
    };

    return (
        <div>
            <UserNav />
            <div className="cart-page-container">
                <h1>Your Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className="cart-empty">
                        <p>Your cart is currently empty.</p>
                        <Link to="/products" className="start-shopping-btn">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items-list">
                            {items.map((item) => (
                                <div key={item._id} className="cart-item">
                                    <div className="cart-item-image">
                                        <img src={getImageUrl(item.imageUrl)} alt={item.name} onError={(e) => { e.target.onerror = null; e.target.src="/default-product-image.jpg"; }}/>
                                    </div>
                                    <div className="cart-item-details">
                                        <h3>{item.name}</h3>
                                        <p>Price: LKR {item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="cart-item-quantity">
                                        <button onClick={() => handleQuantityChange(item._id, item.quantity, -1)} aria-label="Decrease quantity">
                                            <FiMinus />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item._id, item.quantity, 1)} aria-label="Increase quantity">
                                            <FiPlus />
                                        </button>
                                    </div>
                                    <div className="cart-item-total">
                                        LKR {(item.price * item.quantity).toFixed(2)}
                                    </div>
                                    <div className="cart-item-remove">
                                        <button onClick={() => handleRemoveItem(item._id)} aria-label="Remove item">
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h2>Cart Summary</h2>
                            <div className="summary-row">
                                <span>Subtotal ({items.length} items):</span>
                                <span>LKR {getTotalAmount().toFixed(2)}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total:</span>
                                <span>LKR {getTotalAmount().toFixed(2)}</span>
                            </div>

                            <Link to="/checkout" className="checkout-button">
                                Proceed to Checkout
                            </Link>

                            <button className="clear-cart-button" onClick={clearCart}>
                                Clear Cart
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
