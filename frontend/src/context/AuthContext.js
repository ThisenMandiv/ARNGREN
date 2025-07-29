import React, { createContext, useState, useEffect } from 'react';

// Initial state
const initialState = {
    isLoggedIn: false,
    token: null, // Store JWT token here
    user: null, // Store user details (id, name, email, etc.)
};

// Create Context
export const AuthContext = createContext({
    ...initialState,
    login: (userData, token) => {},
    logout: () => {},
    updateUser: (userData) => {},
});

// Create Provider Component
export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(initialState);

    // Optional: Check localStorage for existing token on initial load
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('authUser'); // Keeping 'authUser' for user data
        if (storedToken && storedUser) {
            console.log("Found existing auth session in localStorage");
            setAuthState({
                isLoggedIn: true,
                token: storedToken,
                user: JSON.parse(storedUser)
            });
            // Optional: Verify token validity with backend here
        }
    }, []);

    const loginHandler = (userData, token) => {
        console.log('LoginHandler called with:', { userData, token });
        setAuthState({
            isLoggedIn: true,
            token: token,
            user: userData
        });
        // Store in localStorage for persistence
        localStorage.setItem('token', token);
        localStorage.setItem('authUser', JSON.stringify(userData));
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('User logged in:', userData);
        console.log('AuthState updated:', { isLoggedIn: true, token: token, user: userData });
    };

    const logoutHandler = () => {
        setAuthState(initialState); // Reset state
        // Remove from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('authUser');
        localStorage.removeItem('user');
        console.log('User logged out');
        // Optional: Call backend logout endpoint if necessary
    };

    const updateUserHandler = (userData) => {
        setAuthState(prevState => ({
            ...prevState,
            user: userData
        }));
        // Update localStorage
        localStorage.setItem('authUser', JSON.stringify(userData));
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('User updated:', userData);
    };

    const contextValue = {
        isLoggedIn: authState.isLoggedIn,
        token: authState.token,
        user: authState.user,
        login: loginHandler,
        logout: logoutHandler,
        updateUser: updateUserHandler,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
