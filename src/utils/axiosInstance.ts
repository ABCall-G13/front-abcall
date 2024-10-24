import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL || 'https://front-abcall-345518488840.us-central1.run.app/v1', // Usa una variable de entorno o un valor predeterminado
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
