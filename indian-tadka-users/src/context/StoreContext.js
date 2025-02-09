import { createContext, useEffect, useState } from "react";
import { base_url, menu_url } from "../utils/apiUrl";
import axios from "axios";
import api from "../utils/axiosInstance";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoding] = useState(true);
  const [isAccountVerified, setAccountVerified] = useState(false);
  const [otpExpiresAt, setOTPExpiredAt] = useState(0);
  const [isOtpSent, setOtpSent] = useState(false);
  const [isOtpModalOpen, setIsOtpModelOpen] = useState(false);


  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(`${menu_url}/menu`); // Replace with your API URL
          const filteredItems = response.data.filter((item) => item.isDelivery === true);
        setFoodList(filteredItems);
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };

    fetchFoodItems();
  }, []);

  const addToCart = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const getTotalCartAmount = (deliveryFee = 0) => {
    const totalAmount = Object.entries(cartItems).reduce(
      (sum, [item, quantity]) => {
        if (quantity > 0) {
          const itemInfo = food_list.find((product) => product.id === item); // Handle type mismatch
          return itemInfo ? sum + itemInfo.price * quantity : sum;
        }
        return sum;
      },
      0
    );

    return totalAmount > 0 ? totalAmount + deliveryFee : 0;
  };

  const handleOtpModal = () => {
    setIsOtpModelOpen((prevState) => !prevState); // Toggles the state
  };

  const fetchUser = async () => {
    try {
      const response = await api.get(`${base_url}/profile`, { withCredentials: true });
      setUserDetails(response.data.data.userDetails);
    } catch (err) {
      console.error("Error fetching user:", err);
      setUserDetails(null);
    } finally {
      setIsLoding(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post(
        `${base_url}/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.statusCode === 200) {
        fetchUser(); // Fetch user after successful login
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post(
        `${base_url}/register`,
        { ...userData },
        { withCredentials: true }
      );
      console.log("register_token", document.cookie);
      if (response.data.statusCode === 200) {
        fetchUser(); // Fetch user after successful login
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const logoutUser = async () => {
    try {
      const response = await api.post(`${base_url}/logout`, {
        withCredentials: true,
      });
      if (response.data.statusCode === 200) {
        console.log("Successfully logged out");
        setUserDetails(null); // Clear user state on frontend
        localStorage.removeItem("access_token"); // Remove access token
        localStorage.removeItem("refresh_token"); // Remove refresh token
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const sendOTP = async () => {
    const response = await api.post(`${base_url}/send-verify-otp`);
    if (response.data.statusCode === 200) {
      handleOtpModal();
      setOTPExpiredAt(response.data.data.otpExpiresAt);
      setOtpSent(true);
    }
  };

  const resendOTP = async () => {
    const response = await api.post(`${base_url}/send-verify-otp`);
    if (response.data.statusCode === 200) {
      setOTPExpiredAt(response.data.data.otpExpiresAt);
      setOtpSent(true);
    }
  };

  const verifyOTP = async (otp) => {
    const response = await api.post(`${base_url}/verify-account`, { otp: otp });
    if (response.data.statusCode === 200) {
      handleOtpModal();
      setAccountVerified(response.data.data.isAccountVerified);
    }
  };
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    login,
    register,
    userDetails,
    logoutUser,
    isLoading,
    sendOTP,
    isOtpSent,
    isAccountVerified,
    otpExpiresAt,
    verifyOTP,
    handleOtpModal,
    isOtpModalOpen,
    resendOTP,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
