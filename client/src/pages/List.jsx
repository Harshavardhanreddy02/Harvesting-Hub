import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from './redux/context/storeContext';
import { MdArrowBackIosNew } from 'react-icons/md';
import { BiFilter } from 'react-icons/bi';
import api from '../utils/axiosConfig';

const List = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { food_list, tool_list, addtoCart, toggleWishlistItem, wishlist } = useStore();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Function to get URL parameters
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      category: params.get('category'),
      search: params.get('search'),
      type: params.get('type')
    };
  };

  const { category, search, type } = getQueryParams();

  // Determine which list to use based on type parameter
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        console.log(`Fetching items of type: ${type || 'food'}`);
        
        if (type === 'tool') {
          // If type is tool, use tool_list
          console.log(`Using tool_list with ${tool_list.length} items`);
          let filtered = [...tool_list];
          
          // Apply category filter if specified
          if (category && category !== 'all') {
            filtered = filtered.filter(item => 
              item.category && item.category.toLowerCase() === category.toLowerCase()
            );
          }
          
          // Apply search filter if specified
          if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(item => 
              item.name.toLowerCase().includes(searchLower) || 
              (item.description && item.description.toLowerCase().includes(searchLower))
            );
          }
          
          setList(filtered);
        } else {
          // For any other type (or undefined), use food_list
          console.log(`Using food_list with ${food_list.length} items`);
          let filtered = [...food_list];
          
          // If food_list is empty, try fetching from API
          if (filtered.length === 0) {
            console.log("Food list is empty, fetching from API...");
            const response = await api.get('/product/list');
            
            if (response.data && Array.isArray(response.data.message)) {
              filtered = response.data.message;
            } else if (response.data && Array.isArray(response.data)) {
              filtered = response.data;
            }
            
            console.log(`Fetched ${filtered.length} products from API`);
          }
          
          // Apply category filter if specified
          if (category && category !== 'all') {
            filtered = filtered.filter(item => 
              item.category && item.category.toLowerCase() === category.toLowerCase()
            );
          }
          
          // Apply search filter if specified
          if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(item => 
              item.name.toLowerCase().includes(searchLower) || 
              (item.description && item.description.toLowerCase().includes(searchLower))
            );
          }
          
          setList(filtered);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, category, search, food_list, tool_list]);

  const allCategories = [...new Set(list.map(item => item.category).filter(Boolean))];

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleAddToCart = (productId) => {
    addtoCart(productId);
  };

  const handleToggleWishlist = (productId) => {
    toggleWishlistItem(productId);
  };

  const filteredList = selectedCategories.length > 0
    ? list.filter(item => selectedCategories.includes(item.category))
    : list;

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <MdArrowBackIosNew /> Back
        </button>
        
        <h1 className="text-2xl font-bold text-center">
          {type === 'tool' ? 'Tools' : 'Food Products'}
          {category && category !== 'all' ? ` - ${category}` : ''}
          {search ? ` - Search: "${search}"` : ''}
        </h1>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <BiFilter size={20} /> Filter
        </button>
      </div>

      {showFilters && (
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            {allCategories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategories.includes(category)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredList.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredList.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image || 'https://via.placeholder.com/300'} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                  }}
                />
                <button 
                  onClick={() => handleToggleWishlist(item._id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill={wishlist.includes(item._id) ? "red" : "none"} 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    className={`w-5 h-5 ${wishlist.includes(item._id) ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{item.category}</p>
                <p className="text-gray-700 mb-3 line-clamp-2 text-sm">{item.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">₹{item.price}</span>
                  <button 
                    onClick={() => handleAddToCart(item._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default List;
