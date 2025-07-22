import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function Loader() {
    const { isDarkMode } = useTheme();

    return (
        <div className={`h-screen flex items-center justify-center fixed inset-0 z-[10000] transition-all duration-300 ${
            isDarkMode ? 'bg-primary' : 'bg-white'
        }`}>
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-tertiary/10 to-primary/10 animate-gradient-xy"></div>
            
            {/* Main Loader */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Animated Letters */}
                <div className="flex gap-5 text-6xl font-bold sm:text-4xl">
                    <h1 className="text-secondary first_letter transform transition-all duration-300 hover:scale-110">A</h1>
                    <h1 className={`${isDarkMode ? 'text-white' : 'text-gray-800'} second_letter transform transition-all duration-300 hover:scale-110`}>K</h1>
                    <h1 className="text-tertiary third_letter transform transition-all duration-300 hover:scale-110">T</h1>
                </div>

                {/* Progress Bar */}
                <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden sm:w-48">
                    <div className="h-full bg-gradient-to-r from-secondary via-tertiary to-secondary animate-gradient-x rounded-full"></div>
                </div>

                {/* Loading Text */}
                <p className={`text-lg font-medium animate-pulse ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    Loading Portfolio...
                </p>

                {/* Floating Dots */}
                <div className="flex gap-2">
                    <div className="w-3 h-3 bg-secondary rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>

            {/* Spinning Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-4 border-transparent border-t-secondary border-r-tertiary rounded-full animate-spin opacity-30"></div>
            </div>
        </div>
    );
}

export default Loader;