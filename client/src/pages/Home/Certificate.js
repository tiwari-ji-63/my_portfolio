import React from "react";
import SectionTitle from "../../components/SectionTitle";
import {useSelector} from "react-redux";

function Certificate() {
    const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);
    const {portfolioData} = useSelector((state) => state.root);
    const {certificates} = portfolioData;
    return (
        <div>
            <SectionTitle title="Certificate"/>
            <div className="flex py-10 gap-60 sm:flex-col sm:gap-16">
                <div
                    className="flex flex-col gap-10 border-l-2 border-[#135e4c82] w-1/4 sm:flex-row sm:overflow-x-scroll sm:w-full">
                    {certificates.map((certificate, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedItemIndex(index)}
                            className="cursor-pointer"
                        >
                            <h1
                                className={`text-xl px-5 transition-all duration-300 ease-in-out transform w-72 ${
                                    selectedItemIndex === index
                                        ? "text-tertiary border-tertiary border-l-4 -ml-[3px] bg-[#1a7f5a31] py-3"
                                        : "text-white hover:text-tertiary hover:bg-[#1a7f5a10]"
                                }`}
                            >
                                {certificate.issuer}
                            </h1>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-center gap-10 sm:flex-col">
                    <div className="flex flex-col gap-5">
                        <h1 className="text-secondary text-xl">
                            Certificate Name : {certificates[selectedItemIndex].title}
                        </h1>
                        <h1 className="text-white text-xl">
                            IssueDate : {certificates[selectedItemIndex].issueDate}
                        </h1>
                        <p className="text-tertiary">
                            Description : {certificates[selectedItemIndex].description}
                        </p>
                    </div>
                    <img
                        src={certificates[selectedItemIndex].image}
                        alt={certificates[selectedItemIndex].title}
                        className="h-96 w-auto sm:h-auto sm:w-96"
                    />
                </div>
            </div>
        </div>
    );
}

export default Certificate;