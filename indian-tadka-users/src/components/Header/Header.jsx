import React from "react";
import "./Header.css";
const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>Orders your favourite food here</h2>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes
          crafted with the finest indegredients and culinary expertise. Our
          mission is to statsify you carving and elevate your dinning
          experince,one delcious meal at a time
          {/* Bringing the Soul of India to Your Plate – Taste the Tradition, Relish
          the Spice! */}
        </p>
        <a href="#explore-menu">
          <button>View Menu</button>
        </a>
      </div>
    </div>
  );
};

export default Header;
