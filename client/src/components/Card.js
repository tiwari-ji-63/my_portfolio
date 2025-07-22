import React, { useState } from 'react';
import Button from './Button';
import { useTheme } from '../contexts/ThemeContext';

function Card({title, subtitle, description, image, link, githubLink}) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const { isDarkMode } = useTheme();

    return (
        <div 
            className={`relative overflow-hidden rounded-3xl shadow-2xl border backdrop-blur-md ${
                isDarkMode 
                    ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50' 
                    : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200/50'
            }`}
        >
            {/* Enhanced background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 via-tertiary/20 to-secondary/20"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
            </div>

            <div className="relative z-10 p-8">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-3 h-3 bg-secondary rounded-full"></div>
                            <span className={`text-sm font-medium uppercase tracking-wider ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                                Featured Project
                            </span>
                        </div>
                        <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent`}>
                            {title}
                        </h1>
                    </div>
                </div>

                {/* Project Image */}
                {image && (
                    <div className="mb-8">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-tertiary/20 rounded-2xl blur-xl opacity-50"></div>
                            <div className="relative overflow-hidden rounded-2xl">
                                {/* Loading placeholder */}
                                {!imageLoaded && (
                                    <div className="w-full h-80 bg-gradient-to-br from-gray-300 to-gray-400 animate-pulse rounded-2xl flex items-center justify-center">
                                        <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                                        </svg>
                                    </div>
                                )}
                                
                                <img 
                                    src={image} 
                                    alt={title} 
                                    className={`w-full h-80 object-cover rounded-2xl ${
                                        imageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                    onLoad={() => setImageLoaded(true)}
                                />
                                
                                {/* Image overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Technologies Section */}
                {subtitle && typeof subtitle === 'string' && subtitle.trim() !== '' && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            <h3 className={`text-lg font-semibold ${
                                isDarkMode ? 'text-white' : 'text-gray-800'
                            }`}>
                                Tech Stack
                            </h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {subtitle.split(',').filter(tech => tech && tech.trim() !== '').map((tech, index) => (
                                <span 
                                    key={index}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                                        isDarkMode 
                                            ? 'bg-gray-800/50 text-tertiary border-tertiary/20 hover:border-tertiary/40 hover:bg-gray-700/50' 
                                            : 'bg-white/70 text-tertiary border-tertiary/20 hover:border-tertiary/40 hover:bg-white/90'
                                    }`}
                                >
                                    {tech.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Description Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className={`text-lg font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                            Overview
                        </h3>
                    </div>
                    <p className={`text-lg leading-relaxed ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        {description}
                    </p>
                </div>
                    
                    {/* Action Buttons */}
                    {(link || githubLink) && (
                        <div className="flex gap-4 sm:flex-col pt-4">
                            {link && (
                                <Button
                                    variant="secondary"
                                    onClick={() => window.open(link, "_blank")}
                                    leftIcon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    }
                                >
                                    Visit Project
                                </Button>
                            )}
                            {githubLink && (
                                <Button
                                    variant="outline"
                                    onClick={() => window.open(githubLink, "_blank")}
                                    leftIcon={
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                        </svg>
                                    }
                                >
                                    Github Repository
                                </Button>
                            )}
                        </div>
                    )}
            </div>
        </div>
    );
}

export default Card;