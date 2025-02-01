import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../utils/menu_list";
const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore Our Menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes
        crafted with the finest indegredients and culinary expertise. Our
        mission is to statsify you carving and elevate your dinning
        experince,one delcious meal at a time
        {/* Bringing the Soul of India to Your Plate – Taste the Tradition, Relish
          the Spice! */}
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              key={index}
              className="explore-menu-list-item"
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
            >
              <img className={category === item.menu_name ? "active":""} src={item.menu_image} alt="" />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
