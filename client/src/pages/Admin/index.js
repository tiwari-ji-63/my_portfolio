import React, {useEffect, useCallback, useState} from 'react'
import {Tabs} from 'antd';
import AdminHeader from "./AdminHeader";
import AdminIntro from "./AdminIntro";
import AdminAbout from "./AdminAbout";
import {useSelector, useDispatch} from "react-redux";
import AdminExperiences from "./AdminExperiences";
import AdminProjects from "./AdminProjects";
import AdminSkills from "./AdminSkills";
import AdminEducation from "./AdminEducation";
import AdminCertificates from "./AdminCertificates";
import AdminLeftSider from "./AdminLeftSider";
import AdminContact from "./AdminContact";
import AdminFooter from "./AdminFooter";
import AdminSocialStats from "./AdminSocialStats";
import UserManagement from "./UserManagement";
import ContactMessages from "./ContactMessages";
import { SetPortfolioData, ShowLoading, HideLoading } from "../../redux/rootSlice";
import axios from "axios";
import { useNotification } from "../../contexts/NotificationContext";
import { setupBrowserCloseHandler } from "../../utils/sessionUtils";
import { useAutoLogout } from "../../hooks/useAutoLogout";
import SessionWarningModal from "../../components/SessionWarningModal";
import AdminRefreshButton from "../../components/AdminRefreshButton";
import SessionTimer from "../../components/SessionTimer";
import DataOverview from "../../components/DataOverview";
import "../../styles/admin.css";

const {TabPane} = Tabs;

