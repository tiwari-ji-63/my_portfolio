import React, { useState, useEffect } from 'react';

const FloatingActionButton = () => {
    const [showButton, setShowButton] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        setIsMenuOpen(false);
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        setIsMenuOpen(false);
    };

    const handleScroll = () => {
        setShowButton(window.scrollY > window.innerHeight / 2);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const menuItems = [
        { id: 'home', icon: '🏠', label: 'Home' },
        { id: 'about', icon: '👤', label: 'About' },
        { id: 'skills', icon: '⚡', label: 'Skills' },
        { id: 'projects', icon: '💼', label: 'Projects' },
        { id: 'contact', icon: '📧', label: 'Contact' }
    ];

    if (!showButton) return null;

    return (
        <div className="fixed right-6 bottom-6 z-50">
            {/* Quick Navigation Menu */}
            <div className={`absolute bottom-16 right-0 transition-all duration-300 ${
                isMenuOpen 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-4 pointer-events-none'
            }`}>
                <div className="flex flex-col gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20">
                    {menuItems.map((item, index) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300 group whitespace-nowrap"
                            style={{ 
                                animationDelay: `${index * 50}ms`,
                                animation: isMenuOpen ? `fadeInScale 0.3s ease-out forwards` : ''
                            }}
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </span>
                            <span className="text-sm font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main FAB Buttons */}
            <div className="flex flex-col gap-3">
                {/* Back to Top Button */}
                <button
                    onClick={scrollToTop}
                    className="w-14 h-14 bg-gradient-to-r from-tertiary to-green-400 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
                    title="Back to Top"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-tertiary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                    <svg 
                        className="w-6 h-6 text-primary relative z-10 group-hover:animate-bounce" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>

                {/* Menu Toggle Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="w-14 h-14 bg-gradient-to-r from-secondary to-orange-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
                    title="Quick Navigation"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                    <div className="relative z-10">
                        <svg 
                            className={`w-6 h-6 text-white transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : 'rotate-0'}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                </button>
            </div>

            {/* Click outside to close menu */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 -z-10" 
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default FloatingActionButton;
