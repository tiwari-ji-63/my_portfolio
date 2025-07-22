import React from 'react';
import {useSelector} from "react-redux";
import { useTheme } from "../../contexts/ThemeContext";

function LeftSider() {
    const {portfolioData} = useSelector((state) => state.root);
    const {leftSides} = portfolioData || {};
    const {email, phone, github, linkedin} = leftSides || {};
    const { isDarkMode } = useTheme();

    // Add safety check
    if (!leftSides) {
        return null; // Don't render if no leftSides data
    }

    return (
        <div className="fixed left-0 bottom-0 px-10 sm:static hide-mobile left-sidebar">
            <div className="flex flex-col items-center">
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-5 sm:mb-5">
                    <a href={email}>
                        <i className={`ri-mail-line text-2xl ${isDarkMode ? 'text-gray-400 hover:text-tertiary' : 'text-gray-600 hover:text-secondary'} transition-colors`}></i>
                    </a>
                    <a href={phone}>
                        <i className={`ri-phone-line text-2xl ${isDarkMode ? 'text-gray-400 hover:text-tertiary' : 'text-gray-600 hover:text-secondary'} transition-colors`}></i>
                    </a>
                    <a href={github} target="_blank" rel="noreferrer">
                        <i className={`ri-github-fill text-2xl ${isDarkMode ? 'text-gray-400 hover:text-tertiary' : 'text-gray-600 hover:text-secondary'} transition-colors`}></i>
                    </a>
                    <a href={linkedin} target="_blank" rel="noreferrer">
                        <i className={`ri-linkedin-box-line text-2xl ${isDarkMode ? 'text-gray-400 hover:text-tertiary' : 'text-gray-600 hover:text-secondary'} transition-colors`}></i>
                    </a>
                </div>
                <div className={`w-[2px] h-72 sm:hidden ${isDarkMode ? 'bg-cyan-900' : 'bg-gray-300'}`}></div>
            </div>
        </div>
    );
}

export default LeftSider;