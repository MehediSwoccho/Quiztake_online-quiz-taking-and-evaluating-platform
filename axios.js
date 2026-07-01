import axios from "axios"

// Create axios instance with configuration
export const axiosInstance = axios.create({
    baseURL:"http://localhost:5001/api",
    withCredentials:true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 15000 // 15 second timeout
})

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
    config => {
        console.log(`Request: ${config.method.toUpperCase()} ${config.url}`, {
            headers: config.headers,
            data: config.data
        });
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    response => {
        console.log(`Response: ${response.status} ${response.config.url}`, {
            data: response.data
        });
        return response;
    },
    async error => {
        const originalRequest = error.config;
        
        console.error('Response error:', {
            url: originalRequest?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        // Don't retry if we've already retried or it's a 401/403 error
        if (originalRequest._retry || 
            (error.response && (error.response.status === 401 || error.response.status === 403))) {
            return Promise.reject(error);
        }
        
        // If the error is a network error or a timeout, retry once
        if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
            console.log('Network error or timeout, retrying request...');
            originalRequest._retry = true;
            return new Promise(resolve => setTimeout(() => resolve(axiosInstance(originalRequest)), 2000));
        }
        
        return Promise.reject(error);
    }
)