import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    revenueCollected: 0,
    itemsSold: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      console.log("Fetching all orders...");
      const response = await axios.get(`${url}/api/order/list`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "token": token 
        }
      });
      
      console.log("Orders response:", response.data);
      
      if (response.data && response.data.success) {
        setOrders(response.data.allOrders || []);
        
        // Set metrics
        if (response.data.allMetrics) {
          setMetrics({
            totalOrders: response.data.allMetrics.totalOrders || 0,
            revenueCollected: response.data.allMetrics.revenueCollected || 0,
            itemsSold: response.data.allMetrics.itemsSold || 0
          });
        }
      } else {
        setError("Failed to fetch orders");
        toast.error("Failed to load orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to fetch orders");
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${url}/api/order/status`,
        { orderId, status },
        { 
          headers: { 
            "Authorization": `Bearer ${token}`,
            "token": token 
          } 
        }
      );
      
      if (response.data.success) {
        // Update order status locally
        setOrders(prev => 
          prev.map(order => 
            order._id === orderId 
              ? { ...order, status } 
              : order
          )
        );
        toast.success("Order status updated");
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status");
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center p-5 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Orders Management</h1>
      
      {/* Dashboard metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-blue-800">Total Orders</h3>
          <p className="text-3xl font-bold">{metrics.totalOrders}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-green-800">Total Revenue</h3>
          <p className="text-3xl font-bold">₹{metrics.revenueCollected}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-purple-800">Items Sold</h3>
          <p className="text-3xl font-bold">{metrics.itemsSold}</p>
        </div>
      </div>
      
      {/* Orders list */}
      {orders.length === 0 ? (
        <p className="text-center text-lg">No orders found</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div 
              key={order._id} 
              className="border rounded-lg p-4 shadow-md bg-white transition-transform hover:shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Order Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Order Details</h3>
                  <p><span className="font-medium">Order ID:</span> {order._id}</p>
                  <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                  <p><span className="font-medium">Total Amount:</span> ₹{order.amount}</p>
                  <p><span className="font-medium">Status:</span> {order.status}</p>
                  
                  <div className="mt-2">
                    <label className="font-medium mr-2">Update Status:</label>
                    <select 
                      value={order.status || 'Food Processing'}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="Food Processing">Food Processing</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Customer Info</h3>
                  {order.address ? (
                    <div>
                      <p>{order.address.firstName} {order.address.lastName}</p>
                      <p>{order.address.email}</p>
                      <p>{order.address.street}</p>
                      <p>{order.address.city}, {order.address.state}, {order.address.zipcode}</p>
                      <p>{order.address.country}</p>
                      <p>Phone: {order.address.phone}</p>
                    </div>
                  ) : (
                    <p>No address information available</p>
                  )}
                </div>
              </div>
              
              {/* Items */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Items</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.isArray(order.items) && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap">{item.name || 'Product'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.quantity || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap">₹{item.price || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap">₹{(item.price * item.quantity) || 0}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center">No items found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
