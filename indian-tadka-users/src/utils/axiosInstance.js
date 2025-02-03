import axios from 'axios';
import { base_url } from './apiUrl';

const api = axios.create({
  baseURL: base_url,
  withCredentials: true,  // Ensure cookies are sent with requests
});

// Add token to request headers
api.interceptors.request.use(
  (config) => {
    console.log('cookies>>>>>')
    //Cookies.set("access_token", "asdasdasd")
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1];
      console.log('token>>>>>',token)

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Retry on token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('refresh_token='))
        ?.split('=')[1];
        console.log('document.cookie....',document.cookie,refreshToken)

      if (!refreshToken) {
        // Handle logout or redirect to login
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await api.post('/refresh-token');
        const { newAccessToken } = refreshResponse.data;
        document.cookie = `access_token=${newAccessToken}; path=/`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error('Token refresh failed:', err);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
