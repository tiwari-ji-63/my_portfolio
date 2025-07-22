// Session management utility functions
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds (was 5 minutes)

// BALANCED DEBUG MODE - allow page refresh but still logout on browser close
const BALANCED_DEBUG_MODE = true;

// Track when the page was loaded to provide grace period
let PAGE_LOAD_TIME = Date.now();

// Flag to track if this is a page refresh
let IS_PAGE_REFRESH = false;

export const isPageRefresh = () => {
    // AGGRESSIVE page refresh detection - prioritize preserving session on refresh
    try {
        // Method 1: Performance Navigation API (most reliable)
        const performanceEntries = performance.getEntriesByType("navigation");
        if (performanceEntries.length > 0) {
            const navEntry = performanceEntries[0];
            if (navEntry.type === "reload") {
                console.log('✅ Page refresh detected via Performance API');
                IS_PAGE_REFRESH = true;
                sessionStorage.setItem("isPageRefresh", "true");
                return true;
            }
        }

        // Method 2: Legacy performance.navigation
        if (performance.navigation && performance.navigation.type === 1) { // TYPE_RELOAD
            console.log('✅ Page refresh detected via performance.navigation');
            IS_PAGE_REFRESH = true;
            sessionStorage.setItem("isPageRefresh", "true");
            return true;
        }

        // Method 3: Check stored refresh flag (persists during same session)
        const wasPageRefresh = sessionStorage.getItem("isPageRefresh");
        if (wasPageRefresh === "true") {
            console.log('✅ Page refresh detected via stored flag');
            IS_PAGE_REFRESH = true;
            return true;
        }

        // Method 4: If we have a token but this is a fresh sessionStorage, it's likely a refresh
        const hasToken = localStorage.getItem("token");
        const hasSessionFlag = sessionStorage.getItem("sessionActiveFlag");
        const timeSincePageLoad = Date.now() - PAGE_LOAD_TIME;
        
        if (hasToken && !hasSessionFlag && timeSincePageLoad < 5000) { // Within 5 seconds
            console.log('✅ Page refresh detected via session flag absence (fresh sessionStorage)');
            IS_PAGE_REFRESH = true;
            sessionStorage.setItem("isPageRefresh", "true");
            return true;
        }

        // Method 5: Check if document.referrer is same as current URL (F5 refresh)
        if (document.referrer === window.location.href) {
            console.log('✅ Page refresh detected via document.referrer');
            IS_PAGE_REFRESH = true;
            sessionStorage.setItem("isPageRefresh", "true");
            return true;
        }

        // Method 6: For safety, if we have a token and are within 3 seconds of page load, assume refresh
        if (hasToken && timeSincePageLoad < 3000) {
            console.log('✅ Page refresh assumed - token exists and within 3 seconds of load');
            IS_PAGE_REFRESH = true;
            sessionStorage.setItem("isPageRefresh", "true");
            return true;
        }

        console.log('❌ Not detected as page refresh');
        return false;
    } catch (error) {
        console.error('Error detecting page refresh:', error);
        // If detection fails and we have a token, assume it's a refresh to be safe
        const hasToken = localStorage.getItem("token");
        if (hasToken) {
            console.log('✅ Page refresh assumed due to detection error + token exists');
            IS_PAGE_REFRESH = true;
            sessionStorage.setItem("isPageRefresh", "true");
            return true;
        }
        return false;
    }
};

export const handlePageRefresh = () => {
    // On page refresh, preserve session but mark as active
    if (isPageRefresh()) {
        console.log('Page refresh detected - preserving session');
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const tokenData = JSON.parse(token);
                const currentTime = new Date().getTime();
                const loginTime = tokenData.loginTime || currentTime;
                
                // On page refresh, be more lenient with session validation
                // Check if the session is not older than 10 minutes (double the normal timeout)
                const timeSinceLogin = currentTime - loginTime;
                const extendedTimeout = SESSION_TIMEOUT * 2; // 10 minutes for page refresh
                
                if (timeSinceLogin < extendedTimeout) {
                    console.log('Page refresh - session preserved (within extended timeout)');
                    // Update activity time to current time to reset the countdown
                    updateLastActivityTime();
                    sessionStorage.setItem("adminActive", "true");
                    sessionStorage.setItem("sessionActiveFlag", "true");
                    return true;
                } else {
                    console.log('Page refresh - session too old, requiring re-login');
                    return false;
                }
            } catch (error) {
                console.error('Page refresh - token parsing error:', error);
                return false;
            }
        }
    }
    return false;
};

