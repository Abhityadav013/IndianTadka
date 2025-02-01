import React, { useState } from "react";
import "./Navbar.css";
import { SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import AuthForm from "../Auth/AuthForm";
import { Link } from "react-router-dom";
const NavBar = () => {
  const [menu, setMenu] = useState("home");
  const [isModalOpen, setModalOpen] = useState(false);

  const showModal = () => {
    setModalOpen(true); // Show modal
  };

  const handleCancel = () => {
    setModalOpen(false); // Hide modal
  };

  const handleOk = () => {
    setModalOpen(false); // Hide modal on OK click
  };
  return (
    <div className="navbar">
      <img src={`${process.env.PUBLIC_URL}/logo.png`} className="logo" alt="" />
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
        <SearchOutlined />
        <div className="navbar-search-icon">
          <ShoppingCartOutlined />
          <div className="dot"></div>
        </div>
        <button onClick={showModal}> Sign In</button>
      </div>
      <AuthForm visible={isModalOpen} onCancel={handleCancel} onOk={handleOk} />
    </div>
  );
};

export default NavBar;
