import React from "react";
import {useSelector} from "react-redux";

function Introduction() {
    const {portfolioData} = useSelector((state) => state.root);
    const {introduction} = portfolioData;
    const {welcomeText, firstName, lastName, jobTitle, description, myResume} = introduction;

    return (
        <div className="h-[80vh] bg-primary flex flex-col items-start justify-center gap-8 py-10 ">
            <h1 className="text-white text-2xl">{welcomeText || ''} </h1>
            <h1 className="text-7xl sm:text-3xl text-secondary font-semibold ">
                {firstName || ''} {lastName || ''}
            </h1>
            <h1 className="text-6xl sm:text-2xl text-white font-semibold ">
                {jobTitle || ''}
            </h1>
            <p className="text-white w-2/3">
                {description || ''}
            </p>
            <a
                href={myResume || ''}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-tertiary text-tertiary px-10 py-3 rounded hover:border-secondary hover:text-white"
            >
                My Resume
            </a>
        </div>
    );
}

export default Introduction;