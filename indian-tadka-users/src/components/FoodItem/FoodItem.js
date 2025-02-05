import React, { useContext } from "react";
import "./FoodItem.css";
import { StoreContext } from "../../context/StoreContext";
const FoodItem = ({ item }) => {

  const { addToCart, removeFromCart, cartItems } =
    useContext(StoreContext);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={item.imageURL} alt="" />
        
        {!cartItems[item.id] ? (
          <img
            className="add"
            onClick={() => addToCart(item.id)}
            src='https://testing.indiantadka.eu/assets/add_icon_white.png'
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(item.id)}
              src='https://testing.indiantadka.eu/assets/remove_icon_red.png'
              alt=""
            />
            <p>{cartItems[item.id]}</p>
            <img
              onClick={() => addToCart(item.id)}
              src='https://testing.indiantadka.eu/assets/add_icon_green.png'
              alt=""
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name">
          <img className="food-item-rating" src='https://testing.indiantadka.eu/assets/rating_starts.png' alt=""></img>
          <p>{item.delivery.itemName}</p>
        </div>
        
        <p className="food-item-description">{item.description}</p>
        <p className="food-item-price">€ {item.delivery.price}</p>
        {item.tags && item.tags.length > 0 && (
                <div className="tags-container">
                {item.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="tag">
                  {tag}
                </span>
                ))}
                </div>
              )}
      </div>
    </div>
  );
};

export default FoodItem;
