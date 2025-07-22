import React, {useEffect, useCallback} from "react";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Loader from "./components/Loader";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {HideLoading, ReloadData, SetPortfolioData, ShowLoading} from "./redux/rootSlice";
import Admin from "./pages/Admin";
import Login from "./pages/Admin/Login";
import ForgotPassword from "./pages/Admin/ForgotPassword";
import setupAxiosInterceptors from "./utils/axiosInterceptors";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider, useNotification } from "./contexts/NotificationContext";

function AppContent() {
    const {loading, portfolioData, reloadData} = useSelector((state) => state.root);
    const dispatch = useDispatch();
    const { error } = useNotification();

    // Setup axios interceptors on app initialization
    useEffect(() => {
        setupAxiosInterceptors();
    }, []);

    const getPortfolioData = useCallback(async () => {
        try {
            dispatch(ShowLoading());
            
            // Clear any browser cache/localStorage
            if (typeof(Storage) !== "undefined") {
                localStorage.removeItem('portfolioData');
                localStorage.removeItem('educationData');
            }
            
            // Add cache-busting timestamp to force fresh data
            const timestamp = new Date().getTime();
            const response = await axios.get(`/api/portfolio/get-portfolio-data?t=${timestamp}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            console.log('Frontend - Full API Response:', response.data);
            
            // Set new data directly
            dispatch(SetPortfolioData(response.data));
            dispatch(ReloadData(false));
            dispatch(HideLoading());
            
        } catch (err) {
            console.error('API Error:', err);
            dispatch(HideLoading());
            error("Backend server not available. Please start the backend server.");
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (!portfolioData) {
            getPortfolioData();
        }
    }, [portfolioData, getPortfolioData]);

    useEffect(() => {
        if (reloadData) {
            // Add a small delay to prevent multiple rapid refreshes
            const timeoutId = setTimeout(() => {
                getPortfolioData();
            }, 100);
            
            return () => clearTimeout(timeoutId);
        }
    }, [reloadData, getPortfolioData]);

    return (
        <BrowserRouter>
            {loading ? <Loader/> : null}
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/admin" element={<Admin/>}/>
                <Route path="/admin-login" element={<Login/>}/>
                <Route path="/admin-forgot-password" element={<ForgotPassword/>}/>
            </Routes>
        </BrowserRouter>
    );
}

function App() {
    return (
        <ThemeProvider>
            <NotificationProvider>
                <AppContent />
            </NotificationProvider>
        </ThemeProvider>
    );
}

export default App;