import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
// Create the context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize state from local storage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      const response = await axios.post("/api/users/register", userData);

      // Store user and token
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      // Update state
      setUser(response.data.user);
      setToken(response.data.token);
      setIsAuthenticated(true);

      return response.data;
    } catch (error) {
      console.error("Registration error", error.response?.data);
      throw error;
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      const response = await axios.post("/api/users/login", credentials);

      // Store user and token
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      // Update state
      setUser(response.data.user);
      setToken(response.data.token);
      setIsAuthenticated(true);

      return response.data;
    } catch (error) {
      console.error("Login error", error.response?.data);
      throw error;
    }
  };
  // Logout function
  const logout = () => {
    // Remove from local storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Clear state
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put("/api/users/profile", profileData);

      // Update local storage and state
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);

      return response.data;
    } catch (error) {
      console.error("Profile update error", error.response?.data);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
