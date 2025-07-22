import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'primary', className = '' }) => {
    const sizes = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12',
        xlarge: 'w-16 h-16'
    };

    const colors = {
        primary: 'border-secondary',
        secondary: 'border-tertiary',
        white: 'border-white',
        gray: 'border-gray-400'
    };

    return (
        <div className={`${sizes[size]} ${className}`}>
            <div className={`${sizes[size]} border-4 border-transparent ${colors[color]} border-t-transparent rounded-full animate-spin`}></div>
        </div>
    );
};

const SkeletonLoader = ({ 
    lines = 3, 
    className = '',
    showAvatar = false,
    avatarSize = 'medium'
}) => {
    const avatarSizes = {
        small: 'w-8 h-8',
        medium: 'w-12 h-12',
        large: 'w-16 h-16'
    };

    return (
        <div className={`animate-pulse ${className}`}>
            <div className="flex items-center space-x-4">
                {showAvatar && (
                    <div className={`${avatarSizes[avatarSize]} bg-gray-300 rounded-full flex-shrink-0`}></div>
                )}
                <div className="flex-1 space-y-2">
                    {Array.from({ length: lines }).map((_, index) => (
                        <div 
                            key={index}
                            className={`h-4 bg-gray-300 rounded ${
                                index === lines - 1 ? 'w-3/4' : 'w-full'
                            }`}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ButtonLoader = ({ loading = false, children, ...props }) => {
    return (
        <button {...props} disabled={loading || props.disabled}>
            <div className="flex items-center justify-center gap-2">
                {loading && <LoadingSpinner size="small" color="white" />}
                <span className={loading ? 'opacity-70' : ''}>{children}</span>
            </div>
        </button>
    );
};

const PageLoader = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
            <div className="text-center">
                <LoadingSpinner size="xlarge" color="primary" className="mx-auto mb-4" />
                <p className="text-white text-lg">{message}</p>
            </div>
        </div>
    );
};

export { LoadingSpinner, SkeletonLoader, ButtonLoader, PageLoader };
