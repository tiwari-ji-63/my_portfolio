import React from 'react'
import {useSelector} from "react-redux";


function Footer() {
    const { portfolioData} = useSelector((state) => state.root);
    const {footer} = portfolioData;
    const {firstLine, secondLine} = footer;
    return (
        <div className="py-10">
            <div className="h-[1px] w-full bg-gray-700 ">

            </div>
            <div className="flex items-center justify-center flex-col mt-10 opacity-70">
                <h1 className="text-white">
                    {firstLine}
                </h1>
                <h1 className="text-white">
                    <span className="text-tertiary"> {secondLine} </span>
                </h1>
            </div>

        </div>
    )
}

export default Footer