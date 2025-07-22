import React, { useState, useEffect } from "react";
import {useSelector} from "react-redux";
import { useTheme } from "../../contexts/ThemeContext";
import { Modal, message } from "antd";
import AnimatedJobTitle from "../../components/AnimatedJobTitle";

function Introduction() {
    const {portfolioData} = useSelector((state) => state.root);
    const {introduction = {}, socialStats = {}} = portfolioData || {};
    const {welcomeText, firstName, lastName, jobTitle, description, myResume, profileImage} = introduction;
    
    // Contact form modal state
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    
    // Process job titles - handle both array and string formats more robustly
    let processedJobTitles;
    
    if (Array.isArray(jobTitle)) {
        // Already an array
        processedJobTitles = jobTitle.filter(title => title && title.trim());
    } else if (typeof jobTitle === 'string' && jobTitle.trim()) {
        // String that needs to be converted to array
        processedJobTitles = jobTitle.split(',').map(title => title.trim()).filter(title => title);
    } else {
        // No valid job title data
        processedJobTitles = [];
    }
    
    // Add default titles if none provided
    const finalJobTitles = processedJobTitles.length > 0 
        ? processedJobTitles 
        : ["Full Stack Developer", "UI/UX Designer", "Problem Solver", "Tech Enthusiast"];

    useEffect(() => {
        setIsVisible(true);
    }, []);    // Get dynamic fields from the backend - no static fallbacks
    const fields = socialStats.fields || [];
    
    // Sort fields by order and filter only enabled ones
    const sortedFields = [...fields]
        .filter(field => field.enabled !== false) // Only show enabled fields
        .sort((a, b) => a.order - b.order);
    
    const { isDarkMode } = useTheme();

    // Counter animation hook
    const useCounter = (end, duration = 2000) => {
        const [count, setCount] = useState(0);
        
        useEffect(() => {
            let startTime;
            const startCount = 0;
            
            const updateCount = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;
                const progressPercentage = Math.min(progress / duration, 1);
                
                const easeOutQuart = 1 - Math.pow(1 - progressPercentage, 4);
                const currentCount = Math.floor(easeOutQuart * (end - startCount) + startCount);
                
                setCount(currentCount);
                
                if (progressPercentage < 1) {
                    requestAnimationFrame(updateCount);
                }
            };
            
            requestAnimationFrame(updateCount);
        }, [end, duration]);
        
        return count;
    };

    // Create animated counters for each field (ensure we call hooks consistently)
    const counter0 = useCounter(sortedFields[0]?.value || 0);
    const counter1 = useCounter(sortedFields[1]?.value || 0);
    const counter2 = useCounter(sortedFields[2]?.value || 0);
    const counter3 = useCounter(sortedFields[3]?.value || 0);
    const counter4 = useCounter(sortedFields[4]?.value || 0);
    const counter5 = useCounter(sortedFields[5]?.value || 0);
    const counter6 = useCounter(sortedFields[6]?.value || 0);
    const counter7 = useCounter(sortedFields[7]?.value || 0);

    // Map the counters to fields
    const fieldCounters = sortedFields.map((field, index) => {
        const counters = [counter0, counter1, counter2, counter3, counter4, counter5, counter6, counter7];
        return {
            ...field,
            count: counters[index] || 0
        };
    });

    // Format number with suffix based on field type
    const formatStat = (field, count) => {
        const fieldName = field.name.toLowerCase();
        
        // Format based on field type
        if (fieldName.includes('satisfaction') || fieldName.includes('percent')) {
            return `${count}%`;
        } else if (fieldName.includes('followers') || fieldName.includes('likes') || fieldName.includes('views')) {
            if (count >= 1000) {
                return `${(count / 1000).toFixed(1)}k`;
            }
            return count.toString();
        } else {
            return `${count}+`;
        }
    };

    // Contact form handlers
    const handleContactFormChange = (e) => {
        const { name, value } = e.target;
        setContactForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleContactFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const loadingMessage = message.loading('Sending your message...', 0);
        
        try {
            if (!contactForm.name.trim() || !contactForm.email.trim() || 
                !contactForm.subject.trim() || !contactForm.message.trim()) {
                throw new Error('Please fill in all required fields');
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contactForm.email)) {
                throw new Error('Please enter a valid email address');
            }
            
            const response = await fetch('/api/contact/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: contactForm.name.trim(),
                    email: contactForm.email.trim(),
                    subject: contactForm.subject.trim(),
                    message: contactForm.message.trim()
                })
            });

            if (response.ok) {
                loadingMessage();
                message.success('Message sent successfully! I\'ll get back to you soon.');
                setContactForm({ name: '', email: '', subject: '', message: '' });
                setIsContactModalOpen(false);
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            loadingMessage();
            message.error(error.message || 'Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Hero Background with Animated Elements */}
            <div className="absolute inset-0">
                {/* Gradient Background */}
                <div className={`absolute inset-0 ${
                    isDarkMode 
                        ? 'bg-gradient-to-br from-primary via-surface to-primary' 
                        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
                }`} />
                
                {/* Floating Geometric Shapes - Hidden on Mobile */}
                <div className="absolute inset-0 overflow-hidden hide-mobile complex-animation">
                    <div className={`absolute top-20 left-20 w-72 h-72 rounded-full opacity-10 animate-float ${
                        isDarkMode ? 'bg-gradient-to-r from-secondary to-tertiary' : 'bg-gradient-to-r from-blue-400 to-purple-400'
                    }`} style={{ animationDelay: '0s' }} />
                    <div className={`absolute bottom-32 right-16 w-96 h-96 rounded-full opacity-10 animate-float ${
                        isDarkMode ? 'bg-gradient-to-r from-tertiary to-accent' : 'bg-gradient-to-r from-purple-400 to-pink-400'
                    }`} style={{ animationDelay: '2s' }} />
                    <div className={`absolute top-1/2 left-1/3 w-64 h-64 rounded-full opacity-10 animate-float ${
                        isDarkMode ? 'bg-gradient-to-r from-accent to-secondary' : 'bg-gradient-to-r from-green-400 to-blue-400'
                    }`} style={{ animationDelay: '1s' }} />
                </div>
            </div>

            {/* Main Content Container */}
            <div className={`relative z-10 w-full max-w-7xl mx-auto px-8 sm:px-4 transform transition-all duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    
                    {/* Left Side - Text Content */}
                    <div className="space-y-8 text-center lg:text-left">
                        {/* Welcome Text with Modern Animation */}
                        <div className={`relative transform transition-all duration-700 delay-300 ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                        }`}>
                            <p className={`text-lg sm:text-base font-medium tracking-wide ${
                                isDarkMode ? 'text-tertiary' : 'text-blue-600'
                            } mb-2`}>
                                {welcomeText || 'Welcome to my portfolio'}
                            </p>
                            <div className="w-16 h-1 bg-gradient-to-r from-secondary to-tertiary rounded-full mx-auto lg:mx-0" />
                        </div>

                        {/* Name with Stunning Typography */}
                        <div className={`transform transition-all duration-700 delay-500 ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                        }`}>
                            <h1 className="text-6xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-4">
                                <span className="bg-gradient-to-r from-secondary via-orange-500 to-tertiary bg-clip-text text-transparent">
                                    {firstName || 'Your'} 
                                </span>
                                <br />
                                <span className={`${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    {lastName || 'Name'}
                                </span>
                            </h1>
                            
                            {/* Animated Job Title */}
                            <div className="h-16 flex items-center justify-center lg:justify-start">
                                <h2 className="text-2xl sm:text-xl md:text-3xl font-semibold">
                                    <span className={`${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        I'm a{' '}
                                    </span>
                                    <AnimatedJobTitle 
                                        jobTitles={finalJobTitles}
                                        className="bg-gradient-to-r from-accent to-tertiary bg-clip-text text-transparent"
                                    />
                                </h2>
                            </div>
                        </div>

                        {/* Description with Modern Card */}
                        <div className={`transform transition-all duration-700 delay-700 ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                        }`}>
                            <div className={`relative p-6 rounded-2xl backdrop-blur-xl border ${
                                isDarkMode 
                                    ? 'bg-surface/30 border-white/10 shadow-2xl' 
                                    : 'bg-white/70 border-gray-200/50 shadow-xl'
                            } hover:shadow-2xl transition-all duration-500 group`}>
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-secondary/5 via-tertiary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <p className={`relative text-lg sm:text-base leading-relaxed ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    {description || 'Passionate developer creating amazing digital experiences with modern technologies and innovative solutions.'}
                                </p>
                            </div>
                        </div>

                        {/* Enhanced Action Buttons */}
                        <div className={`flex gap-6 justify-center lg:justify-start sm:flex-col sm:items-center transform transition-all duration-700 delay-900 ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                        }`}>
                            {myResume && (
                                <button
                                    onClick={() => {
                                        if (myResume.startsWith('data:')) {
                                            const link = document.createElement('a');
                                            link.href = myResume;
                                            link.download = `${firstName || 'Resume'}_${lastName || 'Portfolio'}.pdf`;
                                            link.click();
                                        } else {
                                            window.open(myResume, '_blank', 'noopener,noreferrer');
                                        }
                                    }}
                                    className="group bg-gradient-to-r from-secondary to-orange-600 hover:from-orange-600 hover:to-secondary text-white px-8 py-4 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download Resume
                                </button>
                            )}
                            
                            <button
                                onClick={() => setIsContactModalOpen(true)}
                                className={`group px-8 py-4 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 border-2 ${
                                    isDarkMode 
                                        ? 'border-tertiary text-tertiary hover:bg-tertiary hover:text-primary' 
                                        : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                                } flex items-center gap-2`}
                            >
                                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Let's Talk
                            </button>
                        </div>
                        
                        {/* Social Stats with Enhanced Design - Hidden on Mobile */}
                        {fieldCounters.length > 0 && (
                            <div className={`transform transition-all duration-700 delay-1100 hide-mobile secondary-content ${
                                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                            }`}>
                                <div className="grid grid-cols-2 sm:grid-cols-1 gap-6 mt-12">
                                    {fieldCounters.slice(0, 4).map((field, index) => (
                                        <div 
                                            key={field.id}
                                            className={`group p-6 rounded-2xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 ${
                                                isDarkMode 
                                                    ? 'bg-surface/30 border-white/10 hover:border-white/20' 
                                                    : 'bg-white/70 border-gray-200/50 hover:border-gray-300/70'
                                            } hover:shadow-xl`}
                                        >
                                            <div className="text-center">
                                                <div className={`text-3xl sm:text-2xl font-bold mb-2 ${
                                                    index === 0 ? 'text-secondary' :
                                                    index === 1 ? 'text-tertiary' :
                                                    index === 2 ? 'text-accent' : 'text-orange-500'
                                                }`}>
                                                    {formatStat(field, field.count)}
                                                </div>
                                                <p className={`text-sm font-medium ${
                                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                                }`}>
                                                    {field.name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side - Profile Image & Decorative Elements */}
                    <div className={`relative flex justify-center lg:justify-end transform transition-all duration-1000 delay-300 ${
                        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
                    }`}>
                        {profileImage ? (
                            <div className="relative">
                                {/* Decorative Background Elements - Hidden on Mobile */}
                                <div className="absolute inset-0 scale-110 hide-mobile complex-animation">
                                    <div className={`w-full h-full rounded-3xl bg-gradient-to-br ${
                                        isDarkMode 
                                            ? 'from-secondary/20 via-tertiary/20 to-accent/20' 
                                            : 'from-blue-200/50 via-purple-200/50 to-pink-200/50'
                                    } animate-pulse`} />
                                </div>
                                
                                {/* Profile Image Container - Simplified on Mobile */}
                                <div className="relative z-10 p-2 bg-gradient-to-r from-secondary via-tertiary to-accent rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                                    <div className="bg-white rounded-3xl p-1">
                                        <img 
                                            src={profileImage}
                                            alt={`${firstName} ${lastName}`}
                                            className="w-80 h-80 sm:w-48 sm:h-48 rounded-3xl object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                                
                                {/* Floating Achievement Badges - Hidden on Mobile */}
                                <div className="absolute -top-6 -right-6 bg-gradient-to-r from-secondary to-orange-600 text-white p-4 rounded-2xl shadow-xl animate-bounce hide-mobile complex-animation">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                
                                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-tertiary to-accent text-white p-4 rounded-2xl shadow-xl animate-float hide-mobile complex-animation">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
                                    </svg>
                                </div>
                            </div>
                        ) : (
                            <div className="w-80 h-80 sm:w-64 sm:h-64 rounded-3xl bg-gradient-to-br from-secondary/20 to-tertiary/20 flex items-center justify-center backdrop-blur-xl border border-white/10">
                                <div className="text-center">
                                    <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-secondary to-tertiary flex items-center justify-center mb-4 ${
                                        isDarkMode ? 'text-white' : 'text-white'
                                    }`}>
                                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                    </div>
                                    <p className={`text-lg font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        Profile Image
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Contact Form Modal */}
            <Modal
                title={
                    <div className="text-xl font-semibold text-gray-800 border-b pb-3">
                        Let's Talk - Get In Touch
                    </div>
                }
                open={isContactModalOpen}
                onCancel={() => setIsContactModalOpen(false)}
                footer={null}
                width={600}
                className="contact-modal"
                centered
            >
                <form onSubmit={handleContactFormSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={contactForm.name}
                                onChange={handleContactFormChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                                placeholder="Your full name"
                                autoComplete="name"
                                style={{ fontSize: '16px', lineHeight: '1.5' }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={contactForm.email}
                                onChange={handleContactFormChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                                placeholder="your.email@example.com"
                                autoComplete="email"
                                style={{ fontSize: '16px', lineHeight: '1.5' }}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject *
                        </label>
                        <input
                            type="text"
                            name="subject"
                            value={contactForm.subject}
                            onChange={handleContactFormChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                            placeholder="Project discussion, collaboration, etc."
                            style={{ fontSize: '16px', lineHeight: '1.5' }}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message *
                        </label>
                        <textarea
                            name="message"
                            value={contactForm.message}
                            onChange={handleContactFormChange}
                            required
                            rows="5"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 resize-none"
                            placeholder="Tell me about your project or how I can help you..."
                            style={{ fontSize: '16px', lineHeight: '1.5' }}
                        />
                    </div>
                    
                    <div className="flex gap-4 justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => setIsContactModalOpen(false)}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium transition-all duration-200 ${
                                isSubmitting 
                                    ? 'opacity-70 cursor-not-allowed' 
                                    : 'hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-105'
                            }`}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Introduction;
