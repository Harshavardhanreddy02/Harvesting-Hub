/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, useContext, useReducer } from "react";
import api from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';
import { set } from "mongoose";
import { validateToken, initializeAuth, forceLogout } from '../../../utils/tokenManager';

export const storeContext = createContext();

// Initialize auth and get valid token
const validToken = initializeAuth();

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems") || "{}"),
  wishlist: JSON.parse(localStorage.getItem("wishlist") || "[]"),
  food_list: [],
  tool_list: [],
  token: validToken,
  user: validToken ? JSON.parse(localStorage.getItem("user") || "null") : null
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      // Store token in both localStorage and sessionStorage
      if (action.payload) {
        localStorage.setItem('token', action.payload);
        sessionStorage.setItem('token', action.payload);
      }
      return {
        ...state,
        token: action.payload
      };
    case 'CLEAR_TOKEN':
      // Remove token from both storage mechanisms
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null
      };
    case "ADD_TO_CART":
      const updatedCartItems = {
        ...state.cartItems,
        [action.payload]: (state.cartItems[action.payload] || 0) + 1,
      };
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      return {
        ...state,
        cartItems: updatedCartItems,
      };
    case "REMOVE_FROM_CART":
      const newCartItems = { ...state.cartItems };
      delete newCartItems[action.payload];
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
      return {
        ...state,
        cartItems: newCartItems,
      };
    case "CLEAR_CART":
      localStorage.removeItem("cartItems");
      return {
        ...state,
        cartItems: {},
      };
    case "TOGGLE_WISHLIST": {
      const newWishlist = state.wishlist.includes(action.payload)
        ? state.wishlist.filter((id) => id !== action.payload)
        : [...state.wishlist, action.payload];
      
      // Save to localStorage
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      
      return {
        ...state,
        wishlist: newWishlist,
      };
    }
    case "SET_WISHLIST":
      // Add this line to save to localStorage
      localStorage.setItem("wishlist", JSON.stringify(action.payload));
      return {
        ...state,
        wishlist: action.payload,
      };
    case "SET_FOOD_LIST":
      return {
        ...state,
        food_list: action.payload,
      };
    case "SET_TOOL_LIST":
      return {
        ...state,
        tool_list: action.payload,
      };
    case "SET_TOKEN":
      localStorage.setItem("token", action.payload);
      return {
        ...state,
        token: action.payload
      };
    case "CLEAR_TOKEN":
      localStorage.removeItem("token");
      return {
        ...state,
        token: ""
      };
    case "SET_INPUT":
      return {
        ...state,
        input: action.payload,
      };
    case "SET_CART_ITEMS":
      localStorage.setItem("cartItems", JSON.stringify(action.payload));
      return {
        ...state,
        cartItems: action.payload,
      };
    case "SET_USER":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [food_list,setFoodList]=useState([])
  const [tool_list,setToolList]=useState([])
  const [input,setInput] = useState("")
  // Replace the safeToast function with a more reliable version
  const safeToast = (message, type = 'info') => {
    // Only try to use toast if it's available in the current environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      try {
        // Use a setTimeout to ensure the toast component is fully mounted
        setTimeout(() => {
          switch(type) {
            case 'success':
              toast.success(message);
              break;
            case 'error':
              toast.error(message);
              break;
            case 'warn':
              toast.warn(message);
              break;
            default:
              toast(message);
          }
        }, 0);
      } catch (error) {
        console.error('Toast error:', error);
        // Fallback to console logging if toast fails
        console.log(`${type.toUpperCase()}: ${message}`);
      }
    } else {
      // Fallback for environments where window/document aren't available
      console.log(`${type.toUpperCase()}: ${message}`);
    }
  };

  const setToken = (token) => {
    dispatch({ type: "SET_TOKEN", payload: token });
  };

  const clearToken = () => {
    dispatch({ type: "CLEAR_TOKEN" });
  };

  const addtoCart = async (itemId) => {
    dispatch({ type: "ADD_TO_CART", payload: itemId });
    if (state.token) {
      try {
        await api.post(
          "/cart/add",
          { 
            itemId,
            userid: state.user?._id || localStorage.getItem("userId")
          },
          { 
            headers: { 
              "Authorization": `Bearer ${state.token}`,
              "token": state.token 
            } 
          }
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  const removeCart = async (itemId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: itemId });
    if (state.token) {
      try {
        await api.post(
          "/cart/remove",
          { 
            itemId,
            userid: state.user?._id || localStorage.getItem("userId")
          },
          { 
            headers: { 
              "Authorization": `Bearer ${state.token}`,
              "token": state.token 
            } 
          }
        );
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const toggleWishlistItem = async (itemId) => {
    try {
      console.log("Toggling wishlist for item:", itemId);
      
      if (!state.token) {
        console.warn("User not logged in, please log in to use wishlist");
        return;
      }
      
      // Update local state first for immediate feedback
      dispatch({ type: "TOGGLE_WISHLIST", payload: itemId });
      
      // Use api utility instead of fetch for consistency
      const response = await api.post(
        "/wishlist/toggle",
        { itemId },
        {
          headers: {
            "Authorization": `Bearer ${state.token}`
          }
        }
      );
      
      if (!response.data.success) {
        console.error(`Server responded with error:`, response.data);
        // Revert the local state change
        dispatch({ type: "TOGGLE_WISHLIST", payload: itemId });
        return;
      }
      
      console.log("Wishlist toggle response:", response.data);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      // Revert the local state change
      dispatch({ type: "TOGGLE_WISHLIST", payload: itemId });
    }
  };

  const fetchWishlist = async () => {
    if (!state.token) {
      console.log("No auth token, skipping server wishlist fetch");
      
      // Even without a token, we should try to load from localStorage
      const storedWishlist = localStorage.getItem("wishlist");
      if (storedWishlist) {
        try {
          const parsedWishlist = JSON.parse(storedWishlist);
          dispatch({ type: "SET_WISHLIST", payload: parsedWishlist });
          console.log("Loaded wishlist from localStorage:", parsedWishlist);
        } catch (err) {
          console.error("Error parsing stored wishlist:", err);
        }
      }
      
      return;
    }
    
    try {
      console.log("Fetching wishlist from server with token:", state.token.substring(0, 15) + "...");
      
      // Use the existing wishlist as fallback
      const currentWishlist = [...state.wishlist];
      
      const response = await api.get("/wishlist/items", {
        headers: { "Authorization": `Bearer ${state.token}` }
      });
      
      console.log("Wishlist data received from server:", response.data);
      
      if (response.data.success) {
        const wishlistIds = response.data.items.map(item => item._id);
        
        // Only update if we actually got items back, otherwise keep existing
        if (wishlistIds && wishlistIds.length > 0) {
          dispatch({ type: "SET_WISHLIST", payload: wishlistIds });
          localStorage.setItem("wishlist", JSON.stringify(wishlistIds));
          console.log("Updated wishlist with server data:", wishlistIds);
        } else if (currentWishlist.length > 0) {
          // If server returned empty but we have local data, prefer local data
          console.log("Server returned empty wishlist but we have local data, keeping local data");
        } else {
          // If both are empty, set empty array
          dispatch({ type: "SET_WISHLIST", payload: [] });
          localStorage.setItem("wishlist", JSON.stringify([]));
        }
      } else {
        console.warn("Wishlist fetch unsuccessful:", response.data.message);
        // Don't clear wishlist on unsuccessful fetch if we have data
        if (currentWishlist.length === 0) {
          dispatch({ type: "SET_WISHLIST", payload: [] });
        }
      }
    } catch (error) {
      console.error("Error fetching wishlist from server:", error);
      
      // Fallback to localStorage and don't clear existing data
      const storedWishlist = localStorage.getItem("wishlist");
      if (storedWishlist) {
        dispatch({ type: "SET_WISHLIST", payload: JSON.parse(storedWishlist) });
      }
      
      // Don't clear the wishlist on error if we already have items
      if (state.wishlist.length === 0) {
        const storedWishlist = localStorage.getItem("wishlist");
        if (storedWishlist) {
          try {
            dispatch({ type: "SET_WISHLIST", payload: JSON.parse(storedWishlist) });
          } catch (err) {
            console.error("Error parsing stored wishlist:", err);
          }
        }
      }
    }
  };

  const fetchFood = async () => {
    try {
        console.log("Fetching food products...");
        
        // Remove the /api prefix since it's already in the baseURL
        const response = await api.get("/product/list");
        
        console.log("Food API response:", response.data);

        let products = [];
        
        // Handle response format exactly like tool fetch
        if (response.data && response.data.success && Array.isArray(response.data.message)) {
            products = response.data.message;
        } else if (response.data && Array.isArray(response.data)) {
            products = response.data;
        } else if (response.data && response.data.products && Array.isArray(response.data.products)) {
            products = response.data.products;
        }

        // Process exactly like tools
        const safeProducts = products.map(product => ({
            _id: product._id || `temp-${Math.random()}`,
            name: product.name || "Unnamed Product",
            description: product.description || "No description available",
            price: product.price || 0,
            category: product.category || "Uncategorized",
            image: product.image || "default.jpg",
            stockQuantity: product.stockQuantity || 0,
            ...product // Keep any additional fields
        }));

        console.log(`Processed ${safeProducts.length} food products`);
        dispatch({ type: "SET_FOOD_LIST", payload: safeProducts });
        setFoodList(response.data.message);
    } catch (error) {
        console.error("Error fetching food products:", error);
        dispatch({ type: "SET_FOOD_LIST", payload: [] });
    }
};

const fetchTool = async () => {
    try {
        console.log("Fetching tool items...");
        setLoading(true);
        
        const url = state.input 
            ? `/tool/search/${state.input}` 
            : "/tool/list";
            
        // Use the api instance to prevent URL duplication
        const response = await api.get(url);
        const data = response.data;

        // Log the response for debugging
        console.log("Tool API response:", data);

        let tools = [];
        
        // Handle different response formats
        if (data && data.success && Array.isArray(data.message)) {
            tools = data.message;
        } else if (data && Array.isArray(data)) {
            tools = data;
        } else if (data && data.tools && Array.isArray(data.tools)) {
            tools = data.tools;
        }

        // Ensure all tools have required fields
        const safeTools = tools.map(tool => ({
            _id: tool._id || `temp-${Math.random()}`,
            name: tool.name || "Unnamed Tool",
            description: tool.description || "No description available",
            price: tool.price || 0,
            category: tool.category || "Uncategorized",
            image: tool.image || "default.jpg",
            stockQuantity: tool.stockQuantity || 0,
            ...tool // Keep any additional fields
        }));

        console.log(`Processed ${safeTools.length} tool items`);
        setToolList(response.data.message);
        dispatch({ type: "SET_TOOL_LIST", payload: safeTools });
    } catch (error) {
        console.error("Error fetching tool items:", error);
        dispatch({ type: "SET_TOOL_LIST", payload: [] });
    } finally {
        setLoading(false);
    }
};

  const loadCart = async () => {
    // Check if user is authenticated
    const token = state.token || localStorage.getItem('token');
    const userId = state.user?._id || localStorage.getItem("userId");
    
    if (!token || !userId) {
      console.log("No token or userId found, loading cart from localStorage only");
      // Load from localStorage for unauthenticated users
      const storedCart = localStorage.getItem("cartItems");
      if (storedCart) {
        try {
          dispatch({ type: "SET_CART_ITEMS", payload: JSON.parse(storedCart) });
        } catch (e) {
          console.error("Error parsing stored cart:", e);
          dispatch({ type: "SET_CART_ITEMS", payload: {} });
        }
      }
      return;
    }
    
    try {
      console.log("Loading cart with token:", token.substring(0, 15) + "...");
      
      // Try loading from server for authenticated users
      const response = await api.post("/cart/get", { userid: userId });
      
      console.log("Cart data received:", response.data);
      
      if (response.data.success && response.data.cartData) {
        dispatch({ type: "SET_CART_ITEMS", payload: response.data.cartData });
        // Sync with localStorage
        localStorage.setItem("cartItems", JSON.stringify(response.data.cartData));
      } else {
        // If server doesn't return cart, fallback to localStorage
        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
          dispatch({ type: "SET_CART_ITEMS", payload: JSON.parse(storedCart) });
        }
      }
    } catch (error) {
      console.error("Error loading cart from server:", error);
      
      // Fallback to localStorage if server request fails
      const storedCart = localStorage.getItem("cartItems");
      if (storedCart) {
        try {
          dispatch({ type: "SET_CART_ITEMS", payload: JSON.parse(storedCart) });
        } catch (e) {
          console.error("Error parsing stored cart:", e);
          dispatch({ type: "SET_CART_ITEMS", payload: {} });
        }
      }
    }
  };

  const loadWishlist = async (token = state.token) => {
    if (!token) {
      console.log("No token provided for wishlist fetch");
      return;
    }
    
    try {
      console.log("Loading wishlist with token:", token.substring(0, 15) + "...");
      
      // Use the correct endpoint - /wishlist/items not /wishlist
      const response = await api.get("/wishlist/items", {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "token": token 
        }
      });
      
      console.log("Wishlist data received:", response.data);
      
      if (response.data.success) {
        // Extract item IDs from the returned items array
        const wishlistIds = response.data.items.map(item => item._id);
        dispatch({ type: "SET_WISHLIST", payload: wishlistIds });
        
        // Save wishlist to localStorage for persistence
        localStorage.setItem("wishlist", JSON.stringify(wishlistIds));
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
      
      // Try to load from localStorage as fallback
      const storedWishlist = localStorage.getItem("wishlist");
      if (storedWishlist) {
        dispatch({ type: "SET_WISHLIST", payload: JSON.parse(storedWishlist) });
      }
    }
  };

  // Add this new function to extract and set user information
  const setUserInfo = (userData) => {
    dispatch({ type: "SET_USER", payload: userData });
    if (userData?._id) {
      localStorage.setItem("userId", userData._id);
    }
  };

  useEffect(() => {
    console.log("StoreProvider mounted, fetching items...");
    fetchFood();
    fetchTool();
    
    // Always try to load wishlist from localStorage first
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      try {
        const parsedWishlist = JSON.parse(storedWishlist);
        dispatch({ type: "SET_WISHLIST", payload: parsedWishlist });
        console.log("Initialized wishlist from localStorage:", parsedWishlist);
      } catch (err) {
        console.error("Error parsing stored wishlist:", err);
      }
    }
    
    // Try to load user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch({ type: "SET_USER", payload: JSON.parse(storedUser) });
    }
  }, []);

  useEffect(() => {
    console.log("Component mounted, loading cart...");
    loadCart(); // This will handle both authenticated and unauthenticated users
    
    // Only load wishlist if authenticated
    if (state.token && state.token.trim() !== "") {
      console.log("Token found, loading wishlist from server...");
      fetchWishlist();
    }

    // Add authentication event listeners
    const handleAuthLogout = (event) => {
      console.log('Auth logout event received:', event.detail);
      clearToken();
      safeToast('Session expired. Please login again.', 'warn');
    };

    window.addEventListener('auth-logout', handleAuthLogout);

    // Cleanup event listener
    return () => {
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, []);

  // Make sure cart is reloaded when token changes
  useEffect(() => {
    console.log("Token changed, reloading cart and wishlist...");
    loadCart(); // This will handle both authenticated and unauthenticated users
    
    // Only load wishlist if authenticated
    if (state.token && state.token.trim() !== "") {
      fetchWishlist();
    }
  }, [state.token]);

  return (
    <storeContext.Provider
      value={{
        ...state,
        setToken,
        clearToken,
        addtoCart,
        removeCart,
        clearCart,
        toggleWishlistItem,
        fetchFood,
        fetchTool,
        loadCart,
        loadWishlist,
        fetchWishlist,
        loading,
        setUserInfo,
        input,
        setInput,
        food_list,
        setFoodList,
        tool_list,
        setToolList,
      }}
    >
      {children}
    </storeContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(storeContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
