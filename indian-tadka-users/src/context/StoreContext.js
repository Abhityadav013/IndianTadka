import { createContext, useEffect, useState } from "react";
import { food_list } from "../utils/menu_list";
import { base_url, menu_url } from "../utils/apiUrl";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoding] = useState(true);

  const ACCESS_TOKEN_new = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzkzYWUyMmRhZmMyZTBjOTZmOTAyNzMiLCJpYXQiOjE3Mzg3NDg3OTAsImV4cCI6MTczODc2MzE5MH0.dYk6hRtOjUqnuCTk6APGM1YVeDb2CDhMzZTm8RP-a50";

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          setIsLoding(false);
          return;
        }
  
        const response = await axios.get(`${menu_url}/menu`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Add token to the Authorization header
          },}); // Replace with your API URL
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

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      fetchUser();
    } else {
      setIsLoding(false); // If no token, set loading to false and skip fetch
    }
  }, []);

  const fetchUser = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setIsLoding(false);
        return;
      }

      const response = await axios.get(`${base_url}/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Send token as Bearer
        },
      });
      setUserDetails(response.data.data.userDetails);
    } catch (err) {
      console.error("Error fetching user:", err);
      // Handle error (for example, token may have expired)
      setUserDetails(null);  // Optional: Set to null if there's an error
    } finally {
      setIsLoding(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${base_url}/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.statusCode === 200) {
        localStorage.setItem("access_token", response.data.data.access_token);
        localStorage.setItem("refresh_token", response.data.data.refresh_token);
        fetchUser(); // Fetch user after successful login
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const logoutUser = async () => {
    try {
      const response = await axios.post(`${base_url}/logout`, {
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
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    login,
    userDetails,
    logoutUser,
    isLoading,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
