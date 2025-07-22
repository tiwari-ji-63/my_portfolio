import React, { useState } from "react";
import axios from "axios";
import {HideLoading, ShowLoading} from "../../redux/rootSlice";
import {useDispatch} from "react-redux";
import PasswordInput from "../../components/PasswordInput";
import { useNotification } from "../../contexts/NotificationContext";
import "../../styles/login.css";

function Login() {
    const [user, setUser] = React.useState({
        username: "", // This will now accept username, email, or mobile number
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const dispatch = useDispatch();
    const { success, error } = useNotification();
    
    const login = async () => {
        try {
            // Validate input
            if (!user.username.trim()) {
                error("Please enter username, email or mobile number");
                return;
            }
            if (!user.password.trim()) {
                error("Please enter password");
                return;
            }

            setIsLoading(true);
            dispatch(ShowLoading());
            const response = await axios.post("/api/portfolio/admin-login", user);
            dispatch(HideLoading());
            setIsLoading(false);
            
            if (response.data.success) {
                success(response.data.message);
                // Store token with timestamp for activity-based 5-minute timeout
                const currentTime = new Date().getTime();
                const tokenData = {
                    ...response.data,
                    loginTime: currentTime
                };
                localStorage.setItem("token", JSON.stringify(tokenData));
                
                // Initialize last activity time for session timeout
                localStorage.setItem("lastActivityTime", currentTime.toString());
                
                console.log('Session created:', {
                    loginTime: new Date(currentTime),
                    lastActivityTime: new Date(currentTime),
                    sessionTimeout: '5 minutes (activity-based)',
                    user: response.data.data?.username || 'admin'
                });
                window.location.href = "/admin";
            } else {
                error(response.data.message);
            }
        } catch (err) {
            error(err.response?.data?.message || err.message);
            dispatch(HideLoading());
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            login();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-tertiary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-secondary to-tertiary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Admin Login</h1>
                        <p className="text-gray-300">Welcome back! Please sign in to your account</p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Username / Email / Mobile</label>
                            <div className={`relative group transition-all duration-300 ${focusedField === 'username' ? 'scale-105' : ''}`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-tertiary rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={user.username}
                                        onChange={(e) => setUser({...user, username: e.target.value})}
                                        onFocus={() => setFocusedField('username')}
                                        onBlur={() => setFocusedField('')}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Enter your username, email, or mobile"
                                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? 'scale-105' : ''}`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-tertiary rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <PasswordInput
                                        value={user.password}
                                        onChange={(e) => setUser({...user, password: e.target.value})}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField('')}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Enter your password"
                                        className="w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            onClick={login}
                            disabled={isLoading}
                            className="w-full relative group overflow-hidden bg-gradient-to-r from-secondary to-tertiary hover:from-tertiary hover:to-secondary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <div className="relative flex items-center justify-center space-x-2">
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </div>
                        </button>

                        {/* Forgot Password Link */}
                        <div className="text-center">
                            <button
                                onClick={() => window.location.href = "/admin-forgot-password"}
                                className="text-gray-300 hover:text-white text-sm font-medium hover:underline transition-all duration-300 transform hover:scale-105"
                            >
                                Forgot your password?
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-xs text-gray-400 border-t border-white/10 pt-6">
                        <p>Secure admin access • Portfolio Management System</p>
                    </div>
                </div>

                {/* Additional decorative elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-secondary/20 rounded-full blur-sm"></div>
                <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-tertiary/20 rounded-full blur-sm"></div>
                <div className="absolute top-1/2 -left-2 w-4 h-4 bg-blue-500/20 rounded-full blur-sm"></div>
                <div className="absolute top-1/4 -right-2 w-5 h-5 bg-purple-500/20 rounded-full blur-sm"></div>
            </div>
        </div>
    );
}

export default Login;