import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const user = sessionStorage.getItem('wasteguide_user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      if (parsed && parsed.uid) {
        config.headers['x-user-id'] = parsed.uid;
      }
    } catch (e) {
      console.error("Failed to parse user session", e);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
