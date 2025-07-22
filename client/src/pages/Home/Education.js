import React from 'react';
import SectionTitle from '../../components/SectionTitle';
import Card from '../../components/Card';
import {useSelector} from "react-redux";
import { useTheme } from "../../contexts/ThemeContext";

function Education() {
    const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);
    const [freshEducationData, setFreshEducationData] = React.useState(null);
    const {portfolioData} = useSelector((state) => state.root);
    const {educations = []} = portfolioData || {};
    const { isDarkMode } = useTheme();

    // Use fresh data if available, otherwise fall back to Redux data
    const displayEducations = freshEducationData || educations;

    // Debug education data with more details
    console.log('=== EDUCATION DEBUG START ===');
    console.log('Education Component - Portfolio Data:', portfolioData);
    console.log('Education Component - Educations from Redux:', educations);
    console.log('Education Component - Fresh Education Data:', freshEducationData);
    console.log('Education Component - Display Educations:', displayEducations);
    console.log('Education Component - Display Educations Length:', displayEducations.length);
    console.log('Education Component - Display Educations Type:', typeof displayEducations);
    console.log('Education Component - Is Array:', Array.isArray(displayEducations));
    
    // Detailed debugging of each education item
    if (displayEducations && displayEducations.length > 0) {
        displayEducations.forEach((edu, index) => {
            console.log(`=== Education ${index + 1} Details ===`);
            console.log('_id:', edu._id);
            console.log('title:', edu.title);
            console.log('institution:', edu.institution);
            console.log('degree:', edu.degree);
            console.log('period:', edu.period);
            console.log('description:', edu.description);
            console.log('grade:', edu.grade);
            console.log('location:', edu.location);
            console.log('Full Object:', JSON.stringify(edu, null, 2));
            console.log('===========================');
        });
    } else {
        console.log('❌ No education data found or empty array');
    }
    console.log('=== EDUCATION DEBUG END ===');

    // Function to fetch fresh education data directly
    const fetchFreshEducationData = async () => {
        try {
            console.log('🔄 Fetching fresh education data...');
            const timestamp = new Date().getTime();
            const response = await fetch(`/api/portfolio/get-portfolio-data?t=${timestamp}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            const data = await response.json();
            console.log('🔄 Fresh API Response:', data);
            console.log('🔄 Fresh Education Data:', data.educations);
            
            if (data.educations && data.educations.length > 0) {
                setFreshEducationData(data.educations);
                console.log('✅ Set fresh education data:', data.educations);
            } else {
                console.log('❌ No education data in fresh response');
            }
        } catch (error) {
            console.error('❌ Error fetching fresh education data:', error);
        }
    };

    // Fetch fresh data on component mount
    React.useEffect(() => {
        fetchFreshEducationData();
    }, []);

    // Add safety check
    if (!displayEducations || displayEducations.length === 0) {
        return (
            <div className="py-20">
                <SectionTitle title="Education" />
                <div className={`text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    No education information available. Please add education data in the admin panel.
                </div>
            </div>
        );
    }

    return (
        <div>
            <SectionTitle title="Education"/>
            <div className="flex py-10 gap-60 sm:flex-col sm:gap-16">
                <div className="flex flex-col gap-10 border-l-2 border-[#135e4c82] w-96 sm:flex-row sm:overflow-x-scroll sm:w-full">
                    {displayEducations.map((edu, index) => (
                        <div
                            key={edu._id || index}
                            onClick={() => setSelectedItemIndex(index)}
                            className="cursor-pointer"
                        >
                            <h1
                                className={`text-xl px-5 py-3 transition-all duration-500 ease-in-out w-72 border-l-4 -ml-[3px] ${
                                    selectedItemIndex === index
                                        ? "text-tertiary border-tertiary bg-[#1a7f5a31]"
                                        : `${isDarkMode ? 'text-white' : 'text-gray-800'} border-transparent hover:text-tertiary hover:bg-[#1a7f5a10] hover:border-tertiary/30`
                                }`}
                            >
                                {edu.institution || edu.title}
                            </h1>
                        </div>
                    ))}
                </div>

                <div className="transition-all duration-500 ease-in-out">
                    <Card
                        title={`Institution: ${displayEducations[selectedItemIndex]?.institution || 'N/A'}`}
                        subtitle={`${displayEducations[selectedItemIndex]?.degree || displayEducations[selectedItemIndex]?.title || 'N/A'}`}
                        description={`Period: ${displayEducations[selectedItemIndex]?.period || 'N/A'} | ${displayEducations[selectedItemIndex]?.description || 'No description available'}${displayEducations[selectedItemIndex]?.grade ? ` | Grade: ${displayEducations[selectedItemIndex].grade}` : ''}`}
                    />
                </div>
            </div>
        </div>
    );
}

export default Education;