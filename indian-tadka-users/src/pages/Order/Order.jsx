import React, { useContext, useState } from 'react'
import "./Order.css";
import { StoreContext } from '../../context/StoreContext';

const Order = () => {
    const { getTotalCartAmount } = useContext(StoreContext);
    const [deliveryFee] = useState(2);
  return (
    <form className='place-order'>
      <div className='place-order-left'>
        <p className='title'> Delivery Information</p>
        <div className='multi-fields'>
          <input type='text' placeholder='First Name' />
          <input type='text' placeholder='LastName' />
        </div>
        <input type='email' placeholder='Email Name' />
        <input type='text' placeholder='Street' />
        <div className='multi-fields'>
          <input type='text' placeholder='City' />
          <input type='text' placeholder='State' />
        </div>
        <div className='multi-fields'>
          <input type='text' placeholder='Zip code' />
          <input type='text' placeholder='Country' />
        </div>
        <input type='text' placeholder='Phone' />
      </div>
      <div className='place-order-right'>
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
          <button>PROCEED TO PAY</button>
        </div>
      </div>
    </form>
  )
}

export default Order
