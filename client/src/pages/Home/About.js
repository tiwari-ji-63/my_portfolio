import React from "react";
import SectionTitle from "../../components/SectionTitle";
import {useSelector} from "react-redux";
import { useTheme } from "../../contexts/ThemeContext";

function About() {
    const { portfolioData} = useSelector((state) => state.root);
    const {about} = portfolioData || {};
    const {skills, lottieURL, description1, description2, message} = about || {};
    const { isDarkMode } = useTheme();

    // Add safety check
    if (!about) {
        return (
            <div className="py-20">
                <SectionTitle title="About Me" />
                <div className={`text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Loading about information...
                </div>
            </div>
        );
    }

    return (
        <div className="py-20">
            <SectionTitle 
                title="About Me" 
                subtitle="Get to know more about my background and expertise"
                icon="👨‍💻"
            />

            <div className="flex w-full items-center gap-16 sm:flex-col sm:gap-10">
                {/* Lottie Animation - Hidden on Mobile */}
                <div className="h-[50vh] w-1/2 sm:w-full relative group hide-mobile complex-animation">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-tertiary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 h-full rounded-2xl overflow-hidden glass-morphism">
                        <dotlottie-player
                            src={lottieURL}
                            background="transparent"
                            speed="1"
                            direction="1"
                            playMode="normal"
                            loop
                            autoplay
                            className="w-full h-full"
                        ></dotlottie-player>
                    </div>
                </div>

                {/* Content - Full width on mobile when animation is hidden */}
                <div className="flex flex-col gap-8 w-1/2 sm:w-full mobile-full-width">
                    <div className="space-y-6">
                        <div className={`p-6 rounded-xl glass-morphism-dark transition-all duration-500 hover:scale-105 ${
                            isDarkMode ? 'border-white/10' : 'border-gray-200'
                        }`}>
                            <p className={`leading-relaxed text-lg ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                {description1 || ''}
                            </p>
                        </div>
                        
                        <div className={`p-6 rounded-xl glass-morphism-dark transition-all duration-500 hover:scale-105 ${
                            isDarkMode ? 'border-white/10' : 'border-gray-200'
                        }`}>
                            <p className={`leading-relaxed text-lg ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                {description2 || ''}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills Section */}
            <div className="py-16">
                {message && (
                    <div className="text-center mb-12">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-tertiary to-green-400 bg-clip-text text-transparent mb-4">
                            {message}
                        </h3>
                        <div className="w-24 h-1 bg-gradient-to-r from-secondary to-tertiary mx-auto rounded-full"></div>
                    </div>
                )}
                
                <div className="flex flex-wrap gap-4 mt-8">
                    {skills.filter(skill => skill && skill.trim() !== '').map((skill, index) => (
                        <div 
                            key={index}
                            className={`border-2 border-tertiary/30 py-4 px-6 rounded-xl ${
                                isDarkMode 
                                    ? 'bg-gradient-to-br from-gray-900/50 to-gray-800/50' 
                                    : 'bg-gradient-to-br from-white/80 to-gray-50/80'
                            } backdrop-blur-sm shadow-lg`}
                        >
                            <h4 className={`font-bold text-center whitespace-nowrap ${
                                isDarkMode ? 'text-tertiary' : 'text-tertiary'
                            }`}>
                                {skill}
                            </h4>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default About;
