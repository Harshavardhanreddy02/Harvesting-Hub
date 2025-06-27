/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import './Myorders.css';
import axios from 'axios';
import { storeContext } from './redux/context/storeContext';
import { assets } from './../../frontend_assets/assets';
import { useSelector } from 'react-redux';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [counts, setCounts] = useState({
    totalOrders: 0,
    countLast60Min: 0,
    countLast2Days: 0,
    countLast1Week: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('totalOrders');
  const { token } = useContext(storeContext);
  const { currentUser } = useSelector((state) => state.user);
  const url = import.meta.env.VITE_BACKEND_URL;

  // Fetch Orders Function
  const fetchOrders = async (filter) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching orders with token:", token);
      console.log("Current user:", currentUser?._id);
      
      const response = await axios.post(
        `${url}/api/order/userorders`,
        { userid: currentUser?._id }, // Send user ID in the request body
        { 
          headers: { 
            "Authorization": `Bearer ${token}`,
            "token": token 
          } 
        }
      );
      
      console.log("Order response:", response.data);
      
      if (response.data.success) {
        // Set counts and filter data based on selected filter
        const { totalOrders, countLast60Min, countLast2Days, countLast1Week, orders } = response.data.message;
        setCounts({ totalOrders, countLast60Min, countLast2Days, countLast1Week });

        // Sort the orders by createdAt in descending order (newest first)
        const sortedOrders = orders.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        let filteredData = sortedOrders;
        if (filter === 'countLast60Min') {
          filteredData = sortedOrders.filter(order => 
            new Date(order.createdAt) >= new Date(Date.now() - 60 * 60 * 1000)
          );
        } else if (filter === 'countLast2Days') {
          filteredData = sortedOrders.filter(order => 
            new Date(order.createdAt) >= new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          );
        } else if (filter === 'countLast1Week') {
          filteredData = sortedOrders.filter(order => 
            new Date(order.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          );
        }
        
        setData(filteredData);
        console.log("Filtered and sorted orders:", filteredData);
      } else {
        setError(response.data.message || "Failed to fetch orders");
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to fetch orders");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && currentUser?._id) {
      fetchOrders(selectedFilter);
    }
  }, [token, currentUser, selectedFilter]);

  if (loading) {
    return <div className="text-center p-5">Loading your orders...</div>;
  }

  if (error) {
    return <div className="text-center p-5 text-red-500">Error: {error}</div>;
  }

  return (
    <div className='my-orders'>
      <h2 className='text-blue-500 text-center mb-2 text-3xl'>My Orders</h2>
      <div className="filter-options">
        <label>Filter by: </label>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="totalOrders">Total Orders ({counts.totalOrders})</option>
          <option value="countLast60Min">Last 60 Minutes ({counts.countLast60Min})</option>
          <option value="countLast2Days">Last 2 Days ({counts.countLast2Days})</option>
          <option value="countLast1Week">Last 1 Week ({counts.countLast1Week})</option>
        </select>
      </div>
      <div className="container">
        {data.length > 0 ? (
          data.map((order, index) => (
            <div key={order._id || index} className='my-orders-order bg-orange-200 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-4 hover:border-blue-400 hover:bg-orange-300'>
              <img src={assets.parcel_icon} alt="" />
              <p>
                {Array.isArray(order.items) && order.items.length > 0 
                  ? order.items.map((item, idx) => 
                      `${item.name || 'Product'} x ${item.quantity}${idx < order.items.length - 1 ? ', ' : ''}`)
                  : 'Order Items'}
              </p>
              <p>Rs {order.amount || order.totalAmount || 0}.00/-</p>
              <p>Items: {order.items?.length || 0}</p>
              <p><span>&#x25cf;</span> <b>{order.status || 'Processing'}</b></p>
              <button>Track Order</button>
            </div>
          ))
        ) : (
          <p className='text-2xl text-red-600 text-center'>No orders found for the selected filter.</p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
