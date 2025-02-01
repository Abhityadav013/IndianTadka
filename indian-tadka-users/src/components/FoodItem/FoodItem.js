import React, { useContext } from "react";
import "./FoodItem.css";
import { StoreContext } from "../../context/StoreContext";
const FoodItem = ({ item }) => {

  const { addToCart, removeFromCart, cartItems } =
    useContext(StoreContext);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={item.image} alt="" />
        {!cartItems[item.id] ? (
          <img
            className="add"
            onClick={() => addToCart(item.id)}
            src='https://testing.indiantadka.eu/assets/add_icon_white'
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(item.id)}
              src='https://testing.indiantadka.eu/assets/remove_icon_red'
              alt=""
            />
            <p>{cartItems[item.id]}</p>
            <img
              onClick={() => addToCart(item.id)}
              src='https://testing.indiantadka.eu/assets/add_icon_green'
              alt=""
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{item.name}</p>
          <img src='https://testing.indiantadka.eu/assets/rating_starts' alt=""></img>
        </div>
        <p className="food-item-description">{item.description}</p>
        <p className="food-item-price">€ {item.price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
