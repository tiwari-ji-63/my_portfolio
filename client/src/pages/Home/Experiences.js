import React from "react";
import SectionTitle from "../../components/SectionTitle";
import Card from "../../components/Card";
import {useSelector} from "react-redux";

function Experiences() {
    const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);
    const {portfolioData} = useSelector((state) => state.root);
    const {experiences} = portfolioData;
    return (
        <div>
            <SectionTitle title="Experience"/>
            <div className="flex py-10 gap-20 lg:flex-row sm:flex-col">
                <div className="flex flex-col gap-10 border-l-2 border-[#135e4c82] w-1/3 sm:w-full">
                    {experiences.map((experience, index) => (
                        <div
                            onClick={() => setSelectedItemIndex(index)}
                            className="cursor-pointer"
                        >
                            <h1
                                className={`text-xl px-5 ${
                                    selectedItemIndex === index
                                        ? "text-tertiary border-tertiary border-l-4 -ml-[3px] bg-[#1a7f5a31] py-3"
                                        : "text-white"
                                }`}
                            >
                                {experience.period}
                            </h1>
                        </div>
                    ))}
                </div>

                <div className="transition-all duration-500 ease-in-out">
                    <Card
                        title={`Position: ${experiences[selectedItemIndex].title}`}
                        subtitle={`Company: ${experiences[selectedItemIndex].company} | Period: ${experiences[selectedItemIndex].period}`}
                        description={experiences[selectedItemIndex].description}
                    />
                </div>
            </div>
        </div>
    );
}

export default Experiences;