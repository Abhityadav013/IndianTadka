import axios from 'axios';
import { base_url } from './apiUrl';

const api = axios.create({
  baseURL: base_url,
  withCredentials: true,  // Ensure cookies are sent with requests (though we no longer rely on cookies)
});

// Add token to request headers
api.interceptors.request.use(
  (config) => {
    // Log for debugging purposes
    console.log('localStorage>>>>>')

    // Retrieve access token from localStorage
    const accessToken = localStorage.getItem("access_token");
    console.log('Access Token>>>>>', accessToken);

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
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
    console.log('Error response:', error?.response);

    // If token is expired (401 error)
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Retrieve refresh token from localStorage
      const refreshToken = localStorage.getItem("refresh_token");
      console.log('Refresh Token>>>>>', refreshToken);

      if (!refreshToken) {
        // Handle logout or redirect to login
        return Promise.reject(error);
      }

      try {
        // Call refresh-token endpoint to get a new access token
        const refreshResponse = await api.post('/refresh-token', { refresh_token: refreshToken });

        // Assuming the new access token is returned as `newAccessToken`
        const { newAccessToken } = refreshResponse.data;
        
        // Store the new access token in localStorage
        localStorage.setItem("access_token", newAccessToken);

        // Retry the original request with the new access token
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
