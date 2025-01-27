import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Initialize state from local storage
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [isAuthenticated, setIsAuthenticated] = useState(!!user);

    // Login function
    const login = (userData) => {
        // Store user in local storage
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    // Logout function
    const logout = () => {
        // Remove user from local storage
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    // Update user function
    const updateUser = (updatedUserData) => {
        const updatedUser = { ...user, ...updatedUserData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            login,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};