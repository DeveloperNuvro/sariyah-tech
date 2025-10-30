import axios from 'axios';
//https://whale-app-upwat.ondigitalocean.app/api

// Create an Axios instance
const api = axios.create({
  baseURL: 'https://whale-app-upwat.ondigitalocean.app/api',
  // Do NOT set a global Content-Type; let axios set it per request
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);

export default api;