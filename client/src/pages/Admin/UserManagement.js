import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { message } from "antd";
import { HideLoading, ShowLoading } from "../../redux/rootSlice";
import { useDispatch } from "react-redux";
import PasswordInput from "../../components/PasswordInput";

function UserManagement() {
    const [currentCredentials, setCurrentCredentials] = useState({
        username: "",
        password: ""
    });
    const [newCredentials, setNewCredentials] = useState({
        username: "",
        password: "",
        email: "",
        mobile: ""
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userProfile, setUserProfile] = useState(null);
    const dispatch = useDispatch();

    const fetchUserProfile = useCallback(async () => {
        try {
            if (!currentCredentials.username) {
                return;
            }
            
            dispatch(ShowLoading());
            const response = await axios.get(`/api/portfolio/user-profile?username=${currentCredentials.username}`);
            dispatch(HideLoading());

            if (response.data.success) {
                setUserProfile(response.data.data);
            }
        } catch (error) {
            dispatch(HideLoading());
            console.error("Error fetching user profile:", error);
        }
    }, [currentCredentials.username, dispatch]);

    useEffect(() => {
        // Try to get current username from token or other source
        const token = localStorage.getItem("token");
        if (token) {
            try {
                // You might need to modify this based on how you store user info in token
                fetchUserProfile();
            } catch (error) {
                console.error("Error parsing token:", error);
            }
        }
    }, [fetchUserProfile]);

    const updateCredentials = async () => {
        try {
            if (!currentCredentials.username.trim() || !currentCredentials.password.trim()) {
                message.error("Please enter current username and password");
                return;
            }

            if (!newCredentials.username.trim() && !newCredentials.password.trim() && !newCredentials.email.trim() && !newCredentials.mobile.trim()) {
                message.error("Please enter at least one new credential to update");
                return;
            }

            if (newCredentials.password && newCredentials.password !== confirmPassword) {
                message.error("New passwords do not match");
                return;
            }

            if (newCredentials.password && newCredentials.password.length < 6) {
                message.error("New password must be at least 6 characters long");
                return;
            }

            // Validate email format if provided
            if (newCredentials.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(newCredentials.email)) {
                    message.error("Please enter a valid email address");
                    return;
                }
            }

            // Validate mobile format if provided
            if (newCredentials.mobile) {
                const mobileRegex = /^[+]?[1-9][\d]{0,15}$/;
                if (!mobileRegex.test(newCredentials.mobile)) {
                    message.error("Please enter a valid mobile number (e.g., +1234567890 or 1234567890)");
                    return;
                }
            }

            dispatch(ShowLoading());

            // Update email first if provided
            if (newCredentials.email) {
                const emailResponse = await axios.post("/api/portfolio/update-email", {
                    username: currentCredentials.username,
                    password: currentCredentials.password,
                    email: newCredentials.email
                });

                if (!emailResponse.data.success) {
                    dispatch(HideLoading());
                    message.error(emailResponse.data.message);
                    return;
                }
            }

            // Update mobile if provided
            if (newCredentials.mobile) {
                const mobileResponse = await axios.post("/api/portfolio/update-mobile", {
                    username: currentCredentials.username,
                    password: currentCredentials.password,
                    mobile: newCredentials.mobile
                });

                if (!mobileResponse.data.success) {
                    dispatch(HideLoading());
                    message.error(mobileResponse.data.message);
                    return;
                }
            }

            // Update credentials if provided
            if (newCredentials.username || newCredentials.password) {
                const response = await axios.post("/api/portfolio/update-credentials", {
                    currentUsername: currentCredentials.username,
                    currentPassword: currentCredentials.password,
                    newUsername: newCredentials.username || currentCredentials.username,
                    newPassword: newCredentials.password
                });

                if (!response.data.success) {
                    dispatch(HideLoading());
                    message.error(response.data.message);
                    return;
                }
            }

            dispatch(HideLoading());
            message.success("Credentials updated successfully");
            
            // Update local storage if username changed
            if (newCredentials.username) {
                message.info("Username updated. Please login again with new credentials.");
                setTimeout(() => {
                    localStorage.removeItem("token");
                    window.location.href = "/admin-login";
                }, 2000);
            } else {
                // Reset form
                setCurrentCredentials({ username: "", password: "" });
                setNewCredentials({ username: "", password: "", email: "", mobile: "" });
                setConfirmPassword("");
                // Refresh user profile
                fetchUserProfile();
            }
        } catch (error) {
            message.error(error.message);
            dispatch(HideLoading());
        }
    };

    return (
        <div className="space-y-8 fade-in">
            {/* Enhanced 3D Header Section */}
            <div className="relative group">
                {/* Animated Background Layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-all duration-700 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl"></div>
                
                <div className="relative bg-white/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/30 shadow-2xl overflow-hidden">
                    {/* Floating Background Elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-pink-600/20 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"></div>
                    
                    <div className="relative flex items-center space-x-6">
                        {/* Enhanced 3D Icon */}
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform transition-all duration-500 hover:rotate-12 hover:scale-110 group-hover:shadow-3xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-3xl"></div>
                                <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                                <span className="text-white text-3xl relative z-10">👥</span>
                            </div>
                            {/* Orbiting particles */}
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
                            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                            <div className="absolute top-1/2 -right-3 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-ping"></div>
                        </div>
                        
                        <div className="flex-1">
                            <h3 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transform transition-all duration-300">
                                User Management
                            </h3>
                            <p className="text-slate-600 text-lg font-medium">
                                Manage admin credentials and profile settings with advanced security
                            </p>
                            <div className="flex items-center space-x-4 mt-3">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-slate-500 font-medium">Secure Authentication</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                                    <span className="text-sm text-slate-500 font-medium">Profile Management</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Status Indicator */}
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                                <span className="text-white text-xl">✓</span>
                            </div>
                            <div className="absolute -inset-2 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-3xl blur-lg"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Current User Profile - Enhanced 3D Design */}
                {userProfile && (
                    <div className="relative group">
                        {/* 3D Card with Multiple Layers */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500 transform group-hover:scale-105"></div>
                        
                        <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/30 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
                            {/* Animated Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-blue-50/30 to-purple-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Header with 3D Icon */}
                            <div className="relative flex items-center space-x-4 mb-8">
                                <div className="relative">
                                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 hover:rotate-12 hover:scale-110">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"></div>
                                        <span className="text-white text-2xl relative z-10">👤</span>
                                    </div>
                                    {/* Floating particles effect */}
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-bounce"></div>
                                </div>
                                
                                <div>
                                    <h4 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Current Profile
                                    </h4>
                                    <p className="text-slate-500 font-medium">User Account Information</p>
                                </div>
                            </div>
                            
                            {/* Profile Data with 3D Cards */}
                            <div className="relative space-y-4">
                                {/* Username */}
                                <div className="group/item relative p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-2xl border border-blue-100/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative flex justify-between items-center">
                                        <span className="text-slate-600 font-semibold flex items-center gap-2">
                                            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
                                            Username:
                                        </span>
                                        <span className="text-slate-800 font-bold text-lg">{userProfile.username}</span>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="group/item relative p-4 bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative flex justify-between items-center">
                                        <span className="text-slate-600 font-semibold flex items-center gap-2">
                                            <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                                            Email:
                                        </span>
                                        <span className="text-slate-800 font-bold">{userProfile.email || 'Not set'}</span>
                                    </div>
                                </div>

                                {/* Mobile */}
                                <div className="group/item relative p-4 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-2xl border border-emerald-100/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative flex justify-between items-center">
                                        <span className="text-slate-600 font-semibold flex items-center gap-2">
                                            <span className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></span>
                                            Mobile:
                                        </span>
                                        <span className="text-slate-800 font-bold">{userProfile.mobile || 'Not set'}</span>
                                    </div>
                                </div>

                                {/* Created Date */}
                                <div className="group/item relative p-4 bg-gradient-to-r from-orange-50/80 to-yellow-50/80 rounded-2xl border border-orange-100/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-yellow-500/5 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative flex justify-between items-center">
                                        <span className="text-slate-600 font-semibold flex items-center gap-2">
                                            <span className="w-2 h-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"></span>
                                            Created:
                                        </span>
                                        <span className="text-slate-800 font-bold">{new Date(userProfile.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Last Updated */}
                                <div className="group/item relative p-4 bg-gradient-to-r from-rose-50/80 to-red-50/80 rounded-2xl border border-rose-100/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-red-500/5 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative flex justify-between items-center">
                                        <span className="text-slate-600 font-semibold flex items-center gap-2">
                                            <span className="w-2 h-2 bg-gradient-to-r from-rose-500 to-red-500 rounded-full"></span>
                                            Last Updated:
                                        </span>
                                        <span className="text-slate-800 font-bold">{new Date(userProfile.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-2xl"></div>
                            </div>
                            <div className="absolute bottom-4 left-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                                <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-pink-600 rounded-full blur-2xl"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced 3D Current Credentials Form */}
                <div className="relative group">
                    {/* 3D Card Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500 transform group-hover:scale-105"></div>
                    
                    <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/30 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Header with 3D Icon */}
                        <div className="relative flex items-center space-x-4 mb-8">
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 hover:rotate-12 hover:scale-110">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"></div>
                                    <span className="text-white text-2xl relative z-10">🔐</span>
                                </div>
                                {/* Security indicators */}
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-bounce"></div>
                            </div>
                            
                            <div>
                                <h4 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    Current Credentials
                                </h4>
                                <p className="text-slate-500 font-medium">Secure Authentication Panel</p>
                            </div>
                        </div>
                        
                        {/* Enhanced Form Fields */}
                        <div className="relative space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 rounded-2xl blur-sm"></div>
                                <input
                                    type="text"
                                    value={currentCredentials.username}
                                    onChange={(e) => setCurrentCredentials({...currentCredentials, username: e.target.value})}
                                    placeholder="Current Username/Email/Mobile"
                                    className="admin-input relative z-10 bg-white/80 backdrop-blur-sm border-2 border-blue-200/50 focus:border-emerald-400 text-slate-800 placeholder-slate-400"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-pink-100/50 rounded-2xl blur-sm"></div>
                                <PasswordInput
                                    value={currentCredentials.password}
                                    onChange={(e) => setCurrentCredentials({...currentCredentials, password: e.target.value})}
                                    placeholder="Current Password"
                                    className="admin-input relative z-10 bg-white/80 backdrop-blur-sm border-2 border-purple-200/50 focus:border-emerald-400 text-slate-800 placeholder-slate-400"
                                />
                            </div>
                            
                            {/* Enhanced 3D Button */}
                            <div className="relative">
                                <button
                                    onClick={fetchUserProfile}
                                    className="relative w-full p-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 group/btn"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative flex items-center justify-center space-x-3">
                                        <span className="text-xl">📋</span>
                                        <span className="text-lg">Load Profile</span>
                                        <span className="text-sm opacity-80">🔄</span>
                                    </span>
                                </button>
                                {/* Button glow effect */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                            </div>
                        </div>
                        
                        {/* Floating Effects */}
                        <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                            <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-cyan-600 rounded-full blur-2xl"></div>
                        </div>
                        <div className="absolute bottom-4 left-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                            <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-purple-600 rounded-full blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Credentials Form */}
            <div className="admin-card">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-accent to-tertiary rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">✏️</span>
                    </div>
                    <h4 className="text-lg font-semibold text-primary">Update Credentials</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="admin-input-group">
                            <label className="text-primary font-semibold text-sm mb-2 block">New Username</label>
                            <input
                                type="text"
                                value={newCredentials.username}
                                onChange={(e) => setNewCredentials({...newCredentials, username: e.target.value})}
                                placeholder="Leave empty to keep current"
                                className="admin-input"
                            />
                        </div>
                        
                        <div className="admin-input-group">
                            <label className="text-primary font-semibold text-sm mb-2 block">Email Address</label>
                            <input
                                type="email"
                                value={newCredentials.email}
                                onChange={(e) => setNewCredentials({...newCredentials, email: e.target.value})}
                                placeholder="Enter email address"
                                className="admin-input"
                            />
                        </div>
                        
                        <div className="admin-input-group">
                            <label className="text-primary font-semibold text-sm mb-2 block">Mobile Number</label>
                            <input
                                type="tel"
                                value={newCredentials.mobile}
                                onChange={(e) => setNewCredentials({...newCredentials, mobile: e.target.value})}
                                placeholder="e.g., +1234567890"
                                className="admin-input"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="admin-input-group">
                            <label className="text-primary font-semibold text-sm mb-2 block">New Password</label>
                            <PasswordInput
                                value={newCredentials.password}
                                onChange={(e) => setNewCredentials({...newCredentials, password: e.target.value})}
                                placeholder="Leave empty to keep current"
                                className="admin-input"
                            />
                        </div>
                        
                        <div className="admin-input-group">
                            <label className="text-primary font-semibold text-sm mb-2 block">Confirm New Password</label>
                            <PasswordInput
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="admin-input"
                            />
                        </div>
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                        onClick={updateCredentials}
                        className="admin-btn-primary flex-1"
                    >
                        <span className="flex items-center justify-center space-x-2">
                            <span>💾</span>
                            <span>Update Credentials</span>
                        </span>
                    </button>
                    <button
                        onClick={() => {
                            setCurrentCredentials({ username: "", password: "" });
                            setNewCredentials({ username: "", password: "", email: "", mobile: "" });
                            setConfirmPassword("");
                            setUserProfile(null);
                        }}
                        className="admin-btn-secondary"
                    >
                        <span className="flex items-center justify-center space-x-2">
                            <span>🔄</span>
                            <span>Clear Form</span>
                        </span>
                    </button>
                </div>
            </div>

            {/* Help Section */}
            <div className="bg-gradient-to-r from-accent/5 to-tertiary/5 border border-accent/20 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-accent text-sm">💡</span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-primary mb-3">Instructions & Guidelines</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <ul className="space-y-2">
                                <li className="flex items-start space-x-2">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>Enter your current username, email, or mobile for identification</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>Fill in only the fields you want to update</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-secondary mt-1">•</span>
                                    <span>Email and mobile are used for login and password reset</span>
                                </li>
                            </ul>
                            <ul className="space-y-2">
                                <li className="flex items-start space-x-2">
                                    <span className="text-tertiary mt-1">•</span>
                                    <span>Mobile format: +1234567890 or 1234567890</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-tertiary mt-1">•</span>
                                    <span>Leave new credential fields empty to keep current values</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-tertiary mt-1">•</span>
                                    <span>You will need to login again if username is changed</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserManagement;
