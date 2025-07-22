import React, { useState } from 'react';

const PasswordInput = ({ 
    value, 
    onChange, 
    onKeyPress, 
    onFocus,
    onBlur,
    placeholder = "Password", 
    className = "",
    ...props 
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative group">
            <input
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                onKeyPress={onKeyPress}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder={placeholder}
                className={`${className} pr-12 transition-all duration-200 ease-in-out`}
                {...props}
            />
            
            {/* Toggle Button */}
            <button
                type="button"
                onClick={togglePasswordVisibility}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:ring-opacity-50 rounded-full p-1 transition-all duration-200 ease-in-out hover:scale-110 hover:bg-white/10 active:scale-95"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
                <div className="relative w-5 h-5">
                    {/* Eye Icon (visible) */}
                    <svg
                        className={`absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out ${
                            showPassword 
                                ? 'opacity-100 scale-100 rotate-0' 
                                : 'opacity-0 scale-75 rotate-45'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                    
                    {/* Eye Slash Icon (hidden) */}
                    <svg
                        className={`absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out ${
                            !showPassword 
                                ? 'opacity-100 scale-100 rotate-0' 
                                : 'opacity-0 scale-75 -rotate-45'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                    </svg>
                </div>
            </button>
            
            {/* Animated Tooltip */}
            <div className={`absolute right-0 top-full mt-2 z-10 transition-all duration-200 ease-in-out ${
                isHovered 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-1 pointer-events-none'
            }`}>
                <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                    <div className="flex items-center gap-2">
                        <svg 
                            className="w-3 h-3" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                        </svg>
                        {showPassword ? 'Hide password' : 'Show password'}
                    </div>
                    {/* Tooltip arrow */}
                    <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-800 transform rotate-45"></div>
                </div>
            </div>
            
            {/* Password strength indicator (optional visual enhancement) */}
            {value && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-500 ease-in-out ${
                            value.length < 6 
                                ? 'w-1/4 bg-red-400' 
                                : value.length < 8 
                                ? 'w-2/4 bg-yellow-400' 
                                : value.length < 12 
                                ? 'w-3/4 bg-blue-400' 
                                : 'w-full bg-green-400'
                        }`}
                    />
                </div>
            )}
        </div>
    );
};

export default PasswordInput;
