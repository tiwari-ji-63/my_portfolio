import axios from 'axios';
import { message } from 'antd';

// Simple axios interceptor - only handle 401 responses
const setupAxiosInterceptors = () => {
    // Response interceptor to handle 401 errors
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            // Handle 401 Unauthorized responses
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("token");
                message.error('Session expired. Please login again.');
                window.location.href = "/admin-login";
            }
            return Promise.reject(error);
        }
    );
};

export default setupAxiosInterceptors;
