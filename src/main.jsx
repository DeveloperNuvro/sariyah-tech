import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Make sure the path is correct
import './index.css'; // Your global styles
import { Provider } from 'react-redux';
import { store } from './app/store.js';

import api from './services/api.js';
import { setToken, logoutUser, loadUser } from './features/auth/authSlice.js';
import { Analytics } from "@vercel/analytics/react"

// --- Interceptor Setup (from previous fix) ---
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (originalRequest.url === '/users/refresh-token') {
        store.dispatch(logoutUser());
        return Promise.reject(error);
      }
      try {
        const { data } = await api.get('/users/refresh-token');
        store.dispatch(setToken(data.accessToken));
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logoutUser());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
// --- End of Interceptor Setup ---

// --- NEW: Application Initialization Logic ---
// Check for a token in localStorage and dispatch loadUser
// This happens right after the store is created and before the app renders.
if (localStorage.getItem('token')) {
  store.dispatch(loadUser());
}
// --- End of Initialization Logic ---

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Analytics />
      <App />
    </Provider>
  </React.StrictMode>
);