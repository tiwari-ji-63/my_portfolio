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
            <div className="flex py-10 gap-80 sm:flex-col sm:gap-10">
                <div
                    className="flex flex-col gap-10 border-l-2 border-[#135e4c82] w-1/7 sm:flex-row sm:overflow-x-scroll sm:w-full ">          {experiences.map((experience, index) => (
                    <div
                        onClick={() => setSelectedItemIndex(index)}
                        className="cursor-pointer"
                    >
                        <h1
                            className={`text-xl px-5 transition-all duration-300 ease-in-out transform w-56 ${
                                    selectedItemIndex === index
                                        ? "text-tertiary border-tertiary border-l-4 -ml-[3px] bg-[#1a7f5a31] py-3"
                                        : "text-white hover:text-tertiary hover:bg-[#1a7f5a10]"
                                }`}
                        >
                            {experience.period}
                        </h1>
                    </div>
                ))}
                </div>

                <Card
                    title={`Position : ${experiences[selectedItemIndex].title}`}
                    subtitle={`Company : ${experiences[selectedItemIndex].company}`}
                    description={`Description : ${experiences[selectedItemIndex].description}`}
                />
            </div>
        </div>
    );
}

export default Experiences;