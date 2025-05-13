// src/components/ProtectedRoute/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Adjust path if needed

// This component wraps routes that require admin privileges
function ProtectedRoute({ children }) {
    const authCtx = useContext(AuthContext);
    const location = useLocation(); // To redirect back after login

    // 1. Check if user is logged in
    if (!authCtx.isLoggedIn) {
        console.log("ProtectedRoute: Not logged in, redirecting to login.");
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them back after login.
        return <Navigate to="/login" state={{ from: location }} replace />;
        // 'replace' avoids adding the admin URL to the history stack when not logged in
    }

    // 2. Check if the logged-in user has the 'admin' role
    if (authCtx.user?.role !== 'admin') {
        console.log(`ProtectedRoute: User role is '${authCtx.user?.role}', not admin. Redirecting.`);
        // User is logged in but not an admin, redirect to homepage (or an 'unauthorized' page)
        return <Navigate to="/" replace />;
    }

    // 3. If logged in and is an admin, render the child component (the actual admin page)
    console.log("ProtectedRoute: User is admin, rendering child component.");
    return children;
}

export default ProtectedRoute;
// This component can be used in your routing setup to protect admin routes
// Example usage in App.js or wherever your routes are defined: