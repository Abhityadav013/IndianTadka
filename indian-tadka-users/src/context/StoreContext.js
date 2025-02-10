import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { base_url, menu_url } from "../utils/apiUrl";
import axios from "axios";
import api from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

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
  const [userLocation, setUserLocation] = useState(null);
  const [menu_list, setMenuList] = useState([]);
  const prevCartRef = useRef(true);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isuserLocationFetched, setIsLocationFetched] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [redirectPage, setRedirectPage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(`${menu_url}/menu`); // Replace with your API URL
        const filteredItems = response.data.filter(
          (item) => item.isDelivery === true
        );
        setFoodList(filteredItems);
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };

    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${menu_url}/category`); // Replace with your API URL

        const filteredItems = response.data
          .filter((cat) => cat.isDelivery === true)
          .map((cat) => ({
            menu_name: cat.categoryName,
            menu_image: cat.imageUrl, // Ensure your API provides this field
          }));

        setMenuList(filteredItems);
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };

    fetchFoodItems();
    fetchMenuItems();
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

  const handleLoginModal = () => {
    setLoginModalOpen((prevState) => !prevState); // Toggles the state
  };
  const handleRedirectPage = (redirectURL) => {
    setRedirectPage(redirectURL);
  };

  const handleCart = useCallback(async () => {
    try {
      const cartItemIds = Object.keys(cartItems);
      const shouldFetchCart = cartItemIds.length === 0; // If empty, just fetch

      // 🔹 Skip API call if cart hasn't changed
      if (JSON.stringify(cartItems) === JSON.stringify(prevCartRef.current)) {
        return;
      }

      // Prepare cart payload if updating
      const cart = shouldFetchCart
        ? undefined
        : food_list
            .filter((food) => cartItemIds.includes(food.id))
            .map((food) => ({
              itemId: food.id,
              itemName: food.itemName,
              quantity: cartItems[food.id],
            }));

      const response = await axios.post(
        `${base_url}/cart`,
        cart ? { cart } : {}, // Send cart data only if updating
        { withCredentials: true }
      );

      if (
        response.data.statusCode === 200 ||
        response.data.statusCode === 201
      ) {
        const isGuest = sessionStorage.getItem("tid") || false;

        if (isGuest) {
          const formattedCart = response.data.data.cart.cartItems.reduce(
            (acc, item) => {
              acc[item.itemId] = item.quantity;
              return acc;
            },
            {}
          );
          setCartItemCount(Object.keys(formattedCart).length);

          // 🔹 Only update state if it’s different
          if (JSON.stringify(cartItems) !== JSON.stringify(formattedCart)) {
            setCartItems(formattedCart);
          }

          // 🔹 Save last cart state
          prevCartRef.current = formattedCart;
        }
      }
    } catch (err) {
      console.error("Cart update failed:", err);
    }
  }, [cartItems, food_list]); // ✅ Keep cartItems dependency

  // 🔹 Run API only when cartItems change
  useEffect(() => {
    handleCart();
  }, [cartItems, handleCart]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get(`${base_url}/profile`, {
        withCredentials: true,
      });
      setUserDetails(response.data.data.userDetails);
      if (redirectPage) {
        navigate(redirectPage);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setUserDetails(null);
    } finally {
      setIsLoding(false);
    }
  }, [redirectPage, navigate]);

  useEffect(() => {
    if (userDetails && Object.keys(userDetails)?.length === 0) {
      fetchUser();
    }
    setIsLoding(false);
  }, [userDetails, fetchUser]); // Now fetchUser is stable and included

  // const getSession = useCallback(async () => {
  //   try {
  //     const response = await api.get(
  //       `${base_url}?lat=${userLocation.lat}&lng=${userLocation.lng}`,
  //       { withCredentials: true }
  //     );

  //     sessionStorage.setItem("tid", response.data.data.tid);
  //     localStorage.setItem(
  //       "indian_tadka_userLocation",
  //       JSON.stringify({
  //         lat: userLocation.lat,
  //         lng: userLocation.lng,
  //       })
  //     );
  //   } catch (err) {
  //     console.error("Login failed:", err);
  //   }
  // }, [userLocation]);

  const registerSession = async (lat, lng) => {
    try {
      const params = lat && lng ? { lat, lng } : {}; // Send only if available
      const response = await api.get(
        `${base_url}`,
        {},
        { params, withCredentials: true }
      );
      if (response.data.statusCode === 200) {
        setIsLocationFetched(true);
        sessionStorage.setItem("tid", response.data.data.tid);
        if (userLocation?.lat && userLocation?.lng) {
          localStorage.setItem(
            "indian_tadka_userLocation",
            JSON.stringify({
              lat: userLocation.lat,
              lng: userLocation.lng,
            })
          );
        }
      }
    } catch (error) {
      console.error("Session registration failed:", error);
    }
  };

  useEffect(() => {
    if (redirectPage && userDetails) {
      navigate(`${redirectPage}`);
    }
  }, [redirectPage,userDetails, navigate]);

  const login = async (email, password) => {
    try {
      const response = await api.post(
        `${base_url}/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.statusCode === 200) {
        fetchUser(); // Fetch user after successful login
        handleLoginModal();
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
        setUserDetails(null);
        setCartItems({})
        setCartItemCount(0)
        handleCart()
        handleRedirectPage('/')
        navigate('/');

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
    userLocation,
    setUserLocation,
    menu_list,
    cartItemCount,
    registerSession,
    isuserLocationFetched,
    isLoginModalOpen,
    handleLoginModal,
    handleRedirectPage,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
