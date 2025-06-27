/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaRegHeart, FaShoppingBag, FaBars, FaUser, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import user_image from "./../../assets/user_img.png";
import { IoPersonSharp } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useContext } from "react";
import { storeContext } from "../pages/redux/context/storeContext";
import { logoutSuccess } from "../../src/pages/redux/user/userSlice";
import { SearchBar } from './SearchBar';
import "./Header.css";

export const Header = ({ onMenuClick }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { cartItems } = useContext(storeContext);
  const { setToken } = useContext(storeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const getCartQuantity = () => {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    dispatch(logoutSuccess());
    navigate("/");
  };

  return (
    <header className="bg-slate-300 shadow-md fixed top-0 left-0 min-w-full z-50">
      <div className="flex items-center justify-between h-16 px-4 max-w-[1600px] mx-auto">
        {/* Left Section: Logo and Menu */}
        <div className="flex items-center gap-4 min-w-[200px]">
          <button className="p-2 hover:bg-slate-400/20 rounded-lg" onClick={onMenuClick} aria-label="Open sidebar">
            <FaBars size={20} />
          </button>
          <Link to="/" className="flex items-center">
            <span className="font-bold text-2xl text-blue-600">Harvest</span>
            <span className="font-bold text-xl text-sky-600">Hub</span>
          </Link>
        </div>

        {/* Center Section: Search */}
        <div className="flex-1 max-w-3xl mx-4">
          <SearchBar />
        </div>

        {/* Right Section: Icons */}
        <div className="flex items-center gap-6 min-w-[200px] justify-end">
          {/* Only show wishlist and cart for non-admin users */}
          {currentUser?.role !== "Admin" && (
            <>
              <Link to="/wishlist" className="icon-button">
                <FaRegHeart className="text-xl hover:text-pink-500 transition-colors" />
              </Link>

              <Link to="/cart" className="icon-button relative">
                <FaShoppingBag className="text-xl" />
                {getCartQuantity() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {getCartQuantity()}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* Modify the user-related buttons based on login status */}
          {currentUser ? (
            // Show logout button for logged-in users
            <button
              onClick={logout}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition-colors"
            >
              Logout
            </button>
          ) : (
            // Show login button for non-logged in users
            <Link to="/login" className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;


