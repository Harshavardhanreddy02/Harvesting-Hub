import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaCalendar, FaBox, FaTag, FaMapMarkerAlt, FaMinus, FaPlus, FaStar, FaRegStar } from 'react-icons/fa';
import axios from 'axios';

const ItemDetailsModal = ({ item, onClose, onAddToCart, isInCart, cartQuantity }) => {
  const [sellerInfo, setSellerInfo] = useState(null);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        // Check for email field in the item (from updated model)
        const sellerIdentifier = item.email || item.seller_email || item.seller_id;
        
        if (!sellerIdentifier) {
          console.log('No seller information available for this item');
          setIsLoading(false);
          return;
        }
        
        let sellerData = null;
        
        // Try to fetch from either email or ID
        if (item.email || item.seller_email) {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/by-email?email=${item.email || item.seller_email}`);
          sellerData = response.data;
        } else if (item.seller_id) {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${item.seller_id}`);
          sellerData = response.data;
        }
        
        setSellerInfo(sellerData);
        
        // Fetch average rating
        const ratingResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/rating/${item.seller_id}`);
        setRating(ratingResponse.data.averageRating || 0);
        
        // Fetch user's rating if logged in
        const token = localStorage.getItem('token');
        if (token) {
          const userRatingResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/rating/user/${item.seller_id}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          setUserRating(userRatingResponse.data.rating || 0);
        }
      } catch (error) {
        console.error('Error fetching seller info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellerInfo();
  }, [item]);

  const handleRating = async (newRating) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to rate this seller');
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/rating`,
        { sellerId: item.seller_id, rating: newRating },
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      
      setUserRating(newRating);
      
      // Update average rating
      const ratingResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/rating/${item.seller_id}`);
      setRating(ratingResponse.data.averageRating || 0);
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image and Basic Info */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="w-full md:w-1/2">
              <img 
                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item.image}`}
                alt={item.name || "Product"}
                className="modal-image"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loops
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='100' y='100' font-size='16' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex items-center gap-2">
                <FaTag className="text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">₹{item.price}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <FaUser className="text-gray-400" />
                <span>Listed by {item.seller_name || item.seller || "farmer"}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <FaCalendar className="text-gray-400" />
                <span>Listed at IIIT Sri City</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <FaBox className="text-gray-400" />
                <span>{item.stock || item.stockQuantity || 0} units in stock</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <FaMapMarkerAlt className="text-gray-400" />
                <span>IIIT Sri City, Andhra Pradesh</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Product Details</h4>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600">Category: {item.category || 'Not specified'}</li>
                <li className="text-sm text-gray-600">Status: {item.status || 'On Sale'}</li>
                <li className="text-sm text-gray-600">Stock: {item.stockQuantity || item.stock || 'Not specified'}</li>
                {item.discount > 0 && (
                  <li className="text-sm text-gray-600">Discount: {item.discount}%</li>
                )}
                {item.createdAt && (
                  <li className="text-sm text-gray-600">Listed: {new Date(item.createdAt).toLocaleDateString()}</li>
                )}
                {item.manufacturedDate && (
                  <li className="text-sm text-gray-600">Manufactured: {new Date(item.manufacturedDate).toLocaleDateString()}</li>
                )}
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Seller Information</h4>
              {isLoading ? (
                <p>Loading seller information...</p>
              ) : (
                <div className="space-y-2">
                  <p>Name: {sellerInfo?.user_name || item.seller || item.email || 'farmer'}</p>
                  <div className="flex items-center gap-2">
                    <span>Rating: </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(star)}
                          className="text-yellow-400"
                        >
                          {star <= rating ? <FaStar /> : <FaRegStar />}
                        </button>
                      ))}
                      <span className="ml-2">({rating.toFixed(1)})</span>
                    </div>
                  </div>
                  {sellerInfo?.createdAt ? (
                    <p>Member since: {formatDate(sellerInfo?.createdAt)}</p>
                  ) : (
                    <p>Location: IIIT Sri City, Andhra Pradesh</p>
                  )}
                  {item.email && !sellerInfo?.email && (
                    <p>Contact: {item.email}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Close
          </button>
          {isInCart ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAddToCart(-1)}
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
              >
                <FaMinus />
              </button>
              <span className="px-4 py-2 bg-gray-100 rounded-lg">{cartQuantity}</span>
              <button
                onClick={() => onAddToCart(1)}
                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                disabled={cartQuantity >= item.stock}
              >
                <FaPlus />
              </button>
            </div>
          ) : (
            <button
              onClick={onAddToCart}
              disabled={item.stock === 0}
              className={`px-4 py-2 rounded-lg ${
                item.stock === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsModal;