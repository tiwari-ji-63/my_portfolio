// Simple session management - only handle basic token validation and page refresh protection

let isPageRefreshFlag = false;

// Check if this is a page refresh
export const isPageRefresh = () => {
    // Use performance API to detect page refresh
    try {
        const perfEntries = performance.getEntriesByType("navigation");
        if (perfEntries.length > 0 && perfEntries[0].type === "reload") {
            isPageRefreshFlag = true;
            return true;
        }
        
        // Legacy browser support
        if (performance.navigation && performance.navigation.type === 1) {
            isPageRefreshFlag = true;
            return true;
        }
        
        return isPageRefreshFlag;
    } catch (error) {
        return false;
    }
};

// Simple session validation - only check token exists
export const isSessionValid = () => {
    const token = localStorage.getItem("token");
    return !!token; // Return true if token exists, false otherwise
};

// Clear session data
export const clearSession = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
};

// Handle browser close - clear session only if NOT a page refresh
export const setupBrowserCloseHandler = () => {
    window.addEventListener('beforeunload', () => {
        // Only clear session if this is NOT a page refresh
        if (!isPageRefresh()) {
            clearSession();
        }
    });
};
