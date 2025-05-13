import React, { useState, useContext } from 'react'; // Import useContext
import { Link, useNavigate } from 'react-router-dom';
import UserNav from '../../../components/UserNav/UserNav';
import './Login.css';
import { AuthContext } from '../../../context/AuthContext'; // Import AuthContext
import axios from 'axios'; // Add this at the top

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext); // Get auth context

    const handleLogin = async (e) => { // Make async if calling backend
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email || !password) {
            setError('Please enter both email and password.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            const { token, user } = response.data;
            authCtx.login(user, token); // Store real JWT in context/localStorage
            navigate('/'); // Redirect to home page or dashboard
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <UserNav />
            <div className="login-page-container">
                <div className="login-form-wrapper">
                    <h1>Login</h1>
                    <form onSubmit={handleLogin} noValidate>
                        {error && <p className="login-error">{error}</p>}
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                disabled={isLoading} // Disable during loading
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Your Password"
                                disabled={isLoading} // Disable during loading
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="login-button" disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                            <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
                        </div>
                    </form>
                    <p className="signup-prompt">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
