import React, { useState } from 'react';
import SectionTitle from "../../components/SectionTitle";
import {useSelector} from "react-redux";
import { useNotification } from "../../contexts/NotificationContext";
import Button from "../../components/Button";
import { useTheme } from "../../contexts/ThemeContext";

function Contact() {
    const {portfolioData} = useSelector((state) => state.root);
    const {contacts} = portfolioData || {};
    const { success, error, info } = useNotification();
    const { isDarkMode } = useTheme();
    
    // All hooks must be called before any conditional returns
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Add safety check after all hooks
    if (!contacts) {
        return (
            <div className="py-20">
                <SectionTitle title="Say Hello" />
                <div className={`text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Loading contact information...
                </div>
            </div>
        );
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name || !formData.email || !formData.message) {
            error("Please fill in all fields");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            error("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);
        info("Sending your message...");

        try {
            // Send message to the same backend endpoint
            const response = await fetch('/api/contact/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    subject: `Message from ${formData.name}`, // Auto-generate subject for this form
                    message: formData.message.trim()
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to send message');
            }
            
            // Reset form
            setFormData({ name: '', email: '', message: '' });
            success(data.message || "Message sent successfully! I'll get back to you soon.", {
                duration: 8000
            });
        } catch (err) {
            error(err.message || "Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <SectionTitle title="Say Hello"/>
            <div className="flex px-10 sm:flex-col items-start justify-between gap-10">
                <div className="flex flex-col gap-1 flex-1">
                    <p className={isDarkMode ? "text-white" : "text-gray-800"}>{'{'}</p>
                    <p className="ml-5">
                        <span className="text-tertiary">Name : </span> : <span
                        className="text-tertiary">{contacts.name}</span>
                    </p>
                    <p className="ml-5">
                        <span className="text-tertiary">Age : </span> : <span
                        className="text-tertiary">{contacts.age}</span>
                    </p>
                    <p className="ml-5">
                        <span className="text-tertiary">Gender : </span> : <span
                        className="text-tertiary">{contacts.gender}</span>
                    </p>
                    <p className="ml-5">
                        <span className="text-tertiary">Email : </span> : <span
                        className="text-tertiary">{contacts.email}</span>
                    </p>
                    <p className="ml-5">
                        <span className="text-tertiary">Mobile : </span> : <span
                        className="text-tertiary">{contacts.mobile}</span>
                    </p>
                    <p className="ml-5">
                        <span className="text-tertiary">Address : </span> : <span
                        className="text-tertiary">{contacts.address}</span>
                    </p>
                    <p className={isDarkMode ? "text-white" : "text-gray-800"}>{'}'}</p>
                </div>

                {/* Contact Form */}
                <div className="flex-1">
                    <div className={`backdrop-blur-sm border rounded-lg p-6 ${
                        isDarkMode 
                            ? 'bg-primary/20 border-secondary/30' 
                            : 'bg-white/80 border-gray-200'
                    }`}>
                        <h3 className={`text-xl font-semibold mb-4 ${
                            isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>Send me a message</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-tertiary transition-colors ${
                                        isDarkMode 
                                            ? 'bg-primary/40 border-secondary/30 text-white placeholder-gray-400' 
                                            : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500'
                                    }`}
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-tertiary transition-colors ${
                                        isDarkMode 
                                            ? 'bg-primary/40 border-secondary/30 text-white placeholder-gray-400' 
                                            : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500'
                                    }`}
                                />
                            </div>
                            <div>
                                <textarea
                                    name="message"
                                    placeholder="Your Message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:border-tertiary transition-colors ${
                                        isDarkMode 
                                            ? 'bg-primary/40 border-secondary/30 text-white placeholder-gray-400' 
                                            : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500'
                                    }`}
                                ></textarea>
                            </div>
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={isSubmitting}
                                disabled={isSubmitting}
                                className="w-full"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="h-[400px] flex-1 hide-mobile complex-animation">
                    <dotlottie-player
                        src={contacts.lottieURL || ""}
                        background="transparent"
                        speed="1"
                        direction="1"
                        playMode="normal"
                        loop=""
                        autoplay="">
                    </dotlottie-player>
                </div>
            </div>
        </div>
    );
}

export default Contact;