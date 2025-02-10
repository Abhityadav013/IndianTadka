import React, { useContext, useEffect, useRef } from "react";
import NavBar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import Order from "./pages/Order/Order";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ExploreMenu from "./components/ExploreMenu/ExploreMenu";
import Footer from "./components/Footer/Footer";
import { StoreContext } from "./context/StoreContext";
import Cookies from "js-cookie"; // Importing cookies librar

const App = () => {
  const { isLoading, setUserLocation, registerSession } =
    useContext(StoreContext);

    const hasRegisteredSession = useRef(false);
    useEffect(() => {
      const location = Cookies.get("userLocation");
  
      if (!location) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const userLocation = JSON.stringify({ lat: latitude, lng: longitude });
  
              Cookies.set("userLocation", userLocation, { expires: 7 });
              setUserLocation({ lat: latitude, lng: longitude });
  
              if (!hasRegisteredSession.current && 
                  (sessionStorage.getItem("tid") === null || sessionStorage.getItem("tid") === undefined)) {
                registerSession(latitude, longitude);
                hasRegisteredSession.current = true; // Mark it as called
              }
            },
            (error) => {
              if (!hasRegisteredSession.current && 
                  (sessionStorage.getItem("tid") === null || sessionStorage.getItem("tid") === undefined)) {
                registerSession();
                hasRegisteredSession.current = true; // Mark it as called
              }
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      } else {
        setUserLocation(JSON.parse(location));
      }
    }, [setUserLocation, registerSession]);
  return (
    <>
      {!isLoading && (
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
          <div className="app">
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/menu" element={<ExploreMenu />}></Route>
              <Route path="/cart" element={<Cart />}></Route>
              <Route path="/order" element={<Order />}></Route>
            </Routes>
          </div>
          <Footer />
        </GoogleOAuthProvider>
      )}
    </>
  );
};

export default App;
