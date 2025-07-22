import { useState, useEffect, useCallback, useRef } from 'react';
import { useNotification } from '../contexts/NotificationContext';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const WARNING_TIMEOUT = 4 * 60 * 1000; // 4 minutes (1 min warning)
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keypress', 'keydown', 'keyup', 'scroll', 'touchstart', 'touchmove', 'click', 'focus', 'input', 'change', 'submit'];

export const useAutoLogout = (onLogout) => {
    const [showWarning, setShowWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [remainingSeconds, setRemainingSeconds] = useState(300); // 5 minutes in seconds
    const [isActive, setIsActive] = useState(true);
    const [lastActivity, setLastActivity] = useState(Date.now());
    
    const timeoutRef = useRef(null);
    const warningTimeoutRef = useRef(null);
    const countdownRef = useRef(null);
    const realTimeRef = useRef(null);
    const activityTimeoutRef = useRef(null);
    const { error, success } = useNotification();

    // Format time for display
    const formatTimeLeft = useCallback((seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    // Format remaining time with units
    const formatRemainingTime = useCallback(() => {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        
        if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        }
        return `${seconds}s`;
    }, [remainingSeconds]);

    // Reset all timers
    const resetTimers = useCallback(() => {
        console.log('🔄 Resetting all timers');
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
        if (realTimeRef.current) clearInterval(realTimeRef.current);
        if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
        setShowWarning(false);
        setTimeLeft(0);
        setRemainingSeconds(300); // Reset to 5 minutes
        setLastActivity(Date.now());
    }, []);

    // Start real-time countdown
    const startRealTimeCountdown = useCallback(() => {
        console.log('⏰ Starting 5-minute countdown');
        setRemainingSeconds(300); // 5 minutes
        
        realTimeRef.current = setInterval(() => {
            setRemainingSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(realTimeRef.current);
                    console.log('⏰ Countdown reached zero - auto logout');
                    onLogout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [onLogout]);

    // Start countdown for warning
    const startCountdown = useCallback(() => {
        const warningDuration = INACTIVITY_TIMEOUT - WARNING_TIMEOUT; // 1 minute
        setTimeLeft(Math.floor(warningDuration / 1000));
        
        countdownRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownRef.current);
                    console.log('⏰ Warning countdown ended - logging out');
                    onLogout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [onLogout]);

    // Handle user activity
    const handleActivity = useCallback(() => {
        console.log('🎯 User activity detected');
        setLastActivity(Date.now());
        setIsActive(true);
        
        // Clear activity indicator timeout
        if (activityTimeoutRef.current) {
            clearTimeout(activityTimeoutRef.current);
        }
        
        // Set activity to false after 2 seconds of no activity
        activityTimeoutRef.current = setTimeout(() => {
            setIsActive(false);
        }, 2000);
        
        resetTimers();
        startRealTimeCountdown();
        
        if (showWarning) {
            setShowWarning(false);
            success('Session extended! Activity detected.');
        }
    }, [resetTimers, startRealTimeCountdown, showWarning, success]);

    // Start warning
    const startWarning = useCallback(() => {
        console.log('⚠️ Starting warning phase');
        setShowWarning(true);
        startCountdown();
        error({
            message: 'Session Timeout Warning',
            description: `You will be logged out in 1 minute due to inactivity.`,
            duration: 0,
            key: 'logout-warning'
        });
    }, [startCountdown, error]);

    // Start timers
    const startTimers = useCallback(() => {
        console.log('🚀 Starting timers');
        resetTimers();
        
        // Start warning timer
        warningTimeoutRef.current = setTimeout(() => {
            startWarning();
        }, WARNING_TIMEOUT);
        
        // Start main logout timer
        timeoutRef.current = setTimeout(() => {
            console.log('🔚 Auto logout triggered');
            onLogout();
        }, INACTIVITY_TIMEOUT);
        
        // Start real-time countdown
        startRealTimeCountdown();
    }, [resetTimers, startWarning, startRealTimeCountdown, onLogout]);

    // Initialize and setup event listeners
    useEffect(() => {
        console.log('🏁 Initializing auto-logout with 5-minute timeout');
        
        // Start timers
        startTimers();
        
        // Add activity event listeners
        ACTIVITY_EVENTS.forEach(event => {
            document.addEventListener(event, handleActivity);
        });
        
        // Cleanup on unmount
        return () => {
            console.log('🧹 Cleaning up auto-logout');
            resetTimers();
            ACTIVITY_EVENTS.forEach(event => {
                document.removeEventListener(event, handleActivity);
            });
        };
    }, [startTimers, handleActivity, resetTimers]);

    // Handle page refresh
    useEffect(() => {
        const handleBeforeUnload = () => {
            // Don't clear session on page refresh
            sessionStorage.setItem('isPageRefresh', 'true');
        };
        
        const handleLoad = () => {
            const isPageRefresh = sessionStorage.getItem('isPageRefresh');
            if (isPageRefresh) {
                console.log('📱 Page refresh detected - maintaining session');
                sessionStorage.removeItem('isPageRefresh');
                // Reset timers after refresh
                setTimeout(() => {
                    startTimers();
                }, 100);
            }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('load', handleLoad);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('load', handleLoad);
        };
    }, [startTimers]);

    return {
        showWarning,
        timeLeft: formatTimeLeft(timeLeft),
        remainingTime: formatRemainingTime(),
        remainingSeconds,
        isActive,
        lastActivity,
        resetSession: handleActivity
    };
};
