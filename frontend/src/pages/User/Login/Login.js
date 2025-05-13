// src/pages/User/Login/Login.js
import React, { useState, useContext } from "react"; // Import useContext
import { useNavigate, Link } from "react-router-dom"; // Import Link
import axios from "axios";
import UserNav from '../../../Components/UserNav/UserNav'; // Adjust path
import { AuthContext } from '../../../context/AuthContext'; // <<< Import AuthContext
import './Login.css'; // Create or use shared auth CSS
import Swal from 'sweetalert2';

const API_BASE_URL = "http://localhost:5000/api";

function Login() {
    const navigate = useNavigate(); // Use navigate
    const authCtx = useContext(AuthContext); // <<< Use AuthContext
    const [inputs, setInputs] = useState({ email: "", password: "" });
    const [error, setError] = useState(null); // For backend submission errors
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
         if(error) setError(null); // Clear error on change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous error

        if (!inputs.email || !inputs.password) {
             setError("Please enter both email and password.");
             return;
        }
        setIsSubmitting(true);

        try {
            // Call the backend login endpoint
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email: inputs.email,
                password: inputs.password,
            }, {
                 headers: { 'Content-Type': 'application/json' }
            });

            console.log("Login response:", response.data);

            // If login is successful, backend sends back token and user info
            if (response.data.token && response.data.user) {
                authCtx.login(response.data.user, response.data.token); // <<< Use context login
                
                // Show success message
                await Swal.fire({
                    title: 'Success!',
                    text: 'Login successful!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });

                // Redirect based on user role
                if (response.data.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                 // Should not happen if backend sends correct response, but handle just in case
                 setError(response.data.message || "Login failed: Unexpected response from server.");
            }
        } catch (err) {
            console.error("Login error:", err.response || err);
            const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials and try again.";
            setError(errorMessage);
            
            // Show error in a more user-friendly way
            Swal.fire({
                title: 'Login Failed',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        } finally {
             setIsSubmitting(false);
        }
    };

    return (
        <div>
            <UserNav />
            <div className="auth-page-container"> {/* Shared class */}
                <div className="auth-form-wrapper"> {/* Shared class */}
                    <h1>Login</h1>
                    {error && <p className="auth-error">{error}</p>} {/* Shared error class */}
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                onChange={handleInputChange} 
                                value={inputs.email} 
                                required 
                                disabled={isSubmitting}
                                placeholder="Enter your email"
                                className={error ? 'error' : ''}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                onChange={handleInputChange} 
                                value={inputs.password} 
                                required 
                                disabled={isSubmitting}
                                placeholder="Enter your password"
                                className={error ? 'error' : ''}
                            />
                        </div>
                        <div className="auth-actions"> {/* Shared actions class */}
                            <button type="submit" className="auth-button" disabled={isSubmitting}>
                                {isSubmitting ? 'Logging In...' : 'Login'}
                            </button>
                            {/* Optional: Add forgot password link */}
                            {/* <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link> */}
                        </div>
                    </form>
                     <p className="auth-prompt"> {/* Shared prompt class */}
                        Don't have an account? <Link to="/register">Register Here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
