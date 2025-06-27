import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaStore, FaInfoCircle, FaSeedling, FaBook, FaUser, FaSignOutAlt, FaShoppingCart, FaClipboardList, FaChartBar, FaMoneyBillWave, FaTimes, FaRegHeart, FaTools } from "react-icons/fa";
import user_image from "../../assets/user_img.png";
import { logoutSuccess } from "../pages/redux/user/userSlice";
import PropTypes from "prop-types";
import React from "react";

// Change to default export and keep the default parameters
export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Debug logging
  console.log('Sidebar isOpen:', isOpen);

  const logout = () => {
    localStorage.removeItem("token");
    dispatch(logoutSuccess());
    navigate("/");
    if (onClose) onClose();
  };

  // Navigation links based on user role
  const getNavLinks = () => {
    if (currentUser?.role === "Admin") {
      return [
        { to: "/admin", label: "Dashboard", icon: <FaChartBar /> },
        { to: "/list", label: "All Products", icon: <FaStore /> },
        { to: "/listtool", label: "All Tools", icon: <FaTools /> },
        { to: "/orders", label: "Orders", icon: <FaClipboardList /> },
        { to: "/manage-users", label: "Manage Users", icon: <FaUser /> },
        { to: "/feedbacks", label: "User Feedbacks", icon: <FaBook /> }
      ];
    } else if (currentUser?.role === "Farmer") {
      return [
        { to: "/", label: "Home", icon: <FaHome /> },
        { to: "/Market", label: "Market", icon: <FaStore /> },
        { to: "/About", label: "About", icon: <FaInfoCircle /> },
        { to: "/cart", label: "Cart", icon: <FaShoppingCart /> },
        { to: "/myorders", label: "My Orders", icon: <FaClipboardList /> },
        { to: "/wishlist", label: "Wishlist", icon: <FaRegHeart className='text-pink-400' /> },
        { to: "/sell-products", label: "Sell Products", icon: <FaStore className='text-green-500' /> },
        { to: "/sell-tools", label: "Sell Tools", icon: <FaTools className='text-green-500' /> },
        { to: "/farmerdashboard", label: "My Sellings", icon: <FaChartBar /> },
        { to: "/farmerrevenue", label: "My Revenue", icon: <FaMoneyBillWave /> }
      ];
    } else {
      return [
        { to: "/", label: "Home", icon: <FaHome /> },
        { to: "/Market", label: "Market", icon: <FaStore /> },
        { to: "/About", label: "About", icon: <FaInfoCircle /> },
        { to: "/cart", label: "Cart", icon: <FaShoppingCart /> },
        { to: "/myorders", label: "My Orders", icon: <FaClipboardList /> },
        { to: "/wishlist", label: "Wishlist", icon: <FaRegHeart className='text-pink-400' /> }
      ];
    }
  };

  // Overlay and sidebar classes
  const sidebarBase = "fixed top-0 left-0 h-full z-[1200] bg-gradient-to-br from-slate-800 to-slate-900 transition-transform duration-300 ease-in-out";
  const sidebarWidth = "w-64 md:w-64 sm:w-4/5 max-w-xs min-w-[220px]";
  const sidebarOpen = isOpen ? "translate-x-0" : "-translate-x-full";
  const overlayClass = "fixed inset-0 bg-black/40 z-[1100] transition-opacity duration-300" + (isOpen ? " opacity-100" : " opacity-0 pointer-events-none");

  // Additional debug logging
  console.log('Sidebar classes:', {
    sidebarBase,
    sidebarWidth,
    sidebarOpen,
    fullClass: `${sidebarBase} ${sidebarWidth} ${sidebarOpen} flex flex-col`
  });

  return (
    <>
      {/* Overlay */}
      <div
        className={overlayClass}
        onClick={onClose}
        aria-label="Close sidebar overlay"
      />
      {/* Sidebar */}
      <nav
        className={`${sidebarBase} ${sidebarWidth} ${sidebarOpen} flex flex-col`}
        style={{ boxShadow: "2px 0 16px rgba(0,0,0,0.15)" }}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl hover:bg-white/10 rounded-full p-1 transition"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <FaTimes />
        </button>

        {/* Profile Section */}
        <div className="sidebar-header flex flex-col items-center border-b border-white/20 pb-6 pt-8 bg-white/5">
          <img src={user_image} alt="User" className="w-16 h-16 rounded-full border-2 border-white shadow mb-3 object-cover" />
          <span className="text-lg font-semibold text-white">
            {currentUser?.user_name || currentUser?.email || "Guest"}
          </span>
          <span className="text-sm text-slate-300">{currentUser?.role}</span>
        </div>

        {/* Navigation */}
        <ul className="flex-1 px-3 py-4 space-y-1">
          {getNavLinks().map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-white/10 ${
                  location.pathname === link.to ? "bg-white/15 text-white" : ""
                }`}
                onClick={onClose}
              >
                <span className="text-xl">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 bg-white/5">
          <Link 
            to="/profile" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-white/10 mb-2"
            onClick={onClose}
          >
            <FaUser />
            <span>Profile</span>
          </Link>
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-300 hover:text-white hover:bg-red-500/80" 
            onClick={logout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}


