/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import "./Aorders.css";
import { Empty } from "../components/Empty";
import { assets } from "./../../frontend_assets/assets";
import Sidebar from "../components/Sidebar";
import { storeContext } from "../pages/redux/context/storeContext";
import axios from "axios";
import { toast } from "react-toastify";

const Aorder = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { token } = useContext(storeContext);

  const handleClose = () => {
    setIsOpen(false);
  };

  const fetchAllOrders = async (filter) => {
    const url = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await axios.get(`${url}/api/order/list`, {
        params: { filter },
      });
      if (response.data.success) {
        const { allMetrics, metrics } = response.data;
        setMetrics(filter === "all" ? allMetrics : metrics[filter]);
        setOrders(
          filter === "all"
            ? response.data.allOrders.reverse()
            : metrics[filter].orders.reverse()
        );
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    const url = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders(selectedFilter);
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    fetchAllOrders(selectedFilter);
  }, [selectedFilter]);

  return (
    <div className="admin-dashboard-container">
      <Sidebar isOpen={isOpen} onClose={handleClose} />
      <div className="absolute ml-52 mr-10 -mt-6">
        <div className="min-w-80 p-10">
          <h3 className="text-center text-3xl">Orders Information</h3>

          <div className="filter-container text-center ml-32 my-4">
            <label>Filter by: </label>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="filter-dropdown"
            >
              <option value="all">All Orders</option>
              <option value="last30Min">Last 30 Minutes</option>
              <option value="last2Hours">Last 2 Hours</option>
              <option value="last1Day">Last 1 Day</option>
              <option value="last1Week">Last 1 Week</option>
            </select>
          </div>

          <div className="metrics-summary-container ">
            <div className="metrics-summary flex gap-96">
              <div className="metric-card">
                <p className="metric-title">Total Orders</p>
                <p className="metric-value">{metrics.totalOrders || 0}</p>
              </div>
              <div className="metric-card">
                <p className="metric-title">Total Revenue</p>
                <p className="metric-value">
                  Rs {metrics.revenueCollected || 0}/-
                </p>
              </div>
              <div className="metric-card">
                <p className="metric-title">Total Stock Sold</p>
                <p className="metric-value">{metrics.itemsSold || 0}</p>
              </div>
            </div>
          </div>

          <div className="order-list">
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <div
                  key={index}
                  className="order-item bg-orange-200 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-4 hover:border-blue-400 hover:bg-orange-300"
                >
                  <img src={assets.parcel_icon} alt="" />
                  <div>
                    <p className="order-item-food">
                      {order.items.map((item, index) => (
                        <span key={index}>
                          {item.name} x {item.quantity}
                          {index < order.items.length - 1 && ", "}
                        </span>
                      ))}
                    </p>
                    <p className="order-item-name">
                      {order.address?.firstName || 'N/A'} {order.address?.lastName || ''}
                    </p>
                    <div className="order-item-address">
                      <p>{order.address?.street || 'N/A'}</p>
                      <p>
                        {order.address?.city || 'N/A'}, {order.address?.state || 'N/A'},{' '}
                        {order.address?.country || 'N/A'}, {order.address?.zipcode || 'N/A'}
                      </p>
                    </div>
                    <p className="order-item-phone">{order.address?.phone || 'N/A'}</p>
                  </div>
                  <p>Items: {order.items?.length || 0}</p>
                  <p className="font-bold">Rs {order.totalAmount || order.amount || 0}/-</p>
                  <select
                    onChange={(e) => statusHandler(e, order._id)}
                    value={order.status || 'Food Processing'}
                    name="status"
                    className="status-select"
                  >
                    <option value="Food Processing">Food Processing</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              ))
            ) : (
              <p className="no-orders-message">
                No orders in the selected filter.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aorder;
