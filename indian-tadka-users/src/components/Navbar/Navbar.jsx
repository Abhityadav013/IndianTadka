import React, { useContext, useState } from "react";
import "./Navbar.css";
import AuthForm from "../Auth/AuthForm";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import UserProfileMenu from "../User/UserProfile";
import OTPComponent from "../OtpComponent/OTPComponent";
import Modal from "../Modal/Modal";

const NavBar = () => {
  const {
    getTotalCartAmount,
    userDetails,
    logoutUser,
    isLoading,
    isOtpModalOpen,
    handleOtpModal,
    cartItemCount,
    isLoginModalOpen,
    handleLoginModal,
    handleRedirectPage
  } = useContext(StoreContext);
  const [menu, setMenu] = useState("home");

  const handleCart = async()=>{
    setMenu("cart")
    handleRedirectPage('/cart')
  }

  return (
    <div className="navbar">
      <Link to="/" onClick={() => setMenu("home")}>
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          className="logo"
          alt=""
        />
      </Link>

      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu("contact")}
          className={menu === "contact" ? "active" : ""}
        >
          Contact Us
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("blog")}
          className={menu === "blog" ? "active" : ""}
        >
          Blog
        </a>
      </ul>
      <div className="navbar-right">
        <img
          src="https://testing.indiantadka.eu/assets/search_icon.png"
          alt=""
        />
        <div className="navbar-search-icon">
          <Link to="/cart" onClick={() => handleCart()}>
            {" "}
            <img
              src="https://testing.indiantadka.eu/assets/basket_icon.png"
              alt=""
            />
          </Link>
          {cartItemCount > 0 && (
            <div
              className={`cart-count ${
                getTotalCartAmount() === 0 ? "hiddsen" : ""
              }`}
            >
              {cartItemCount}
            </div>
          )}
        </div>
        {!isLoading && // Only render after loading is complete
          (userDetails && userDetails.name ? (
            <UserProfileMenu userData={userDetails} logoutUser={logoutUser} />
          ) : (
            <button onClick={handleLoginModal}>Sign In</button> // ✅ Show "Sign In" if no user
          ))}
      </div>
      <AuthForm visible={isLoginModalOpen} onCancel={handleLoginModal} onOk={handleLoginModal} />
      {isOtpModalOpen && (
        <Modal size="small" onClose={handleOtpModal}>
          <OTPComponent />
        </Modal>
      )}
    </div>
  );
};

export default NavBar;
