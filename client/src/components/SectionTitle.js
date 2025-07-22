import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../animations/indianFlag.css';

function SectionTitle({ title, subtitle = '', icon = null }) {
    const { isDarkMode } = useTheme();

    return (
        <div className="flex flex-col gap-4 py-16">
            {/* Main Title */}
            <div className="flex items-center gap-6 sm:gap-4">
                {/* Icon */}
                {icon && (
                    <div className="text-4xl sm:text-3xl">
                        {icon}
                    </div>
                )}
                
                {/* Title */}
                <h1 className="text-4xl sm:text-3xl font-bold bg-gradient-to-r from-secondary via-orange-500 to-secondary bg-clip-text text-transparent">
                    {title}
                </h1>
                
                {/* Animated Line */}
                <div className="relative flex-1 max-w-xs">
                    <div className="h-[2px] bg-gradient-to-r from-tertiary to-transparent rounded-full"></div>
                    <div className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-secondary to-tertiary rounded-full w-full"></div>
                </div>
            </div>

            {/* Subtitle */}
            {subtitle && (
                <p className={`text-lg ml-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                    {subtitle}
                </p>
            )}

            {/* Decorative dots - Indian Flag Colors with Blinking Animation */}
            <div className="flex gap-3 ml-2">
                <div className="w-3 h-3 rounded-full indian-flag-dot-1"></div>
                <div className="w-3 h-3 rounded-full indian-flag-dot-2 border border-gray-300"></div>
                <div className="w-3 h-3 rounded-full indian-flag-dot-3"></div>
            </div>
        </div>
    );
}

export default SectionTitle;