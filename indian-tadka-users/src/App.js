import React from "react";
import NavBar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import Order from "./pages/Order/Order";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ExploreMenu from "./components/ExploreMenu/ExploreMenu";
import Footer from "./components/Footer/Footer";

const App = () => {
  const googleClientId =
    "534846475345-c8ujfd7kormp4abkev4skgkl8s9urh3g.apps.googleusercontent.com";
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
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
  );
};

export default App;
