import axios from "axios";
import { base_url } from "./apiUrl";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: base_url,
  withCredentials: true, // Ensure cookies are sent with requests (though we no longer rely on cookies)
});

// Global variable to keep track of refresh status
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });

  failedQueue = [];
};

// Add token to request headers
api.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("access_token"); // Get token from cookies, not localStorage
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
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

    // If token is expired (401 error)
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If refresh token is already being requested, wait for the response
      if (isRefreshing) {
        // Add to the failed queue to retry the original request after token refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }

      isRefreshing = true;

      // Retrieve refresh token from localStorage (make sure it's set)

      const refreshToken = Cookies.get("refresh_token");
      if (!refreshToken) {
        // Handle logout or redirect to login
        // Here you should redirect the user to login if no refresh token exists
        return Promise.reject(error);
      }

      try {
        // Call refresh-token endpoint to get a new access token
        await api.post(`${base_url}/refresh-token`);

        // Now you should retrieve the access token from the response or cookies
        const access_token = Cookies.get("access_token"); // Get new token from cookies

        // if (access_token) {
        //   localStorage.setItem("access_token", access_token); // Optional: Store new access token in localStorage
        // }

        // Retry the original request with the new access token
        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;

        // Process the queue of failed requests
        processQueue(null, access_token);

        // Make the original request again with the new token
        return api(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", err);

        // Process the queue of failed requests with the error
        processQueue(err, null);

        // If refresh fails, we need to handle logout or redirection to login
        // Here you could redirect the user to the login page
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
