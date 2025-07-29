// src/components/Layout/UserNav/UserNav.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiUser, FiLogOut } from 'react-icons/fi';
import './UserNav.css';

const UserNav = () => {
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
          ARNGREN
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/ads" className="nav-link">Browse Ads</Link>
          <Link to="/post-ad" className="nav-link">Post Ad</Link>
          <Link to="/my-ads" className="nav-link">My Ads</Link>
        </div>

        <div className="nav-actions">
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
