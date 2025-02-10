import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import EmailVerificationAlert from "../../components/EmailVerification/EmailVerification";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    userDetails,
    handleLoginModal,
    handleRedirectPage,
  } = useContext(StoreContext);

  const checkout = async () => {
    if (!userDetails) {
      handleLoginModal();
    }
    handleRedirectPage("/order");
  };
  const [deliveryFee] = useState(2);
  return (
    <div className="cart">
      {userDetails && <EmailVerificationAlert user={userDetails} />}
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item.id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={item.imageURL} alt="" />
                  <p>{item.itemName}</p>
                  <p>{item.price}</p>
                  <p>{cartItems[item.id]}</p>
                  <p>{item.price * cartItems[item.id]}</p>
                  <p className="cross" onClick={() => removeFromCart(item.id)}>
                    X
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>SubTotal</p>
              <p>{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{getTotalCartAmount(deliveryFee)}</b>
            </div>
          </div>
          <button onClick={() => checkout()}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
