import React from "react";
import "./ExploreMenu.css";
import { useState, useEffect} from "react";
import axios from "axios";
const ExploreMenu = ({ category, setCategory }) => {
  const [menu_list, setMenuList] = useState([]);

  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzkzYWUyMmRhZmMyZTBjOTZmOTAyNzMiLCJpYXQiOjE3Mzg2OTQ3MjksImV4cCI6MTczODcwOTEyOX0.6JKJI98Q8pAQ-xsEWdDcA5pJwNZ6wfs6lNscJu9-Vvk";
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_BASE_URL_MENU+'/category', {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`, // Add token to the Authorization header
          },}); // Replace with your API URL
          const filteredItems = response.data.filter((cat) => cat.isDelivery === true);
          const transformedMenuList = filteredItems.map((cat) => ({
            menu_name: cat.categoryName,
            menu_image: cat.imageUrl, // Ensure your API provides this field
          }));
  
          setMenuList(transformedMenuList);
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };

    fetchFoodItems();
  }, []);


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
