import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { HideLoading, ShowLoading } from "../../redux/rootSlice";
import { useDispatch } from "react-redux";
import PasswordInput from "../../components/PasswordInput";
import "../../styles/login.css";

function ForgotPassword() {
    const [currentStep, setCurrentStep] = useState(0);
    const [username, setUsername] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const dispatch = useDispatch();

    const requestResetToken = async (e) => {
        // Prevent any default form submission behavior
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        try {
            console.log("🔍 Starting reset token request for username/email:", username);
            
            if (!username.trim()) {
                message.error("Please enter username or email");
                return;
            }

            setIsLoading(true);
            dispatch(ShowLoading());
            
            const response = await axios.post("/api/portfolio/forgot-password", {
                username: username.trim()
            });
            dispatch(HideLoading());
            setIsLoading(false);

            console.log("✅ Reset token response received:", response.data);

            if (response.data.success) {
                message.success(response.data.message);
                console.log("🎉 Success! Moving to step 1 (token verification)");
                setCurrentStep(1);
                
                // Show email notification
                message.info("📧 Check your email for the reset OTP");
                
                // Show fallback token if provided
                if (response.data.resetToken) {
                    message.info(`Reset OTP: ${response.data.resetToken} (Valid for 15 minutes)`, 8);
                }
                
                // Show email preview for development
                if (response.data.previewUrl) {
                    console.log("Email preview:", response.data.previewUrl);
                    message.info("📧 Email sent! Check console for preview URL or your email inbox");
                    
                    // Create a clickable link for the preview
                    const previewDiv = document.createElement('div');
                    previewDiv.innerHTML = `
                        <div style="margin-top: 10px; padding: 10px; background-color: #f0f8ff; border-radius: 4px;">
                            <strong>📧 Email Preview (Test Mode):</strong><br/>
                            <a href="${response.data.previewUrl}" target="_blank" style="color: #1890ff;">
                                Click here to see the email preview
                            </a>
                        </div>
                    `;
                    
                    // Add the preview link to the page
                    setTimeout(() => {
                        const container = document.querySelector('.ant-message');
                        if (container) {
                            container.appendChild(previewDiv);
                        }
                    }, 1000);
                }
                
                // Show additional notes
                if (response.data.note || response.data.emailNote) {
                    const notes = [response.data.note, response.data.emailNote]
                        .filter(Boolean).join(' ');
                    message.info(notes);
                }
                
            } else {
                console.log("❌ Error response:", response.data.message);
                message.error(response.data.message);
                console.log("🔄 Staying on step 0 due to error");
            }
        } catch (error) {
            console.error("❌ Exception in requestResetToken:", error);
            message.error(error.response?.data?.message || error.message);
            dispatch(HideLoading());
            setIsLoading(false);
        }
    };

    const resetPassword = async () => {
        try {
            if (!resetToken.trim()) {
                message.error("Please enter reset token");
                return;
            }
            if (!newPassword.trim()) {
                message.error("Please enter new password");
                return;
            }
            if (newPassword !== confirmPassword) {
                message.error("Passwords do not match");
                return;
            }
            if (newPassword.length < 6) {
                message.error("Password must be at least 6 characters long");
                return;
            }

            setIsLoading(true);
            dispatch(ShowLoading());
            const response = await axios.post("/api/portfolio/reset-password", {
                username,
                resetToken,
                newPassword
            });
            dispatch(HideLoading());
            setIsLoading(false);

            if (response.data.success) {
                message.success(response.data.message);
                setCurrentStep(2);
                setTimeout(() => {
                    window.location.href = "/admin-login";
                }, 2000);
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error(error.message);
            dispatch(HideLoading());
            setIsLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="text-center space-y-3">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-secondary to-tertiary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Forgot Password</h2>
                            <p className="text-gray-300 text-sm">
                                Enter your username or email address to receive a password reset OTP
                            </p>
                        </div>

                        {/* Username/Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Username / Email</label>
                            <div className={`relative group transition-all duration-300 ${focusedField === 'username' ? 'scale-105' : ''}`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-tertiary rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onFocus={() => setFocusedField('username')}
                                        onBlur={() => setFocusedField('')}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                requestResetToken(e);
                                            }
                                        }}
                                        placeholder="Enter your username or email"
                                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Send Reset Button */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                requestResetToken(e);
                            }}
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
                                        <span>Sending OTP...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        <span>Send Reset OTP</span>
                                    </>
                                )}
                            </div>
                        </button>
                        
                        {/* Back to Login */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => window.location.href = "/admin-login"}
                                className="text-gray-300 hover:text-white text-sm font-medium hover:underline transition-all duration-300 transform hover:scale-105"
                            >
                                ← Back to Login
                            </button>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="text-center space-y-3">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Enter Reset OTP</h2>
                            <p className="text-gray-300 text-sm">
                                Enter the 6-digit OTP you received via email and your new password
                            </p>
                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                                <div className="flex items-center justify-center space-x-2 text-sm text-blue-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <strong>Account:</strong>
                                    <span>{username}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* OTP Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Reset OTP</label>
                            <div className={`relative group transition-all duration-300 ${focusedField === 'otp' ? 'scale-105' : ''}`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={resetToken}
                                        onChange={(e) => setResetToken(e.target.value)}
                                        onFocus={() => setFocusedField('otp')}
                                        onBlur={() => setFocusedField('')}
                                        placeholder="Enter 6-digit OTP (e.g., 123456)"
                                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/15 text-center text-lg tracking-wider"
                                        maxLength={6}
                                        style={{ letterSpacing: '0.3em' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">New Password</label>
                            <div className={`relative group transition-all duration-300 ${focusedField === 'newPassword' ? 'scale-105' : ''}`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <PasswordInput
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        onFocus={() => setFocusedField('newPassword')}
                                        onBlur={() => setFocusedField('')}
                                        placeholder="Enter new password"
                                        className="w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                            <div className={`relative group transition-all duration-300 ${focusedField === 'confirmPassword' ? 'scale-105' : ''}`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <PasswordInput
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onFocus={() => setFocusedField('confirmPassword')}
                                        onBlur={() => setFocusedField('')}
                                        placeholder="Confirm new password"
                                        className="w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                resetPassword();
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Reset Password Button */}
                        <button
                            onClick={resetPassword}
                            disabled={isLoading}
                            className="w-full relative group overflow-hidden bg-gradient-to-r from-green-500 to-teal-600 hover:from-teal-600 hover:to-green-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <div className="relative flex items-center justify-center space-x-2">
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Resetting Password...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <span>Reset Password</span>
                                    </>
                                )}
                            </div>
                        </button>

                        {/* Navigation Buttons */}
                        <div className="flex justify-center space-x-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setCurrentStep(0);
                                    setResetToken("");
                                    setNewPassword("");
                                    setConfirmPassword("");
                                }}
                                className="text-gray-300 hover:text-white text-sm font-medium hover:underline transition-all duration-300 transform hover:scale-105"
                            >
                                ← Back
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    requestResetToken(e);
                                }}
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium hover:underline transition-all duration-300 transform hover:scale-105"
                            >
                                🔄 Resend OTP
                            </button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 text-center">
                        {/* Success Animation */}
                        <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg animate-bounce">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        
                        <h2 className="text-3xl font-bold text-green-400">Password Reset Successful!</h2>
                        <p className="text-gray-300">Your password has been successfully reset.</p>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                            <p className="text-gray-300 text-sm">Redirecting to login page...</p>
                            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-tertiary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-lg">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 space-y-8">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-center space-x-4 mb-8">
                        {[0, 1, 2].map((step, index) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                                    currentStep >= step 
                                        ? 'bg-gradient-to-r from-secondary to-tertiary text-white shadow-lg' 
                                        : 'bg-white/10 text-gray-400 border border-white/20'
                                }`}>
                                    {currentStep > step ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        step + 1
                                    )}
                                </div>
                                {index < 2 && (
                                    <div className={`w-16 h-1 mx-2 rounded transition-all duration-300 ${
                                        currentStep > step 
                                            ? 'bg-gradient-to-r from-secondary to-tertiary' 
                                            : 'bg-white/20'
                                    }`}></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Step Content */}
                    <div className="min-h-[400px]">
                        {renderStepContent()}
                    </div>

                    {/* Footer */}
                    <div className="text-center text-xs text-gray-400 border-t border-white/10 pt-6">
                        <p>Secure password recovery • Portfolio Management System</p>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-secondary/20 rounded-full blur-sm"></div>
                <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-tertiary/20 rounded-full blur-sm"></div>
                <div className="absolute top-1/2 -left-2 w-4 h-4 bg-green-500/20 rounded-full blur-sm"></div>
                <div className="absolute top-1/4 -right-2 w-5 h-5 bg-pink-500/20 rounded-full blur-sm"></div>
            </div>
        </div>
    );
}

export default ForgotPassword;
