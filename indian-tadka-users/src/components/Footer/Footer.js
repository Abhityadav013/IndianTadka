import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={`${process.env.PUBLIC_URL}/logo.png`} alt=""/>
            <p>Exercitation nisi officia laboris occaecat in aliqua.</p>
            <div className="footer-social-icons">
                <img src='https://testing.indiantadka.eu/assets/facebook_icon.png' alt="" />
                <img src='https://testing.indiantadka.eu/assets/twitter_icon.png' alt="" />
                <img src='https://testing.indiantadka.eu/assets/linkedin_icon.png' alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>Company</h2>
            <ul>
               <li>Home</li>
               <li>About Us</li>
               <li>Delivery</li>
               <li>Privacy Policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOuch</h2>
            <ul>
                <li>+371-264-164-8</li>
                <li>contact@indiantadka.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 © IndianTadka.com - All Right Reserved</p>
    </div>
  );
};

export default Footer;
