/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Clear search input when user logs out
  useEffect(() => {
    if (!currentUser) {
      setSearchQuery('');
    }
  }, [currentUser]);

  // Debounce function to prevent too many API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const performSearch = async (query) => {
    try {
      if (!query.trim()) {
        // If search is empty, fetch all products/tools
        const endpoint = currentUser?.role === 'Farmer' 
          ? '/api/tool/list'
          : '/api/product/list';

        const response = await axios.get(`http://localhost:3000${endpoint}`);
        
        if (response.data.success) {
          navigate('/Market', { 
            state: { 
              searchResults: response.data.message,
              searchQuery: ""
            }
          });
        }
        return;
      }

      // Determine which endpoint to use based on user role
      const endpoint = currentUser?.role === 'Farmer' 
        ? `/api/tool/search/${query}`
        : `/api/product/search/${query}`;

      const response = await axios.get(`http://localhost:3000${endpoint}`);
      
      if (response.data.success) {
        if (response.data.message.length === 0) {
          // Show appropriate message based on user role
          const message = currentUser?.role === 'Farmer' 
            ? 'No such tool exists'
            : 'No such product exists';
          
          // Navigate to Market with empty results first
          navigate('/Market', { 
            state: { 
              searchResults: [],
              searchQuery: query
            }
          });
          
          // Show toast after navigation
          setTimeout(() => {
            toast.info(message, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }, 100);
          
          return;
        }
        
        // Navigate to the Products page with search results
        navigate('/Market', { 
          state: { 
            searchResults: response.data.message,
            searchQuery: query
          }
        });
      } else {
        toast.error('No results found');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Error performing search');
    }
  };

  // Create debounced search function
  const debouncedSearch = debounce(performSearch, 500);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="bg-slate-100 p-3 rounded-lg flex items-center justify-between">
      <input
        type="text"
        placeholder={currentUser?.role === 'Farmer' ? "Search tools..." : "Search products..."}
        value={searchQuery}
        onChange={handleInputChange}
        className="bg-transparent focus:outline-none w-24 sm:w-72"
      />
      <FaSearch className="text-xl text-slate-600" />
    </div>
  );
};
