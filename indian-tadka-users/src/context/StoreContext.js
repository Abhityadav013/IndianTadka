import { createContext, useEffect, useState } from "react";
import { food_list } from "../utils/menu_list";
import { base_url } from "../utils/apiUrl";
import axios from "axios";
import api from "../utils/axiosInstance";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [isLoading,setIsLoding] = useState(true);

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
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get(`${base_url}/profile`, {
        withCredentials: true,
      });
      setUserDetails(response.data.data.userDetails);
    } catch (err) {
      console.error("Error fetching user:", err);
    }finally{
      setIsLoding(false)
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
        fetchUser();
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
      if (response.status === 200) {
        console.log("Successfully logged out");
        setUserDetails(null);  // Clear user state on the frontend
        //window.location.href = '/';
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
    isLoading
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
