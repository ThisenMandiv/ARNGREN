// src/pages/Admin/AddUser/AddUser.js
// NOTE: This form now uses the registration endpoint for consistency and security.
// Admins typically shouldn't set passwords directly.
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import axios from "axios";
import "./AddUser.css"; // Create or use shared admin form CSS

const API_BASE_URL = "http://localhost:5000/api";

function AddUser() {
    const history = useNavigate();
    const [inputs, setInputs] = useState({
        name: "", age: "", address: "", email: "", password: "", role: "user" // Default role
    });
    const [errors, setErrors] = useState({}); // For frontend validation errors
    const [submitError, setSubmitError] = useState(null); // For backend submission errors
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
        // Clear validation error for the field being changed
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: null }));
        }
         if(submitError) setSubmitError(null); // Clear general error on change
    };

    // Validate form before submission
    const validateForm = () => {
        const newErrors = {};
        if (!inputs.name.trim()) newErrors.name = "Name is required";
        if (inputs.name.length > 40) newErrors.name = "Name should be less than 40 characters";
        if (isNaN(inputs.age) || inputs.age === "" || Number(inputs.age) <= 0) newErrors.age = "Age should be a positive number";
        if (!inputs.email.includes('@')) newErrors.email = "Please enter a valid email";
         if (!inputs.address.trim()) newErrors.address = "Address is required";
        if (inputs.password.length < 8) newErrors.password = "Password must be at least 8 characters";
        // Add other password checks if desired (e.g., uppercase)
        if (!['user', 'admin'].includes(inputs.role)) newErrors.role = "Invalid role selected";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        setErrors({});

        if (!validateForm()) {
            setSubmitError("Please fix the errors in the form.");
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Submitting registration payload:", inputs);
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${API_BASE_URL}/auth/register`, {
                name: inputs.name,
                age: Number(inputs.age),
                address: inputs.address,
                email: inputs.email,
                password: inputs.password,
                role: inputs.role
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log("Registration response:", response.data);
            alert("User added successfully via registration endpoint!");
            history("/admin/users");
        } catch (error) {
            console.error("Error adding user:", error.response || error);
            const backendErrorMessage = error.response?.data?.message || "Failed to add user. Please try again.";
            setSubmitError(backendErrorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // Reuse admin form styles
        <div className="admin-form-container">
            <h1> Add New User</h1>
             {submitError && <p className="error-message">{submitError}</p>}
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" onChange={handleChange} value={inputs.name} required aria-invalid={!!errors.name}/>
                     {errors.name && <div className="validation-error">{errors.name}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" onChange={handleChange} value={inputs.email} required aria-invalid={!!errors.email}/>
                     {errors.email && <div className="validation-error">{errors.email}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="age">Age:</label>
                    <input type="number" id="age" name="age" onChange={handleChange} value={inputs.age} required aria-invalid={!!errors.age}/>
                     {errors.age && <div className="validation-error">{errors.age}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <textarea id="address" name="address" rows="3" onChange={handleChange} value={inputs.address} required aria-invalid={!!errors.address}></textarea>
                     {errors.address && <div className="validation-error">{errors.address}</div>}
                </div>

                 <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" onChange={handleChange} value={inputs.password} required aria-invalid={!!errors.password}/>
                     {errors.password && <div className="validation-error">{errors.password}</div>}
                </div>

                 <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select id="role" name="role" value={inputs.role} onChange={handleChange} required aria-invalid={!!errors.role}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                     {errors.role && <div className="validation-error">{errors.role}</div>}
                </div>


                 <div className="form-actions">
                    <button type="submit" className="submit-button" disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add User'}
                    </button>
                     <Link to="/admin/users" className="cancel-button">Cancel</Link>
                </div>
            </form>
        </div>
    );
}

export default AddUser;
