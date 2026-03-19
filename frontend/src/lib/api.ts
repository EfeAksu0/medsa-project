import axios from 'axios';

// Auto-switch based on environment
export const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://medysa-api.vercel.app/api'
    : 'http://localhost:4000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only clear token if backend explicitly says token is missing/invalid
        // Do NOT clear on every 401 — that causes cascade auth failures
        if (error.response?.status === 401) {
            const errorMsg = error.response?.data?.error || '';
            // Only wipe token if it's truly invalid (not just a permission/tier issue)
            if (errorMsg.includes('Invalid token') || errorMsg.includes('Malformed token')) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                }
            }
        }
        return Promise.reject(error);
    }
);

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await api.post('/upload/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data.url;
};

export default api;
