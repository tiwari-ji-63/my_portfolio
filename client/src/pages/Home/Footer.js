import React from 'react'
import {useSelector} from "react-redux";
import { useTheme } from "../../contexts/ThemeContext";


function Footer() {
    const { portfolioData} = useSelector((state) => state.root);
    const {footer} = portfolioData || {};
    const {firstLine, secondLine} = footer || {};
    const { isDarkMode } = useTheme();

    // Add safety check
    if (!footer) {
        return null; // Footer can be hidden if no data
    }
    
    return (
        <div className="py-10">
            <div className={`h-[1px] w-full ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
            }`}>

            </div>
            <div className="flex items-center justify-center flex-col mt-10 opacity-70">
                <h1 className={isDarkMode ? 'text-white' : 'text-gray-800'}>
                    {firstLine}
                </h1>
                <h1 className={isDarkMode ? 'text-white' : 'text-gray-800'}>
                    <span className="text-tertiary"> {secondLine} </span>
                </h1>
            </div>

        </div>
    )
}

export default Footer