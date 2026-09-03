import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vibecheck-backend-yg08.onrender.com/api',
});

// Intercept requests to add the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      // Let the app handle redirecting, usually the Context picks this up
    }
    return Promise.reject(error);
  }
);

export default api;