export const isSessionValid = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.log('❌ No token found - session invalid');
        return false;
    }

    // PRIORITY 1: Check for page refresh - ALWAYS VALID if refresh detected
    const refreshFlag = sessionStorage.getItem("isPageRefresh");
    if (refreshFlag === "true" || IS_PAGE_REFRESH || isPageRefresh()) {
        console.log('🔄 BALANCED DEBUG MODE: Page refresh detected - session ALWAYS valid (highest priority)');
        return true;
    }

    // BALANCED DEBUG MODE - be lenient but still do some validation
    if (BALANCED_DEBUG_MODE) {
        // Very generous timeout (4 hours) for non-refresh scenarios
        try {
            const tokenData = JSON.parse(token);
            const currentTime = new Date().getTime();
            const loginTime = tokenData.loginTime || currentTime;
            const timeSinceLogin = currentTime - loginTime;
            const generousTimeout = 4 * 60 * 60 * 1000; // 4 hours
            
            if (timeSinceLogin < generousTimeout) {
                console.log('✅ BALANCED DEBUG MODE: Within 4-hour session window - valid');
                return true;
            } else {
                console.log('❌ BALANCED DEBUG MODE: Session older than 4 hours - invalid');
                return false;
            }
        } catch (error) {
            console.log('✅ BALANCED DEBUG MODE: Token parsing error - defaulting to valid');
            return true;
        }
    }

    // This code will never run in BALANCED_DEBUG_MODE
    console.log('Normal session validation (this should not run in debug mode)');
    return true;
};

export const isSessionValidForRefresh = () => {
    // BALANCED DEBUG MODE - always valid for refresh if token exists
    const token = localStorage.getItem("token");
    if (!token) {
        console.log('No token - refresh not valid');
        return false;
    }
    
    if (BALANCED_DEBUG_MODE) {
        console.log('BALANCED DEBUG MODE: Refresh always valid if token exists');
        return true;
    }
    
    // This code will never run in BALANCED_DEBUG_MODE
    return true;
};

export const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("lastActivityTime");
    sessionStorage.removeItem("adminActive");
    sessionStorage.removeItem("sessionActiveFlag");
    sessionStorage.removeItem("isPageRefresh");
    console.log('Session cleared completely');
};

// Clear session when browser is actually closed (not refreshed)
export const setupBrowserCloseCleanup = () => {
    // Use beforeunload to mark that browser is closing
    window.addEventListener('beforeunload', () => {
        if (!isPageRefresh()) {
            // Set a flag that browser is closing
            sessionStorage.setItem('browserClosing', 'true');
        }
    });
    
    // Use unload to actually clear session if browser was closing
    window.addEventListener('unload', () => {
        const wasClosing = sessionStorage.getItem('browserClosing');
        if (wasClosing === 'true' && !isPageRefresh()) {
            clearSession();
        }
    });
};

// Initialize session on page load
export const initializeSession = () => {
    const token = localStorage.getItem("token");
    if (token) {
        console.log('🚀 INITIALIZING SESSION on page load');
        
        // IMMEDIATELY mark as page refresh to protect session
        console.log('🔄 Proactively marking as page refresh for protection');
        sessionStorage.setItem("isPageRefresh", "true");
        IS_PAGE_REFRESH = true;
        
        // Set session flags
        sessionStorage.setItem("sessionActiveFlag", "true");
        sessionStorage.setItem("adminActive", "true");
        
        // Update activity time
        updateLastActivityTime();
        
        // Handle page refresh detection
        if (isPageRefresh()) {
            console.log('🔄 Page refresh detected during session initialization');
        }
        
        console.log('✅ Session initialized successfully with refresh protection');
        return true;
    }
    
    console.log('❌ No token found during session initialization');
    return false;
};

export const getSessionTimeRemaining = () => {
    const token = localStorage.getItem("token");
    if (!token) return 0;

    try {
        const tokenData = JSON.parse(token);
        const currentTime = new Date().getTime();
        const lastActivityTime = getLastActivityTime() || tokenData.loginTime || currentTime;
        const timeElapsed = currentTime - lastActivityTime;
        
        return Math.max(0, SESSION_TIMEOUT - timeElapsed);
    } catch (error) {
        return 0;
    }
};

export const updateLastActivityTime = () => {
    const currentTime = new Date().getTime();
    localStorage.setItem("lastActivityTime", currentTime.toString());
    return currentTime;
};

export const getLastActivityTime = () => {
    const lastActivity = localStorage.getItem("lastActivityTime");
    return lastActivity ? parseInt(lastActivity) : null;
};

export const markAdminActive = () => {
    // Use sessionStorage to detect if admin panel is active
    // sessionStorage is cleared when browser/tab is closed
    sessionStorage.setItem("adminActive", "true");
    
    // Update last activity time in localStorage (persists across tabs and refreshes)
    updateLastActivityTime();
    
    // Mark that this is an active session (not a page refresh)
    sessionStorage.setItem("sessionActiveFlag", "true");
    
    // Reset page load time to extend grace period
    PAGE_LOAD_TIME = Date.now();
    console.log('Admin marked as active - grace period reset');
};

export const isAdminActive = () => {
    return sessionStorage.getItem("adminActive") === "true";
};

export const getSessionInfo = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const tokenData = JSON.parse(token);
        const currentTime = new Date().getTime();
        const loginTime = tokenData.loginTime || currentTime;
        const lastActivityTime = getLastActivityTime() || loginTime;
        
        return {
            loginTime: new Date(loginTime),
            lastActivityTime: new Date(lastActivityTime),
            timeRemaining: getSessionTimeRemaining(),
            isValid: isSessionValid(),
            isActive: isAdminActive(),
            isPageRefresh: isPageRefresh()
        };
    } catch (error) {
        return null;
    }
};
