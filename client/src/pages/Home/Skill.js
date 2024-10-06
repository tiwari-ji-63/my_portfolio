import React from "react";
import SectionTitle from "../../components/SectionTitle";
import { useSelector } from "react-redux";

function Skill() {
    const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);
    const { portfolioData } = useSelector((state) => state.root);
    const { skills = [] } = portfolioData || {};
    const selectedSkillCategory = skills[selectedItemIndex] || { skills: [] };

    return (
        <div>
            <SectionTitle title="Skill" />
            <div className="flex py-10 gap-60 sm:flex-col sm:gap-8">
                {/* Skill Categories */}
                <div className="flex flex-col gap-10 border-l-2 border-[#135e4c82] w-1/6 sm:flex-row sm:overflow-x-scroll sm:w-full">
                    {skills.map((skillCategory, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedItemIndex(index)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && setSelectedItemIndex(index)}
                            className="cursor-pointer"
                        >
                            <h1
                                className={`text-xl px-5 transition-all duration-300 ease-in-out transform w-72 ${
                                    selectedItemIndex === index
                                        ? "text-tertiary border-tertiary border-l-4 -ml-[3px] bg-[#1a7f5a31] py-3"
                                        : "text-white hover:text-tertiary hover:bg-[#1a7f5a10]"
                                }`}
                            >
                                {skillCategory.title}
                            </h1>
                        </div>
                    ))}
                </div>

                {/* Skills */}
                <div className="py-8">
                    <div className="flex flex-wrap gap-8 mt-5">
                        {selectedSkillCategory.skills.map((skill, index) => (
                            <div
                                key={index}
                                className="border border-tertiary py-8 px-10 rounded sm:py-5 sm:px-3 transition-transform duration-300 ease-in-out transform hover:scale-105"
                            >
                                <h1 className="text-center text-xl text-secondary">{skill.name}</h1>
                                <p className="text-center text-tertiary">{skill.level}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skill;
