import React from 'react';
import SectionTitle from '../../components/SectionTitle';
import Card from '../../components/Card';
import {useSelector} from "react-redux";

function Project() {
    const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);
    const {portfolioData} = useSelector((state) => state.root);
    const {projects} = portfolioData;

    return (
        <div>
            <SectionTitle title="Projects"/>
            <div className="flex py-10 gap-60 sm:flex-col sm:gap-16 ">
                <div
                    className="flex flex-col gap-10 border-l-2 border-[#135e4c82] w-1/6 sm:flex-row sm:overflow-x-scroll sm:w-full ">
                    {projects.map((project, index) => (
                        <div
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
                                {project.title}
                            </h1>
                        </div>
                    ))}
                </div>

                <div>
                    <Card
                        title={`Project Name : ${projects[selectedItemIndex].title}`}
                        subtitle={`Used Technologies : ${projects[selectedItemIndex].technologies}`}
                        description={`Description : ${projects[selectedItemIndex].description}`}
                        image={projects[selectedItemIndex].image}
                        link={projects[selectedItemIndex].project_link}
                        githubLink={projects[selectedItemIndex].github_link}
                    />
                </div>
            </div>
        </div>
    );
}

export default Project;