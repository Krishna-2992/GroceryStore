import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, updateUser } = useAuth();

    // State for profile information
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        address: '',
        dateOfBirth: ''
    });

    // State for password change
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    // State for form errors
    const [errors, setErrors] = useState({});

    // Load user data on component mount
    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                role: user.role || '',
                address: user.address || '',
                dateOfBirth: user.dateOfBirth || ''
            });
        }
    }, [user]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Handle profile information change
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear any existing errors for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle password change
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear any existing errors for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate profile form
    const validateProfileForm = () => {
        const newErrors = {};

        // First Name validation
        if (!profileData.firstName.trim()) {
            newErrors.firstName = 'First Name is required';
        }

        // Last Name validation
        if (!profileData.lastName.trim()) {
            newErrors.lastName = 'Last Name is required';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!profileData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(profileData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Phone validation (optional)
        const phoneRegex = /^[0-9]{10}$/;
        if (profileData.phone && !phoneRegex.test(profileData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validate password change form
    const validatePasswordForm = () => {
        const newErrors = {};

        // Current password check
        if (!passwordData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        // New password validation
        if (!passwordData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }

        // Confirm new password validation
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle profile update
    const handleProfileUpdate = (e) => {
        e.preventDefault();

        if (validateProfileForm()) {
            try {
                // Update user profile
                updateUser(profileData);
                alert('Profile updated successfully');
            } catch (error) {
                alert('Failed to update profile');
            }
        }
    };

    // Handle password change
    const handlePasswordUpdate = (e) => {
        e.preventDefault();

        if (validatePasswordForm()) {
            try {
                // In a real app, this would involve backend authentication
                // For now, we'll just simulate a password change
                alert('Password changed successfully');

                // Reset password fields
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                });
            } catch (error) {
                alert('Failed to change password');
            }
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar toggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pt-16 px-6 py-8">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6">User Profile</h1>

                        {/* Profile Information Section */}
                        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                            <form onSubmit={handleProfileUpdate}>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* First Name */}
                                    <div>
                                        <label className="block mb-2">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={profileData.firstName}
                                            onChange={handleProfileChange}
                                            className={`w-full px-3 py-2 border rounded 
                        ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.firstName && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.firstName}
                                            </p>
                                        )}
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={profileData.lastName}
                                            onChange={handleProfileChange}
                                            className={`w-full px-3 py-2 border rounded 
                        ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.lastName && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.lastName}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleProfileChange}
                                            className={`w-full px-3 py-2 border rounded 
                        ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleProfileChange}
                                            className={`w-full px-3 py-2 border rounded 
                        ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>

                                    {/* Address */}
                                    <div className="md:col-span-2">
                                        <label className="block mb-2">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleProfileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded"
                                        />
                                    </div>

                                    {/* Date of Birth */}
                                    <div>
                                        <label className="block mb-2">Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={profileData.dateOfBirth}
                                            onChange={handleProfileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded"
                                        />
                                    </div>

                                    {/* Role (Read-only) */}
                                    <div>
                                        <label className="block mb-2">Role</label>
                                        <input
                                            type="text"
                                            value={profileData.role}
                                            readOnly
                                            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                                        />
                                    </div>
                                </div>

                                {/* Update Profile Button */}
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Update Profile
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Change Password Section */}
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                            <form onSubmit={handlePasswordUpdate}>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Current Password */}
                                    <div>
                                        <label className="block mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className={`w-full px-3 py-2 border rounded 
                        ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.currentPassword && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.currentPassword}
                                            </p>
                                        )}
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label className="block mb-2">New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className={`w-full px-3 py-2 border rounded 
                        ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.newPassword && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.newPassword}
                                            </p>
                                        )}
                                    </div>

                                    {/* Confirm New Password */}
                                    <div className="md:col-span-2">
                                        <label className="block mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmNewPassword"
                                            value={passwordData.confirmNewPassword}
                                            onChange={handlePasswordChange}
                                            className={`w-full px-3 py-2 border rounded 
                        ${errors.confirmNewPassword ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.confirmNewPassword && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.confirmNewPassword}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Change Password Button */}
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserProfile;