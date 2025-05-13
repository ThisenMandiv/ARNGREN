// src/pages/User/UserProfile/UserProfile.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <<< Import useNavigate
import UserNav from '../../../Components/UserNav/UserNav';
import { AuthContext } from '../../../context/AuthContext';
import './UserProfile.css';

function UserProfile() {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate(); // <<< Initialize navigate

    // Check if user data is available
    if (!authCtx.isLoggedIn || !authCtx.user) {
        // ... (safeguard remains the same) ...
         return (
            <div> <UserNav /> <div className="user-profile-container error"> <p>Please log in to view your profile.</p> <Link to="/login">Login</Link> </div> </div>
         );
    }

    const { name, email, age, address } = authCtx.user;

    // --- Button Handlers ---
    const handleEditProfileClick = () => {
        navigate('/profile/edit'); // <<< Navigate to edit page
    };

    const handleOrderHistoryClick = () => {
        navigate('/order-history'); // <<< Navigate to order history page
    };

    const handleLogoutClick = () => {
        authCtx.logout();
        // Optional: Navigate home after logout
        navigate('/');
    };
    // --- End Button Handlers ---

    return (
        <div>
            <UserNav />
            <div className="user-profile-container">
                <h1>Your Profile</h1>
                <div className="profile-details-card">
                    {/* ... (profile detail items remain the same) ... */}
                     <div className="profile-detail-item"> <span className="detail-label">Name:</span> <span className="detail-value">{name || 'N/A'}</span> </div>
                    <div className="profile-detail-item"> <span className="detail-label">Email:</span> <span className="detail-value">{email || 'N/A'}</span> </div>
                    <div className="profile-detail-item"> <span className="detail-label">Age:</span> <span className="detail-value">{age || 'N/A'}</span> </div>
                    <div className="profile-detail-item"> <span className="detail-label">Address:</span> <span className="detail-value">{address || 'N/A'}</span> </div>

                    <div className="profile-actions">
                        {/* Use onClick handlers */}
                        <button className="profile-action-button" onClick={handleEditProfileClick}>
                            Edit Profile
                        </button>
                        <button className="profile-action-button" onClick={handleOrderHistoryClick}>
                            View Order History
                        </button>
                        <button className="profile-action-button logout" onClick={handleLogoutClick}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
