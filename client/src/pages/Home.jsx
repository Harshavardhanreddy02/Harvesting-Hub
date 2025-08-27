/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import { FaLeaf, FaShoppingCart, FaTractor, FaStore } from 'react-icons/fa';
import { useStore } from "./redux/context/storeContext";

// Import components
import { LoginPopup } from "../components/LoginPopup";
import FoodItem from "../components/FoodItem";
import Feedback from "../components/Feedback"; // Ensure this import is correct
import background from "./../../assets/website-home.jpg";

// Import icons from lucide-react
import { 
  ShoppingCart as LucideShoppingCart, 
  Truck, 
  Leaf, 
  ArrowRight, 
  ArrowLeft 
} from "lucide-react";

// Parallax Component for Background
const ParallaxBackground = ({ children }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="parallax-container"
      style={{
        backgroundImage: `url(${background})`,
        backgroundPositionY: offset * 0.5 + 'px'
      }}
    >
      {children}
    </div>
  );
};

// Scroll Container with Enhanced Navigation
const EnhancedScrollContainer = ({ items, title, role, viewAllLink }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ 
        left: scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <motion.div 
      className="enhanced-scroll-section"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="section-header">
        <h2>{title}</h2>
        <Link to={viewAllLink} className="view-all-btn">
          View All <ArrowRight className="inline-block ml-2" />
        </Link>
      </div>

      <div className="scroll-navigation">
        <motion.button 
          className="nav-button left" 
          onClick={() => scroll('left')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft />
        </motion.button>

        <div 
          ref={scrollRef} 
          className="enhanced-scroll-container"
        >
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div 
                key={item._id} 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5 
                }}
                className="scroll-item"
              >
                <FoodItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                  stock={item.stockQuantity}
                  role={role}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.button 
          className="nav-button right" 
          onClick={() => scroll('right')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowRight />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Updated helper function to match the logic in Market page
const getImageUrl = (image) => {
  try {
    // Handle case when image is undefined or null
    if (!image) {
      return "https://images.unsplash.com/photo-1607247098789-2b845abf783c?auto=format&fit=crop&w=500&q=60";
    }
    
    // If image is already a complete URL
    if (image.startsWith('http') || image.startsWith('https')) {
      return image;
    }
    
    // If image is a base64 string (likely starts with data:image)
    if (image.startsWith('data:')) {
      return image;
    }
    
    // If image is a relative path without http(s) or data: prefix
    // Append the correct backend URL to create a complete URL
    return `${import.meta.env.VITE_BACKEND_URL}/uploads/${image}`;
  } catch (error) {
    console.error("Error processing image URL:", error);
    return "https://images.unsplash.com/photo-1607247098789-2b845abf783c?auto=format&fit=crop&w=500&q=60";
  }
};

export const Home = ({ category, setCategory }) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { food_list, tool_list } = useStore();
  const [fastSellingItems, setFastSellingItems] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [fastSellingTools, setFastSellingTools] = useState([]);
  const [newlyAddedTools, setNewlyAddedTools] = useState([]);

  // Navigation effect
  useEffect(() => {
    if (currentUser && currentUser.role === "Admin") {
      navigate("/orders");
    } else if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Fetch data effect
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "Customer") {
        fetchFastSellingItems();
        fetchRecentItems();
      } else if (currentUser.role === "Farmer") {
        fetchFastSellingTools();
        fetchNewlyAddedTools();
      }
    }
  }, [currentUser]);

  // Fetch functions
  const fetchFastSellingItems = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/topselling`
      );
      setFastSellingItems(response.data.message || []);
    } catch (error) {
      console.error("Error fetching fast-selling items:", error);
      setFastSellingItems([]);
    }
  };

  const fetchRecentItems = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/recentadded`
      );
      setRecentItems(response.data.message || []);
    } catch (error) {
      console.error("Error fetching recently added items:", error);
      setRecentItems([]);
    }
  };

  const fetchFastSellingTools = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/tool/topselling`
      );
      setFastSellingTools(response.data.message || []);
    } catch (error) {
      console.error("Error fetching fast-selling tools:", error);
      setFastSellingTools([]);
    }
  };

  const fetchNewlyAddedTools = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/tool/recentadded`
      );
      setNewlyAddedTools(response.data.message || []);
    } catch (error) {
      console.error("Error fetching newly added tools:", error);
      setNewlyAddedTools([]);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.parallax');
      elements.forEach(element => {
        const speed = element.getAttribute('data-speed');
        const yPos = -(window.pageYOffset * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="parallax absolute inset-0 bg-[url('/images/farm-bg.jpg')] bg-cover bg-center" data-speed="0.5"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Fresh from Farm to Table
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Connecting farmers directly with consumers for the freshest produce and tools
          </p>
          <Link 
            to="/Market" 
            className="bg-white text-green-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-50 transition-colors"
          >
            Shop Now
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose HarvestHub?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg"
            >
              <FaLeaf className="text-5xl text-green-500 mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Fresh Produce</h3>
              <p className="text-gray-600">
                Get farm-fresh fruits and vegetables directly from local farmers
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg"
            >
              <FaTractor className="text-5xl text-green-500 mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Quality Tools</h3>
              <p className="text-gray-600">
                Access high-quality farming tools and equipment
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg"
            >
              <FaStore className="text-5xl text-green-500 mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Direct Market</h3>
              <p className="text-gray-600">
                Connect directly with farmers and sellers
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Parallax Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="parallax absolute inset-0 bg-[url('/images/farm-parallax.jpg')] bg-cover bg-center" data-speed="0.3"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Supporting Local Farmers
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join us in our mission to support local agriculture and sustainable farming
          </p>
          <Link 
            to="/Signup" // Change from "/register" to "/Signup"
            className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Join Now
          </Link>
      </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-green-600 mb-2">1000+</h3>
              <p className="text-gray-600">Active Farmers</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-green-600 mb-2">5000+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-green-600 mb-2">10000+</h3>
              <p className="text-gray-600">Products Listed</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-green-600 mb-2">4.8</h3>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>
    
      {/* Product Sections */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {currentUser && currentUser.role === "Customer" && (
          <>
            {/* Fast Selling Items */}
            {fastSellingItems.length > 0 && (
              <section className="mb-16">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-green-800">Fast Selling Items</h2>
                  <Link 
                    to="/market" 
                    className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                  >
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {fastSellingItems.map((item) => (
                    <motion.div 
                      key={item._id}
                      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                      className="bg-white rounded-xl overflow-hidden shadow-md transition-all"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={getImageUrl(item.image)} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          onError={(e) => {
                            console.log(`Failed to load image: ${item.image}`);
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = "https://images.unsplash.com/photo-1607247098789-2b845abf783c?auto=format&fit=crop&w=500&q=60";
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{item.name}</h3>
                        <p className="text-green-600 font-bold mb-3">₹{item.price}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Recently Added Items */}
            {recentItems.length > 0 && (
              <section className="mb-16">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-green-800">Recently Added</h2>
                  <Link 
                    to="/market" 
                    className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                  >
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {recentItems.map((item) => (
                    <motion.div 
                      key={item._id}
                      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                      className="bg-white rounded-xl overflow-hidden shadow-md transition-all"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={getImageUrl(item.image)} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          onError={(e) => {
                            console.log(`Failed to load image: ${item.image}`);
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = "https://images.unsplash.com/photo-1607247098789-2b845abf783c?auto=format&fit=crop&w=500&q=60";
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          New
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{item.name}</h3>
                        <p className="text-green-600 font-bold mb-3">₹{item.price}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {currentUser && currentUser.role === "Farmer" && (
          <>
            {/* Fast Selling Tools */}
            {fastSellingTools.length > 0 && (
              <section className="mb-16">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-green-800">Fast Selling Tools</h2>
                  <Link 
                    to="/market" 
                    className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                  >
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {fastSellingTools.map((tool) => (
                    <motion.div 
                      key={tool._id}
                      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                      className="bg-white rounded-xl overflow-hidden shadow-md transition-all"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={getImageUrl(tool.image)} 
                          alt={tool.name} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          onError={(e) => {
                            console.log(`Failed to load image: ${tool.image}`);
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = "https://images.unsplash.com/photo-1607247098789-2b845abf783c?auto=format&fit=crop&w=500&q=60";
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{tool.name}</h3>
                        <p className="text-green-600 font-bold mb-3">₹{tool.price}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Newly Added Tools */}
            {newlyAddedTools.length > 0 && (
              <section className="mb-16">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-green-800">Newly Added Tools</h2>
                  <Link 
                    to="/market" 
                    className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                  >
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {newlyAddedTools.map((tool) => (
                    <motion.div 
                      key={tool._id}
                      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                      className="bg-white rounded-xl overflow-hidden shadow-md transition-all"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={getImageUrl(tool.image)} 
                          alt={tool.name} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          onError={(e) => {
                            console.log(`Failed to load image: ${tool.image}`);
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = "https://images.unsplash.com/photo-1607247098789-2b845abf783c?auto=format&fit=crop&w=500&q=60";
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          New
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{tool.name}</h3>
                        <p className="text-green-600 font-bold mb-3">₹{tool.price}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
      
      {/* Feedback Component from Old Home page */}
      {currentUser && <Feedback />}
    </div>
  );
};