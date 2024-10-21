import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:8000', // Usa una variable de entorno o un valor predeterminado
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
