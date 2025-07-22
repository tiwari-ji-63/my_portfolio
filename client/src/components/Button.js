import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'medium', 
    disabled = false, 
    loading = false,
    leftIcon = null,
    rightIcon = null,
    className = '',
    ...props 
}) => {
    const { isDarkMode } = useTheme();

    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';

    const variants = {
        primary: `bg-gradient-to-r from-secondary to-orange-600 text-white hover:from-orange-600 hover:to-secondary shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:ring-secondary`,
        secondary: `border-2 border-tertiary text-tertiary hover:bg-tertiary hover:text-primary bg-transparent shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:ring-tertiary`,
        tertiary: `bg-gradient-to-r from-tertiary to-green-400 text-primary hover:from-green-400 hover:to-tertiary shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:ring-tertiary`,
        outline: `border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent focus:ring-gray-300 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : ''}`,
        ghost: `text-gray-600 hover:bg-gray-100 bg-transparent focus:ring-gray-300 ${isDarkMode ? 'text-gray-400 hover:bg-gray-800' : ''}`,
        danger: `bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:ring-red-500`
    };

    const sizes = {
        small: 'px-3 py-2 text-sm',
        medium: 'px-6 py-3 text-base',
        large: 'px-8 py-4 text-lg'
    };

    const iconSizes = {
        small: 'w-4 h-4',
        medium: 'w-5 h-5',
        large: 'w-6 h-6'
    };

    return (
        <button
            className={`
                ${baseClasses}
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
            disabled={disabled || loading}
            {...props}
        >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            {/* Content */}
            <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                    <svg className={`animate-spin ${iconSizes[size]}`} fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                    </svg>
                ) : (
                    <>
                        {leftIcon && <span className={iconSizes[size]}>{leftIcon}</span>}
                        <span>{children}</span>
                        {rightIcon && <span className={iconSizes[size]}>{rightIcon}</span>}
                    </>
                )}
            </div>
        </button>
    );
};

export default Button;
