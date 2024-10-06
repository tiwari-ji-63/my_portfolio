import React from 'react';
import {useSelector} from "react-redux";

function LeftSider() {
    const {portfolioData} = useSelector((state) => state.root);
    const {leftSides} = portfolioData;
    const {email, phone, github, linkedin} = leftSides;

    return (
        <div className="fixed left-0 bottom-0 px-10 sm:static">
            <div className="flex flex-col items-center">
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-5 sm:mb-5">
                    <a href={email}>
                        <i className="ri-mail-line text-gray-600 text-2xl"></i>
                    </a>
                    <a href={phone}>
                        <i className="ri-phone-line text-gray-600 text-2xl"></i>
                    </a>
                    <a href={github} target="_blank" rel="noreferrer">
                        <i className="ri-github-fill text-gray-600 text-2xl"></i>
                    </a>
                    <a href={linkedin} target="_blank" rel="noreferrer">
                        <i className="ri-linkedin-box-line text-gray-600 text-2xl"></i>
                    </a>
                </div>
                <div className="w-[2px] h-72 bg-cyan-900 sm:hidden"></div>
            </div>
        </div>
    );
}

export default LeftSider;