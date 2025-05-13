// src/components/ProtectedRoute/UserProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Adjust path if needed

// This component wraps routes that require ANY logged-in user
function UserProtectedRoute({ children }) {
    const authCtx = useContext(AuthContext);
    const location = useLocation();

    // 1. Check if user is logged in
    if (!authCtx.isLoggedIn) {
        console.log("UserProtectedRoute: Not logged in, redirecting to login.");
        // Redirect to login, saving the intended destination
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. If logged in, render the child component (the protected page)
    console.log("UserProtectedRoute: User is logged in, rendering child component.");
    return children;
}

export default UserProtectedRoute;
