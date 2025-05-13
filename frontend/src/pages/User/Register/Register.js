// src/pages/User/Register/Register.js
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import UserNav from '../../../Components/UserNav/UserNav'; // Adjust path
import { AuthContext } from '../../../context/AuthContext'; // Import AuthContext
import './Register.css'; // Create this CSS

const API_BASE_URL = "http://localhost:5000";

function Register() {
    const history = useNavigate(); // Use navigate instead of history
    const authCtx = useContext(AuthContext); // Get auth context
    const [inputs, setInputs] = useState({
        name: "", age: "", address: "", email: "", password: "", confirmPassword: "" // Add confirm password
    });
    const [errors, setErrors] = useState({}); // For frontend validation errors
    const [submitError, setSubmitError] = useState(null); // For backend submission errors
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: null }));
        }
        if(submitError) setSubmitError(null);
    };

    // Frontend Validation
    const validateForm = () => {
        const newErrors = {};
        if (!inputs.name.trim()) newErrors.name = "Name is required";
        if (inputs.name.length > 40) newErrors.name = "Name cannot exceed 40 characters";
        if (isNaN(inputs.age) || inputs.age === "" || Number(inputs.age) <= 0) newErrors.age = "Age must be a positive number";
        if (!inputs.email.includes('@')) newErrors.email = "Please enter a valid email"; // Basic check
        if (!inputs.address.trim()) newErrors.address = "Address is required";
        if (inputs.password.length < 8) newErrors.password = "Password must be at least 8 characters";
        // Add more password checks (e.g., uppercase) if desired
        if (inputs.password !== inputs.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

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
            // Call the backend registration endpoint
            const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
                name: inputs.name,
                age: Number(inputs.age),
                address: inputs.address,
                email: inputs.email,
                password: inputs.password,
                // Role defaults to 'user' on backend
            }, {
                 headers: { 'Content-Type': 'application/json' }
            });

            console.log("Registration response:", response.data);
            alert("Registration successful! Please log in.");
            history("/login"); // Redirect to login page after successful registration

            // Optional: Automatically log in the user after registration
            // if (response.data.user && response.data.token) { // Assuming backend might return token/user on register
            //     authCtx.login(response.data.user, response.data.token);
            //     history("/"); // Redirect home
            // } else {
            //     history("/login");
            // }

        } catch (error) {
            console.error("Registration failed:", error.response || error);
            const backendErrorMessage = error.response?.data?.message || "Registration failed. Please try again.";
            setSubmitError(backendErrorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <UserNav />
            <div className="auth-page-container"> {/* Use a shared class */}
                <div className="auth-form-wrapper"> {/* Use a shared class */}
                    <h1>Register</h1>
                    {submitError && <p className="auth-error">{submitError}</p>} {/* Shared error class */}
                    <form onSubmit={handleSubmit} noValidate>
                        {/* Name */}
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" name="name" onChange={handleChange} value={inputs.name} required aria-invalid={!!errors.name}/>
                            {errors.name && <div className="validation-error">{errors.name}</div>}
                        </div>
                        {/* Email */}
                        <div className="form-group">
                             <label htmlFor="email">Email</label>
                             <input type="email" id="email" name="email" onChange={handleChange} value={inputs.email} required aria-invalid={!!errors.email}/>
                             {errors.email && <div className="validation-error">{errors.email}</div>}
                        </div>
                         {/* Age */}
                         <div className="form-group">
                            <label htmlFor="age">Age</label>
                            <input type="number" id="age" name="age" onChange={handleChange} value={inputs.age} required aria-invalid={!!errors.age}/>
                            {errors.age && <div className="validation-error">{errors.age}</div>}
                        </div>
                         {/* Address */}
                         <div className="form-group">
                             <label htmlFor="address">Address</label>
                             <textarea id="address" name="address" rows="3" onChange={handleChange} value={inputs.address} required aria-invalid={!!errors.address}></textarea>
                             {errors.address && <div className="validation-error">{errors.address}</div>}
                         </div>
                        {/* Password */}
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" onChange={handleChange} value={inputs.password} required aria-invalid={!!errors.password}/>
                             {errors.password && <div className="validation-error">{errors.password}</div>}
                        </div>
                         {/* Confirm Password */}
                         <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" onChange={handleChange} value={inputs.confirmPassword} required aria-invalid={!!errors.confirmPassword}/>
                             {errors.confirmPassword && <div className="validation-error">{errors.confirmPassword}</div>}
                        </div>

                        <div className="auth-actions"> {/* Shared actions class */}
                            <button type="submit" className="auth-button" disabled={isSubmitting}>
                                {isSubmitting ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </form>
                    <p className="auth-prompt"> {/* Shared prompt class */}
                        Already have an account? <Link to="/login">Login Here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
