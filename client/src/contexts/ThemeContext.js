import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? JSON.parse(saved) : true; // Default to dark mode
    });

    const [theme, setTheme] = useState(() => ({
        primary: isDarkMode ? '#0A192F' : '#FFFFFF',
        secondary: '#F97316',
        tertiary: '#54D6BB',
        background: isDarkMode ? '#0A192F' : '#F8FAFC',
        surface: isDarkMode ? '#1E293B' : '#FFFFFF',
        text: isDarkMode ? '#FFFFFF' : '#0F172A',
        textSecondary: isDarkMode ? '#94A3B8' : '#64748B',
        border: isDarkMode ? '#334155' : '#E2E8F0',
        accent: isDarkMode ? '#3B82F6' : '#6366F1'
    }));

    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(isDarkMode));
        
        const newTheme = {
            primary: isDarkMode ? '#0A192F' : '#FFFFFF',
            secondary: '#F97316',
            tertiary: '#54D6BB',
            background: isDarkMode ? '#0A192F' : '#F8FAFC',
            surface: isDarkMode ? '#1E293B' : '#FFFFFF',
            text: isDarkMode ? '#FFFFFF' : '#0F172A',
            textSecondary: isDarkMode ? '#94A3B8' : '#64748B',
            border: isDarkMode ? '#334155' : '#E2E8F0',
            accent: isDarkMode ? '#3B82F6' : '#6366F1'
        };

        setTheme(newTheme);

        // Update CSS custom properties
        const root = document.documentElement;
        Object.entries(newTheme).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });

        // Update body class for global styling
        document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const value = {
        isDarkMode,
        theme,
        toggleTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
