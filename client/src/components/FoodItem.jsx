// /* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
// import React, { useContext } from 'react'
import "./FoodItem.css";
import { assets } from "./../../frontend_assets/assets";
import { storeContext } from "./../pages/redux/context/storeContext";
import { useContext, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import ItemDetailsModal from "./ItemDetailsModal";

const FoodItem = ({ id, name, price, description, image, stock, seller_name, dateListed, manufacturedDate, endDate, category, location }) => {
  const { cartItems, addtoCart, removeCart, wishlist = [], toggleWishlistItem } = useContext(storeContext);
  const [showModal, setShowModal] = useState(false);
  
  const isWishlisted = wishlist?.includes(id) || false;
  
  const handleWishlistClick = (e) => {
    e.stopPropagation(); // Prevent modal from opening when clicking wishlist button
    toggleWishlistItem(id);
  };

  const handleCartClick = (e) => {
    e.stopPropagation(); // Prevent modal from opening when clicking cart buttons
  };

  return (
    <>
      <div 
        className="food-item transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="food-item-img-container relative">
          {/* Wishlist Heart Icon */}
          <button
            className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-1 shadow hover:bg-pink-100"
            onClick={handleWishlistClick}
          >
            {isWishlisted ? (
              <FaHeart className="text-pink-500 text-xl" />
            ) : (
              <FaRegHeart className="text-gray-400 text-xl" />
            )}
          </button>
        <img
          src={image ? `${import.meta.env.VITE_BACKEND_URL}/images/${image}` : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-size='12' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E"}
          alt={name || "Product"}
          className={`food-item-image bg-slate-100 ${
            stock === 0 ? "grayscale" : ""
          }`}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loops
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-size='12' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
        />
        {stock === 0 ? (
          <span className="sold-out-badge">Sold Out</span>
        ) : stock < 10 ? (
          <span className="low-stock-badge">Low Stock : {stock}</span>
        ) : null}

          <div onClick={handleCartClick}>
        {!cartItems[id] ? (
          <img
            className="add"
                onClick={() => stock > 0 && addtoCart(id)}
            src={assets.add_icon_white}
            alt="Add to Cart"
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeCart(id)}
              src={assets.remove_icon_red}
              alt="Remove from Cart"
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => {
                if (cartItems[id] < stock) addtoCart(id);
              }}
              src={assets.add_icon_green}
              alt="Add to Cart"
            />
          </div>
        )}
          </div>
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p className="h-8 m-2">{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc h-16">{description}</p>
        <p className="food-item-price">Rs. {price}/-</p>
      </div>
    </div>

      {showModal && (
        <ItemDetailsModal
          item={{
            id,
            name,
            price,
            description,
            image,
            stock,
            seller_name,
            dateListed,
            manufacturedDate,
            endDate,
            category,
            location
          }}
          onClose={() => setShowModal(false)}
          onAddToCart={() => stock > 0 && addtoCart(id)}
          isInCart={!!cartItems[id]}
          cartQuantity={cartItems[id] || 0}
        />
      )}
    </>
  );
};

export default FoodItem;
