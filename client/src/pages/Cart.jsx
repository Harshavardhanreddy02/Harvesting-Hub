/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */

import { useContext, useEffect } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { storeContext } from "./../pages/redux/context/storeContext";
import { useSelector } from "react-redux";

const Cart = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { cartItems, food_list, tool_list, removeCart, token } = useContext(storeContext);
  const navigate = useNavigate();

  const list = currentUser?.role === "Customer" ? food_list : tool_list;

  // Function to get item details by ID
  const getItemDetails = (itemId) => {
    const item = list.find((item) => item._id === itemId);
    return (
      item || {
        _id: itemId,
        name: "Unknown Item",
        price: 0,
        image: "",
        stockQuantity: 0,
      }
    );
  };

  // Function to calculate the total amount
  const getTotalAmount = () => {
    try {
      if (!cartItems || typeof cartItems !== "object") {
        console.warn("cartItems is not valid in getTotalAmount");
        return 0;
      }

      return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
        const item = getItemDetails(itemId);

        // Ensure item is valid and has a price
        if (!item || typeof item.price !== "number" || isNaN(item.price)) {
          console.warn(`Invalid item or price for item ID: ${itemId}`);
          return total;
        }

        const price = item.price;
        const qty = parseInt(quantity) || 0;

        return total + price * qty;
      }, 0);
    } catch (error) {
      console.error("Error calculating cart total:", error);
      return 0;
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalAmount() === 0) {
      navigate("/empty");
    }
  }, [token]);

  return (
    <div className="cart">
      <div className="cart-items mx-20">
        <div className="cart-items-title ml-4 font-bold text-black">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p className="-ml-8">Quantity</p>
          <p>Total</p>
          <p className="-ml-8">Remove</p>
        </div>
        <br />
        <hr />

        {Object.keys(cartItems).map((itemId) => {
          const item = getItemDetails(itemId);
          const quantity = cartItems[itemId];

          if (quantity > 0) {
            return (
              <div className="" key={item._id}>
                <div className="cart-items-title cart-items-item transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-4 hover:border-blue-400 hover:bg-blue-200 bg-blue-300 p-3">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item.image}`}
                    alt=""
                    className="bg-slate-100 h-24"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-size='12' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <p>{item.name}</p>
                  <p>Rs {item.price}/-</p>
                  <p>{quantity}</p>
                  <p>Rs {item.price * quantity}/-</p>
                  <p
                    onClick={() => removeCart(item._id)}
                    className="cross bg-red-500 max-w-6 pl-2 rounded-full font-bold"
                  >
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
          <h2 className="font-bold">Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p style={{ marginLeft: "50px" }}>Rs {getTotalAmount()}/-</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p style={{ marginLeft: "50px" }}>
                Rs {getTotalAmount() === 0 ? 0 : 50}/-
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b style={{ marginLeft: "50px" }}>
                Rs {getTotalAmount() === 0 ? 0 : getTotalAmount() + 50}/-
              </b>
            </div>
          </div>
          <button
            className="hover:opacity-85"
            onClick={() => navigate("/order")}
          >
            ORDER NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
