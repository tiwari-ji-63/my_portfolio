import React, { useState, useEffect } from 'react';

const AnimatedJobTitle = ({ jobTitles, className = "", single = false }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Convert string to array if needed and filter empty values
    const titlesArray = Array.isArray(jobTitles) 
        ? jobTitles.filter(title => title.trim()) 
        : (jobTitles || '').split(',').map(title => title.trim()).filter(title => title);

    // Animation logic for multiple titles - MUST be called before any early returns
    useEffect(() => {
        // Only run animation if we have multiple titles
        if (titlesArray.length <= 1) {
            return;
        }
        const currentTitle = titlesArray[currentIndex] || '';
        
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing effect
                if (displayText.length < currentTitle.length) {
                    setDisplayText(currentTitle.slice(0, displayText.length + 1));
                } else {
                    // Finished typing, wait then start deleting
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else if (isDeleting) {
                // Deleting effect
                if (displayText.length > 0) {
                    setDisplayText(displayText.slice(0, -1));
                } else {
                    // Finished deleting, move to next title
                    setIsDeleting(false);
                    setCurrentIndex((prev) => (prev + 1) % titlesArray.length);
                }
            }
        }, isDeleting ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [displayText, currentIndex, isDeleting, titlesArray]);

    // If no titles, show default
    if (titlesArray.length === 0) {
        return <span className={className}>Job Title</span>;
    }

    // If only one title, show it without animation
    if (titlesArray.length === 1) {
        return <span className={className}>{titlesArray[0]}</span>;
    }

    // Color palette for job titles
    // Indian flag gradient (saffron to green, no white)
    const gradientStyle = {
        background: 'linear-gradient(90deg, #FF9933 0%, #FF9933 33%, #FFFFFF 34%, #138808 67%, #138808 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent',
        display: 'inline-block',
    };

    // For multiple titles, show animation with cursor and gradient
    return (
        <span className={className} style={gradientStyle}>
            {displayText}
            <span className="animate-pulse text-current ml-1" style={{ WebkitTextFillColor: '#138808', color: '#138808' }}>|</span>
        </span>
    );
};

export default AnimatedJobTitle;
