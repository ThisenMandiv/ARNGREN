// src/components/Layout/UserNav/UserNav.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import './UserNav.css';

const UserNav = () => {
  const { items } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="user-nav">
      <div className="nav-container">
        <Link to={user && user.role === 'admin' ? '/admin' : '/'} className="nav-logo">
          JADE JEWELLERS
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/discounts" className="nav-link">Discounts</Link>
          <Link to="/promotions" className="nav-link">Promotions</Link>
          <Link to="/events" className="nav-link">Events</Link>
          <Link to="/blog" className="nav-link">Blog</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/raise-ticket" className="nav-link">Raise a Ticket</Link>
          <Link to="/view-tickets" className="nav-link">View Tickets</Link>
          <Link to="/my-customizations" className="nav-link">My Customizations</Link>
        </div>

        <div className="nav-actions">
          <Link to="/cart" className="nav-action cart-link">
            <FiShoppingCart className="nav-icon" />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
          <Link to="/profile" className="nav-action">
            <FiUser className="nav-icon" />
          </Link>
          <button className="nav-action logout-btn" onClick={handleLogout}>
            <FiLogOut className="nav-icon" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default UserNav;
