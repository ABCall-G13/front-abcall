import axios from 'axios';

const axiosUserServiceInstance = axios.create({
    baseURL: process.env.REACT_APP_USER_SERVICE_URL || 'https://user-service-url.com/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosUserServiceInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosUserServiceInstance;