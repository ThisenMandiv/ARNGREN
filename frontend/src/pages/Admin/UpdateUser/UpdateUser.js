// src/pages/Admin/UpdateUser/UpdateUser.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './UpdateUser.css'; // Create or use shared admin form CSS

const API_BASE_URL = "http://localhost:5000/api";

function UpdateUser() {
    const { id } = useParams();
    const history = useNavigate(); // Changed from navigate for consistency with user code
    const [inputs, setInputs] = useState({
        name: '', age: '', address: '', email: '', role: 'user' // Initialize role
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // Fetch user data
    useEffect(() => {
        const fetchHandler = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await axios.get(`${API_BASE_URL}/users/${id}`);
                if (res.data.user) {
                    // Don't fetch/set password
                    setInputs({
                        name: res.data.user.name || '',
                        age: res.data.user.age || '',
                        address: res.data.user.address || '',
                        email: res.data.user.email || '',
                        role: res.data.user.role || 'user' // Set role from fetched data
                    });
                } else {
                    setError("User data not found in response.");
                }
            } catch (err) {
                console.error("Error fetching user:", err);
                setError(`Failed to load user data: ${err.response?.data?.message || 'Server error'}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHandler();
    }, [id]);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
         // Clear validation error for the field being changed
         if (validationErrors[e.target.name]) {
             setValidationErrors(prev => ({ ...prev, [e.target.name]: null }));
         }
         if(error) setError(null);
    };

    // Basic Frontend Validation
    const validateForm = () => {
        const newErrors = {};
        if (!inputs.name.trim()) newErrors.name = "Name is required";
        if (inputs.name.length > 40) newErrors.name = "Name should be less than 40 characters";
        if (isNaN(inputs.age) || inputs.age === "" || Number(inputs.age) <= 0) newErrors.age = "Age should be a positive number";
        if (!inputs.email.includes('@')) newErrors.email = "Please enter a valid email";
        if (!inputs.address.trim()) newErrors.address = "Address is required";
        if (!['user', 'admin'].includes(inputs.role)) newErrors.role = "Invalid role selected";
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

        setIsSubmitting(true);

        const payload = {
            name: inputs.name,
            age: Number(inputs.age),
            address: inputs.address,
            email: inputs.email,
            role: inputs.role
        };
        console.log("Submitting Update Payload:", payload);

        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`${API_BASE_URL}/users/${id}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            alert("User updated successfully!");
            history("/admin/users");
        } catch (err) {
            console.error("Error updating user:", err.response || err);
            const backendErrorMessage = err.response?.data?.message || 'An unexpected server error occurred.';
            const backendValidationErrors = err.response?.data?.errors;
            if (backendValidationErrors && Array.isArray(backendValidationErrors)) {
                setError(`Validation Failed: ${backendValidationErrors.join(', ')}`);
            } else {
                setError(`Failed to update user: ${backendErrorMessage}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

     if (isLoading) {
        return <div className="admin-form-container loading">Loading user data...</div>;
    }

    return (
        <div className="admin-form-container"> {/* Reuse admin form styles */}
            <h1>Update User Details</h1>
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" onChange={handleChange} value={inputs.name || ""} required aria-invalid={!!validationErrors.name}/>
                    {validationErrors.name && <span className="validation-error">{validationErrors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" onChange={handleChange} value={inputs.email || ""} required aria-invalid={!!validationErrors.email}/>
                     {validationErrors.email && <span className="validation-error">{validationErrors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="age">Age:</label>
                    <input type="number" id="age" name="age" onChange={handleChange} value={inputs.age || ""} required aria-invalid={!!validationErrors.age}/>
                     {validationErrors.age && <span className="validation-error">{validationErrors.age}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <textarea id="address" name="address" rows="3" onChange={handleChange} value={inputs.address || ""} required aria-invalid={!!validationErrors.address}></textarea>
                     {validationErrors.address && <span className="validation-error">{validationErrors.address}</span>}
                </div>

                 <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select id="role" name="role" value={inputs.role} onChange={handleChange} required aria-invalid={!!validationErrors.role}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                     {validationErrors.role && <span className="validation-error">{validationErrors.role}</span>}
                </div>

                {/* Password field is intentionally omitted for security */}
                {/* <label>Password:</label> ... */}

                 <div className="form-actions">
                    <button type="submit" className="submit-button" disabled={isSubmitting}>
                        {isSubmitting ? 'Updating...' : 'Update User'}
                    </button>
                     <Link to="/admin/users" className="cancel-button">Cancel</Link>
                </div>
            </form>
        </div>
    );
}

export default UpdateUser;