function Admin() {
    const {portfolioData} = useSelector((state) => state.root);
    const dispatch = useDispatch();
    const { error, success } = useNotification();
    const [activeTab, setActiveTab] = useState("0"); // Set to Data Overview by default
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [lastRefreshTime, setLastRefreshTime] = useState(new Date());

    // Auto-logout functionality
    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        window.location.href = "/admin-login";
    }, []);

    const {
        showWarning,
        timeLeft,
        remainingTime,
        remainingSeconds,
        isActive,
        resetSession
    } = useAutoLogout(handleLogout);

    // Tab configuration with icons and descriptions
    const tabConfig = [
        { key: "0", title: "Data Overview", icon: "📊", description: "Complete portfolio analytics", component: <DataOverview /> },
        { key: "1", title: "Header", icon: "🏠", description: "Site header configuration", component: <AdminHeader /> },
        { key: "2", title: "Introduction", icon: "👋", description: "Personal introduction", component: <AdminIntro /> },
        { key: "3", title: "Social Stats", icon: "📊", description: "Social media statistics", component: <AdminSocialStats /> },
        { key: "4", title: "About", icon: "👤", description: "About section", component: <AdminAbout /> },
        { key: "5", title: "Skills", icon: "🛠️", description: "Technical skills", component: <AdminSkills /> },
        { key: "6", title: "Experiences", icon: "💼", description: "Work experience", component: <AdminExperiences /> },
        { key: "7", title: "Projects", icon: "🚀", description: "Portfolio projects", component: <AdminProjects /> },
        { key: "8", title: "Education", icon: "🎓", description: "Educational background", component: <AdminEducation /> },
        { key: "9", title: "Certificates", icon: "🏆", description: "Certifications", component: <AdminCertificates /> },
        { key: "10", title: "Social Links", icon: "🔗", description: "Social media links", component: <AdminLeftSider /> },
        { key: "11", title: "Contact", icon: "📧", description: "Contact information", component: <AdminContact /> },
        { key: "12", title: "Footer", icon: "📋", description: "Footer content", component: <AdminFooter /> },
        { key: "13", title: "Users", icon: "👥", description: "User management", component: <UserManagement /> },
        { key: "14", title: "Messages", icon: "💬", description: "Contact messages", component: <ContactMessages /> }
    ];

    const getPortfolioData = useCallback(async () => {
        try {
            dispatch(ShowLoading());
            
            // Add cache-busting timestamp to force fresh data
            const timestamp = new Date().getTime();
            const response = await axios.get(`/api/portfolio/get-portfolio-data?t=${timestamp}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            console.log('Admin Panel - Portfolio data refreshed:', response.data);
            
            // Set new data directly
            dispatch(SetPortfolioData(response.data));
            dispatch(HideLoading());
            
        } catch (err) {
            console.error('Admin Panel - API Error:', err);
            dispatch(HideLoading());
            error("Failed to refresh portfolio data. Please check if backend server is running.");
        }
    }, [dispatch, error]);

    // Enhanced refresh functionality with session extension
    const handleRefresh = useCallback(async () => {
        try {
            success("🔄 Refreshing admin data and extending session...");
            await getPortfolioData();
            resetSession(); // Reset the auto-logout timer
            setLastRefreshTime(new Date()); // Update last refresh time
            success("✅ Admin data refreshed successfully!");
        } catch (err) {
            error("❌ Failed to refresh admin data");
        }
    }, [getPortfolioData, resetSession, success, error]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        if (!token) {
            // No token, redirect to login
            console.log('Admin - No token found, redirecting to login');
            window.location.href = "/admin-login";
            return;
        }

        // Setup simple browser close handler
        setupBrowserCloseHandler();

        // Simple approach: Just refresh data on mount
        console.log('Admin - Component mounted, refreshing portfolio data');
        getPortfolioData();
        
    }, [getPortfolioData]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 admin-panel">
            {/* Modern Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-secondary to-tertiary rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">A</span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        Admin Dashboard
                                    </h1>
                                    <p className="text-gray-500 text-sm">Portfolio Management System</p>
                                </div>
                            </div>
                            <div className="hidden md:block w-px h-8 bg-gray-300"></div>
                            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span>System Online</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span>📊</span>
                                    <span>{tabConfig.length} Modules</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                {/* Beautiful Session Timer */}
                                <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200 rounded-xl px-4 py-2 shadow-lg">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                        showWarning ? 'bg-red-100' : isActive ? 'bg-green-100' : 'bg-gray-100'
                                    }`}>
                                        <span className={`text-sm ${
                                            showWarning ? 'text-red-600' : isActive ? 'text-green-600' : 'text-gray-600'
                                        }`}>
                                            {showWarning ? '⚠️' : isActive ? '🟢' : '⏸️'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-gray-500 font-medium">Session</span>
                                            <span className={`font-mono text-sm font-bold ${
                                                showWarning ? 'text-red-600' : 
                                                remainingSeconds <= 120 ? 'text-orange-600' : 'text-green-600'
                                            }`}>
                                                {Math.floor(remainingSeconds / 60).toString().padStart(2, '0')}:
                                                {(remainingSeconds % 60).toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                            <div 
                                                className={`h-1 rounded-full transition-all duration-1000 ${
                                                    showWarning ? 'bg-red-500' : 
                                                    remainingSeconds <= 120 ? 'bg-orange-500' : 'bg-green-500'
                                                }`}
                                                style={{ width: `${(remainingSeconds / 300) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${
                                        isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                                    }`} />
                                </div>

                                <AdminRefreshButton 
                                    onRefresh={handleRefresh}
                                    lastRefreshTime={lastRefreshTime}
                                    disabled={false}
                                />
                                
                                <button 
                                    className="bg-gradient-to-r from-secondary to-tertiary hover:from-secondary/90 hover:to-tertiary/90 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
                                    onClick={() => window.location.href = "/"}
                                >
                                    <span>🌐</span>
                                    <span>View Portfolio</span>
                                </button>
                                
                                <button 
                                    className="bg-white border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-600 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
                                    onClick={handleLogout}
                                >
                                    <span>🚪</span>
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {portfolioData && (
                <div className="container mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Enhanced Sidebar Navigation with Custom Scrollbar */}
                        <div className={`lg:col-span-1 ${sidebarCollapsed ? 'hidden lg:block' : 'block'}`}>
                            <div className="bg-white/70 backdrop-blur-2xl border border-gray-200 rounded-3xl p-6 sticky top-24 shadow-2xl admin-floating-scroll">
                                {/* Navigation Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                                            <span className="text-white text-sm">🧭</span>
                                        </div>
                                        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            Navigation
                                        </h3>
                                    </div>
                                    <button 
                                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                                    >
                                        ✕
                                    </button>
                                </div>
                                
                                {/* Navigation Items with Custom Scroll */}
                                <nav className="space-y-3 admin-nav-scroll">
                                    {tabConfig.map((tab, index) => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`w-full text-left p-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
                                                activeTab === tab.key
                                                    ? 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white shadow-2xl transform scale-105'
                                                    : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-700 hover:scale-102 hover:shadow-lg'
                                            }`}
                                            style={{
                                                animationDelay: `${index * 50}ms`
                                            }}
                                        >
                                            {/* Background Animation */}
                                            <div className={`absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 transform transition-all duration-700 ${
                                                activeTab === tab.key ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                                            }`}></div>
                                            
                                            {/* Content */}
                                            <div className="relative flex items-center space-x-4">
                                                <div className={`text-2xl transform transition-all duration-300 ${
                                                    activeTab === tab.key ? 'scale-110 rotate-12' : 'group-hover:scale-110'
                                                }`}>
                                                    {tab.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-lg">{tab.title}</div>
                                                    <div className={`text-sm transition-all duration-300 ${
                                                        activeTab === tab.key ? 'text-white/90' : 'text-gray-500 group-hover:text-gray-600'
                                                    }`}>
                                                        {tab.description}
                                                    </div>
                                                </div>
                                                
                                                {/* Active Indicator */}
                                                {activeTab === tab.key && (
                                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-lg"></div>
                                                )}
                                            </div>
                                            
                                            {/* Hover Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                        </button>
                                    ))}
                                </nav>
                                
                                {/* Navigation Footer */}
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="font-medium">Dashboard Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl overflow-hidden">
                                {/* Content Header */}
                                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 border-b border-gray-200">
                                    {(() => {
                                        const currentTab = tabConfig.find(tab => tab.key === activeTab);
                                        return (
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gradient-to-r from-secondary to-tertiary rounded-xl flex items-center justify-center">
                                                    <span className="text-white text-xl">{currentTab?.icon}</span>
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-primary">{currentTab?.title}</h2>
                                                    <p className="text-gray-600">{currentTab?.description}</p>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Content Body */}
                                <div className="p-6">
                                    <Tabs 
                                        activeKey={activeTab} 
                                        onChange={setActiveTab}
                                        tabBarStyle={{ display: 'none' }}
                                    >
                                        <TabPane tab="Data Overview" key="0">
                                            <DataOverview/>
                                        </TabPane>
                                        <TabPane tab="Header" key="1">
                                            <AdminHeader/>
                                        </TabPane>
                                        <TabPane tab="Introduction" key="2">
                                            <AdminIntro/>
                                        </TabPane>
                                        <TabPane tab="Social Stats" key="3">
                                            <AdminSocialStats/>
                                        </TabPane>
                                        <TabPane tab="About" key="4">
                                            <AdminAbout/>
                                        </TabPane>
                                        <TabPane tab="Skills" key="5">
                                            <AdminSkills/>
                                        </TabPane>
                                        <TabPane tab="Experiences" key="6">
                                            <AdminExperiences/>
                                        </TabPane>
                                        <TabPane tab="Projects" key="7">
                                            <AdminProjects/>
                                        </TabPane>
                                        <TabPane tab="Education" key="8">
                                            <AdminEducation/>
                                        </TabPane>
                                        <TabPane tab="Certificates" key="9">
                                            <AdminCertificates/>
                                        </TabPane>
                                        <TabPane tab="Social Links" key="10">
                                            <AdminLeftSider/>
                                        </TabPane>
                                        <TabPane tab="Contact" key="11">
                                            <AdminContact/>
                                        </TabPane>
                                        <TabPane tab="Footer" key="12">
                                            <AdminFooter/>
                                        </TabPane>
                                        <TabPane tab="Users" key="13">
                                            <UserManagement/>
                                        </TabPane>
                                        <TabPane tab="Messages" key="14">
                                            <ContactMessages/>
                                        </TabPane>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Navigation Toggle */}
            <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-secondary to-tertiary text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform duration-300"
            >
                <span className="text-xl">☰</span>
            </button>

            {/* Session Warning Modal */}
            <SessionWarningModal
                visible={showWarning}
                timeLeft={timeLeft}
                onExtendSession={resetSession}
                onLogout={handleLogout}
                onClose={() => resetSession()} // Extending session also closes modal
            />
        </div>
    );
}

export default Admin