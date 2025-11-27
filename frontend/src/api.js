import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000', // Adjust if backend runs on different port
});

export const getStatus = () => api.get('/status');
export const addTarget = (target) => api.post('/add', { target });
export const removeTarget = (target) => api.post('/remove', { target });
export const startMonitoring = () => api.post('/start');
export const stopMonitoring = () => api.post('/stop');
export const updateSettings = (interval) => api.post('/settings', { interval });

export default api;
