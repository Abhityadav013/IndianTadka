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
      const cookies = document.cookie; // This will get the cookies stored in the document (client-side)

    console.log('Cookies from document.cookie >>>>>>', cookies);

      // The API response has no tokens in the body, so tokens are in the cookies
      // Retrieve the access_token and refresh_token from the cookies
      const accessToken = cookies
        .split(";")
        .find((cookie) => cookie.trim().startsWith("access_token="))
        ?.split("=")[1];

      const refreshToken = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("refresh_token="))
        ?.split("=")[1];

      console.log("accessToken>>>>>>", accessToken);

      console.log("refreshToken>>>>>>", refreshToken);

      // Check if the tokens are retrieved from the cookies
      if (accessToken && refreshToken) {
        // Optionally store tokens and user data in localStorage or state if needed
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user info in localStorage (for now)
        setUser(response.data.user); // Update the user state in your app

        console.log("Tokens from cookies:", { accessToken, refreshToken });
      } else {
        console.error("Tokens not found in cookies");
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
