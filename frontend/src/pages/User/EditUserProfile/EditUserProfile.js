// src/pages/User/EditUserProfile/EditUserProfile.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import UserNav from '../../../Components/UserNav/UserNav'; // Adjust path
import { AuthContext } from '../../../context/AuthContext'; // Import AuthContext
import './EditUserProfile.css'; // Create this CSS

const API_BASE_URL = "http://localhost:5000";

function EditUserProfile() {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', age: '', address: '',
    });
    const [isLoading, setIsLoading] = useState(false); // For submission state
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // Populate form with current user data on load
    useEffect(() => {
        if (authCtx.isLoggedIn && authCtx.user) {
            setFormData({
                name: authCtx.user.name || '',
                age: authCtx.user.age || '',
                address: authCtx.user.address || '',
                // Do NOT include email or password here for editing by user
            });
        } else {
            // Redirect if not logged in (although UserProtectedRoute should handle this)
            navigate('/login');
        }
    }, [authCtx.isLoggedIn, authCtx.user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (validationErrors[e.target.name]) {
            setValidationErrors(prev => ({ ...prev, [e.target.name]: null }));
        }
        if(error) setError(null);
    };

    // Frontend Validation
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (formData.name.length > 40) newErrors.name = "Name cannot exceed 40 characters";
        if (isNaN(formData.age) || formData.age === "" || Number(formData.age) <= 0) newErrors.age = "Age must be a positive number";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setValidationErrors({});

        if (!validateForm()) {
            setError("Please fix the errors in the form.");
            return;
        }

        // Ensure user ID is available
        if (!authCtx.user?._id) {
             setError("User information is missing. Please log in again.");
             return;
        }

        setIsLoading(true);

        // Prepare payload - only send fields user can edit
        const payload = {
            name: formData.name,
            age: Number(formData.age),
            address: formData.address,
            // Do NOT send email, password, or role from here
        };
        console.log("Submitting Profile Update Payload:", payload);

        try {
            // Use the existing admin update endpoint (PUT /users/:id)
            // Ideally, create a dedicated PUT /api/profile endpoint on backend
            const response = await axios.put(`${API_BASE_URL}/users/${authCtx.user._id}`, payload, {
                 headers: {
                     'Content-Type': 'application/json',
                     // If using JWT, send token:
                     // 'Authorization': `Bearer ${authCtx.token}`
                 }
            });

            console.log("Update response:", response.data);
            alert("Profile updated successfully!");

            // --- IMPORTANT: Update Auth Context ---
            // Update the user info stored in the AuthContext state and localStorage
            // This ensures the UI reflects the changes immediately
            const updatedUser = {
                ...authCtx.user, // Keep existing id, email, role etc.
                name: payload.name,
                age: payload.age,
                address: payload.address,
            };
            // Assuming your login handler in AuthContext also updates localStorage
            authCtx.login(updatedUser, authCtx.token); // Re-use login to update state/storage
            // --- End Update Auth Context ---

            navigate('/profile'); // Go back to profile view

        } catch (err) {
            console.error("Error updating profile:", err.response || err);
            const backendErrorMessage = err.response?.data?.message || 'Failed to update profile. Please try again.';
            const backendValidationErrors = err.response?.data?.errors;
             if (backendValidationErrors && Array.isArray(backendValidationErrors)) {
                 setError(`Validation Failed: ${backendValidationErrors.join(', ')}`);
             } else {
                 setError(backendErrorMessage);
             }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <UserNav />
            <div className="user-page-container"> {/* Reuse common container */}
                <h1>Edit Your Profile</h1>
                <Link to="/profile" className="back-link">&larr; Back to Profile</Link>

                {/* Reuse admin form container styles */}
                <div className="admin-form-container edit-profile-form">
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input type="text" id="name" name="name" onChange={handleChange} value={formData.name} required aria-invalid={!!validationErrors.name}/>
                            {validationErrors.name && <span className="validation-error">{validationErrors.name}</span>}
                        </div>

                        {/* Email is usually not editable by user */}
                        <div className="form-group">
                            <label htmlFor="email">Email (Cannot be changed):</label>
                            <input type="email" id="email" name="email" value={authCtx.user?.email || ''} required disabled />
                        </div>

                        <div className="form-group">
                            <label htmlFor="age">Age:</label>
                            <input type="number" id="age" name="age" onChange={handleChange} value={formData.age} required aria-invalid={!!validationErrors.age}/>
                            {validationErrors.age && <span className="validation-error">{validationErrors.age}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Address:</label>
                            <textarea id="address" name="address" rows="3" onChange={handleChange} value={formData.address} required aria-invalid={!!validationErrors.address}></textarea>
                            {validationErrors.address && <span className="validation-error">{validationErrors.address}</span>}
                        </div>

                        {/* Add link to change password page later */}
                        {/* <Link to="/change-password">Change Password</Link> */}

                        <div className="form-actions">
                            <button type="submit" className="submit-button" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <Link to="/profile" className="cancel-button">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditUserProfile;
