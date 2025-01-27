import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-40">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Hamburger menu for mobile */}
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Grocery Store
                        </h1>
                    </div>

                    {/* User and Logout */}
                    <div className="flex items-center">
                        <div className="mr-4 flex items-center">
                            <span className="text-gray-700 mr-3">
                                Welcome, {user?.name || 'User'}
                            </span>
                            <div className="relative">
                                <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition duration-300"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;