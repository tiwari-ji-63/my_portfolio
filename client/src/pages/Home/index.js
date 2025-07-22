import React, {useEffect, useState} from "react";
import Header from "../../components/Header";
import Introduction from "./Introduction";
import About from "./About";
import Experiences from "./Experiences";
import Project from "./Project";
import Certificate from "./Certificate";
import Skill from "./Skill";
import Contact from "./Contact";
import Footer from "./Footer";
import LeftSider from "./LeftSider";
import Education from "./Education";
import {useSelector} from "react-redux";
import { useTheme } from "../../contexts/ThemeContext";

function Home() {
    const {portfolioData} = useSelector((state) => state.root);
    const { isDarkMode } = useTheme();
    const [scrollProgress, setScrollProgress] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState({});

    // Track scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = totalScroll / windowHeight;
            setScrollProgress(scroll);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Mouse tracking for interactive effects
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible(prev => ({
                        ...prev,
                        [entry.target.id]: entry.isIntersecting
                    }));
                });
            },
            { threshold: 0.1 }
        );

        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, [portfolioData]);

    return (
        <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
            isDarkMode ? 'bg-primary' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
        }`}>
            {/* Enhanced Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Animated gradient orbs */}
                <div className={`absolute top-20 -left-20 w-96 h-96 rounded-full opacity-20 animate-pulse ${
                    isDarkMode ? 'bg-gradient-to-r from-secondary to-tertiary' : 'bg-gradient-to-r from-blue-400 to-purple-400'
                }`} />
                <div className={`absolute bottom-20 -right-20 w-80 h-80 rounded-full opacity-15 animate-pulse delay-1000 ${
                    isDarkMode ? 'bg-gradient-to-r from-tertiary to-accent' : 'bg-gradient-to-r from-pink-400 to-orange-400'
                }`} />
                
                {/* Floating particles */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute w-2 h-2 rounded-full opacity-30 animate-float ${
                                isDarkMode ? 'bg-tertiary' : 'bg-blue-400'
                            }`}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${3 + Math.random() * 4}s`
                            }}
                        />
                    ))}
                </div>

                {/* Interactive cursor glow */}
                <div 
                    className={`absolute w-96 h-96 rounded-full pointer-events-none transition-all duration-1000 ${
                        isDarkMode 
                            ? 'bg-gradient-radial from-secondary/10 via-tertiary/5 to-transparent' 
                            : 'bg-gradient-radial from-blue-400/10 via-purple-400/5 to-transparent'
                    }`}
                    style={{
                        left: mousePosition.x - 192,
                        top: mousePosition.y - 192,
                    }}
                />
            </div>

            {/* Enhanced Scroll Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-200/50 backdrop-blur-sm z-50">
                <div 
                    className="h-full bg-gradient-to-r from-secondary via-tertiary to-accent transition-all duration-300 shadow-lg"
                    style={{ 
                        width: `${scrollProgress * 100}%`,
                        boxShadow: '0 0 20px rgba(249, 115, 22, 0.5)'
                    }}
                />
            </div>

            <Header/>
            
            {portfolioData ? (
                <div className={`relative z-10 transition-colors duration-500 pt-20 ${
                    isDarkMode ? 'bg-transparent' : 'bg-transparent'
                }`}>
                    <div className="px-40 sm:px-5 lg:px-20 xl:px-32">
                        {/* Hero Section with Enhanced Animations */}
                        <section 
                            id="home" 
                            className={`mb-32 transform transition-all duration-1000 ${
                                isVisible.home 
                                    ? 'translate-y-0 opacity-100' 
                                    : 'translate-y-20 opacity-0'
                            }`}
                        >
                            <div className="relative">
                                {/* Background decoration */}
                                <div className={`absolute inset-0 rounded-3xl ${
                                    isDarkMode 
                                        ? 'bg-gradient-to-br from-surface/20 via-transparent to-accent/10' 
                                        : 'bg-gradient-to-br from-white/60 via-blue-50/40 to-purple-50/30'
                                } backdrop-blur-xl border border-white/10 -z-10`} />
                                <Introduction/>
                            </div>
                        </section>
                        
                        {/* About Section with Modern Card */}
                        {portfolioData.about && (
                            <section 
                                id="about" 
                                className={`mb-32 transform transition-all duration-1000 delay-100 ${
                                    isVisible.about 
                                        ? 'translate-y-0 opacity-100 scale-100' 
                                        : 'translate-y-20 opacity-0 scale-95'
                                }`}
                            >
                                <div className={`relative rounded-3xl p-8 ${
                                    isDarkMode 
                                        ? 'bg-surface/30 border border-white/10' 
                                        : 'bg-white/70 border border-gray-200/50'
                                } backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 group`}>
                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-secondary/10 via-tertiary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        <About/>
                                    </div>
                                </div>
                            </section>
                        )}
                        
                        {/* Skills Section */}
                        {portfolioData.skills && (
                            <section 
                                id="skills" 
                                className={`mb-32 transform transition-all duration-1000 delay-200 ${
                                    isVisible.skills 
                                        ? 'translate-y-0 opacity-100 scale-100' 
                                        : 'translate-y-20 opacity-0 scale-95'
                                }`}
                            >
                                <div className={`relative rounded-3xl p-8 ${
                                    isDarkMode 
                                        ? 'bg-surface/30 border border-white/10' 
                                        : 'bg-white/70 border border-gray-200/50'
                                } backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 group`}>
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-tertiary/10 via-accent/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        <Skill/>
                                    </div>
                                </div>
                            </section>
                        )}
                        
                        {/* Experiences Section */}
                        {portfolioData.experiences && (
                            <section 
                                id="experiences" 
                                className={`mb-32 transform transition-all duration-1000 delay-300 ${
                                    isVisible.experiences 
                                        ? 'translate-y-0 opacity-100 scale-100' 
                                        : 'translate-y-20 opacity-0 scale-95'
                                }`}
                            >
                                <div className={`relative rounded-3xl p-8 ${
                                    isDarkMode 
                                        ? 'bg-surface/30 border border-white/10' 
                                        : 'bg-white/70 border border-gray-200/50'
                                } backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 group`}>
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-accent/10 via-secondary/10 to-tertiary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        <Experiences/>
                                    </div>
                                </div>
                            </section>
                        )}
                        
                        {/* Projects Section */}
                        {portfolioData.projects && (
                            <section 
                                id="projects" 
                                className={`mb-32 transform transition-all duration-1000 delay-400 ${
                                    isVisible.projects 
                                        ? 'translate-y-0 opacity-100 scale-100' 
                                        : 'translate-y-20 opacity-0 scale-95'
                                }`}
                            >
                                <div className={`relative rounded-3xl p-8 ${
                                    isDarkMode 
                                        ? 'bg-surface/30 border border-white/10' 
                                        : 'bg-white/70 border border-gray-200/50'
                                } backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 group`}>
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-secondary/10 via-accent/10 to-tertiary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        <Project/>
                                    </div>
                                </div>
                            </section>
                        )}
                        
                        {/* Education Section */}
                        {portfolioData.educations && (
                            <section 
                                id="education" 
                                className={`mb-32 transform transition-all duration-1000 delay-500 ${
                                    isVisible.education 
                                        ? 'translate-y-0 opacity-100 scale-100' 
                                        : 'translate-y-20 opacity-0 scale-95'
                                }`}
                            >
                                <div className={`relative rounded-3xl p-8 ${
                                    isDarkMode 
                                        ? 'bg-surface/30 border border-white/10' 
                                        : 'bg-white/70 border border-gray-200/50'
                                } backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 group`}>
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-tertiary/10 via-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        <Education/>
                                    </div>
                                </div>
                            </section>
                        )}
                        
                        {/* Certificates Section */}
                        {portfolioData.certificates && (
                            <section 
                                id="certificates" 
                                className={`mb-32 transform transition-all duration-1000 delay-600 ${
                                    isVisible.certificates 
                                        ? 'translate-y-0 opacity-100 scale-100' 
                                        : 'translate-y-20 opacity-0 scale-95'
                                }`}
                            >
                                <div className={`relative rounded-3xl p-8 ${
                                    isDarkMode 
                                        ? 'bg-surface/30 border border-white/10' 
                                        : 'bg-white/70 border border-gray-200/50'
                                } backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 group`}>
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-accent/10 via-tertiary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        <Certificate/>
                                    </div>
                                </div>
                            </section>
                        )}
                        
                        {/* Contact Section */}
                        {portfolioData.contacts && (
                            <section 
                                id="contact" 
                                className={`mb-32 transform transition-all duration-1000 delay-700 ${
                                    isVisible.contact 
                                        ? 'translate-y-0 opacity-100 scale-100' 
                                        : 'translate-y-20 opacity-0 scale-95'
                                }`}
                            >
                                <div className={`relative rounded-3xl p-8 ${
                                    isDarkMode 
                                        ? 'bg-surface/30 border border-white/10' 
                                        : 'bg-white/70 border border-gray-200/50'
                                } backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 group`}>
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-secondary/10 via-tertiary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        <Contact/>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                    
                    {/* Footer with enhanced styling */}
                    <div className="relative">
                        <div className={`absolute inset-0 ${
                            isDarkMode 
                                ? 'bg-gradient-to-t from-surface/50 to-transparent' 
                                : 'bg-gradient-to-t from-gray-100/80 to-transparent'
                        } backdrop-blur-sm`} />
                        <div className="relative z-10">
                            <Footer/>
                        </div>
                    </div>
                    
                    <LeftSider/>
                </div>
            ) : (
                <div className="flex items-center justify-center min-h-screen relative z-10">
                    <div className="text-center">
                        {/* Enhanced loading animation */}
                        <div className="relative">
                            {/* Spinning rings */}
                            <div className="w-32 h-32 mx-auto mb-8 relative">
                                <div className="absolute inset-0 border-4 border-secondary/30 rounded-full animate-spin"></div>
                                <div className="absolute inset-2 border-4 border-tertiary/40 rounded-full animate-spin-reverse"></div>
                                <div className="absolute inset-4 border-4 border-accent/50 rounded-full animate-spin"></div>
                            </div>
                            
                            {/* Loading text with gradient */}
                            <div className={`text-3xl font-bold bg-gradient-to-r from-secondary via-tertiary to-accent bg-clip-text text-transparent animate-pulse mb-4`}>
                                Loading Portfolio
                            </div>
                            
                            {/* Loading dots */}
                            <div className="flex justify-center space-x-2">
                                {[0, 1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className="w-3 h-3 bg-secondary rounded-full animate-bounce"
                                        style={{ animationDelay: `${i * 0.15}s` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;