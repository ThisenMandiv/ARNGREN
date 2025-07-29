// src/pages/User/UserProfile/UserProfile.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  console.log('UserProfile - Current user data:', user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="profile-container">
        <p>Please log in to view your profile.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      
      <div className="profile-card">
        <div className="profile-info">
          <div className="info-item">
            <label>Name:</label>
            <span>{user.name}</span>
          </div>
          
          <div className="info-item">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          
          {user.age && (
            <div className="info-item">
              <label>Age:</label>
              <span>{user.age}</span>
            </div>
          )}
          
          {user.address && (
            <div className="info-item">
              <label>Address:</label>
              <span>{user.address}</span>
            </div>
          )}
        </div>
        
        <div className="profile-actions">
          <Link to="/profile/edit" className="btn btn-primary">
            Edit Profile
          </Link>
          
          <Link to="/my-ads" className="btn btn-secondary">
            My Ads
          </Link>
          
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
