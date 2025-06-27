/* eslint-disable react/prop-types */
// import axios from "axios";
import "./Products.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import FoodItem from "../components/FoodItem";
import { useSelector } from "react-redux";
import ExploreMenu from "../components/ExploreMenu";
import { useLocation } from "react-router-dom";

export const Products = ({ category, setCategory }) => {
  const [food_list, setFoodList] = useState([]);
  const [tool_list, setToolList] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      setLoading(true);

      // Check if we have search results from navigation
      if (location.state?.searchResults) {
        if (currentUser?.role === "Farmer") {
          setToolList(location.state.searchResults);
          setSearchQuery(location.state.searchQuery);
        } else {
          setFoodList(location.state.searchResults);
          setSearchQuery(location.state.searchQuery);
        }
        setLoading(false);
        return;
      }

      // If no search results, fetch all products
      try {
        const toolResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tool/list`);
        const productResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/list`);
        
        if (toolResponse.data.success) {
          setToolList(toolResponse.data.message);
        }
        
        if (productResponse.data.success) {
          setFoodList(productResponse.data.message);
        }
      } catch (error) {
        console.error('Error fetching products or tools:', error);
        toast.error('Error loading products');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error in main fetchProducts function:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchProducts();
    } else {
      console.warn('No current user found in Products page');
      setLoading(false);
    }
  }, [currentUser, location.state]);

  const sortProducts = (products) => {
    if (sortOption === "priceHighToLow") {
      return [...products].sort((a, b) => b.price - a.price);
    }
    if (sortOption === "priceLowToHigh") {
      return [...products].sort((a, b) => a.price - b.price);
    }
    if (sortOption === "fastSelling") {
      return [...products].sort((a, b) => a.stockQuantity - b.stockQuantity);
    }
    if (sortOption === "recentlyAdded") {
      return [...products].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    return products;
  };

  const getFilteredProducts = (products) => {
    let filteredProducts = products;

    // Apply category filter
    if (category !== "All") {
      filteredProducts = filteredProducts.filter(
        (item) => category === item.category
      );
    }

    // Apply search filter if there's a search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
      );
    }

    return sortProducts(filteredProducts);
  };

  return (
    <div className="">
      <div className="products-header ml-8">
        <ExploreMenu category={category} setCategory={setCategory} />
        <select
          className="filter-dropdown"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="priceHighToLow">Price: High to Low</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="fastSelling">Fast Selling</option>
          <option value="recentlyAdded">Recently Added</option>
        </select>
      </div>
      
      {loading ? (
        <div className="loading-indicator">Loading products...</div>
      ) : (
        <div className="food-display" id="food-dsiplay">
          <div className="food-display-list">
            {currentUser == null && <p>Login to see the products</p>}

            {currentUser && currentUser.role === "Customer" && food_list.length === 0 && (
              <p>No products available at this time</p>
            )}

            {currentUser && currentUser.role === "Farmer" && tool_list.length === 0 && (
              <p>No tools available at this time</p>
            )}

            {currentUser &&
              currentUser.role === "Customer" &&
              getFilteredProducts(food_list).map((item, index) => (
                <FoodItem
                  key={item._id || index}
                  id={item._id || `temp-${index}`}
                  name={item.name || "Unnamed Product"}
                  description={item.description || ""}
                  price={parseFloat(item.price) || 0}
                  image={item.image || `${import.meta.env.VITE_BACKEND_URL}/uploads/` + item.image}
                  stock={parseInt(item.stockQuantity) || 0}
                />
              ))}

            {currentUser &&
              currentUser.role === "Farmer" &&
              getFilteredProducts(tool_list).map((item, index) => (
                <FoodItem
                  key={item._id || index}
                  id={item._id || `temp-${index}`}
                  name={item.name || "Unnamed Tool"}
                  description={item.description || ""}
                  price={parseFloat(item.price) || 0}
                  image={item.image || ""}
                  stock={parseInt(item.stockQuantity) || 0}
                />
              ))}
          </div>
        </div>
      )}
      
      {/* Debug panel - can be removed in production */}
    </div>
  );
};
