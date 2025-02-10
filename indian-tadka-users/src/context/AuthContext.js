import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { base_url } from "../utils/apiUrl";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there is a valid access token in cookies/localStorage
    const accessToken = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("access_token="));

    if (accessToken) {
      const userData = JSON.parse(localStorage.getItem("user")); // Get stored user data
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${base_url}/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.statusCode === 200) {
        setUser(response.data.data.user);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const logout = () => {
    document.cookie = "access_token=; path=/; max-age=0";
    document.cookie = "refresh_token=; path=/; max-age=0";
    localStorage.removeItem("user");
    setUser(null);
  };

  const refreshToken = async () => {
    const refreshToken = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("refresh_token="));

    if (refreshToken) {
      try {
        const response = await axios.post(`${base_url}/refresh-token`, null, {
          withCredentials: true,
        });
        const { access_token } = response.data.data;
        document.cookie = `access_token=${access_token}; path=/; secure; HttpOnly`;
      } catch (err) {
        console.error("Failed to refresh token:", err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
