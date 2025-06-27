/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { toast } from "react-toastify";
import axios from "axios";
import {
  FaUsers,
  FaShoppingCart,
  FaMoneyBillWave,
  FaStar,
  FaBox,
  FaTools,
} from "react-icons/fa";
import api from "../utils/axiosConfig";
import "./AdminDashboard.css";
import { useStore } from "../pages/redux/context/storeContext";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalTools: 0,
    totalRevenue: 0,
    averageRating: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [],
  });
  const [topSellers, setTopSellers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [timePeriod, setTimePeriod] = useState("1month");
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  });
  const [bestSellers, setBestSellers] = useState([]);
  const [salesData, setSalesData] = useState([]);

  // Define chartOptions BEFORE it's used in barChartOptions
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  // Modify the timePeriod state and handler to prevent page reloads
  const handleTimePeriodChange = (e) => {
    e.preventDefault(); // Prevent default to avoid page reload
    setTimePeriod(e.target.value);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard statistics - updated to use the correct endpoint
        try {
          const statsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard-stats`);
          if (statsRes.data.success) {
            const data = statsRes.data.data || {};
            setStats({
              totalUsers: data.totalUsers || 0,
              totalProducts: data.totalProducts || 0,
              totalTools: data.totalTools || 0,
              totalRevenue: data.totalRevenue || 0,
              averageRating: 4.5, // Placeholder until you have a real rating system
            });
          }
        } catch (error) {
          console.error("Error fetching dashboard stats:", error);
        }

        // Fetch order count explicitly since it might not be included in dashboard-stats
        try {
          const orderCountRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/order/count`);
          if (orderCountRes.data.success) {
            setStats(prev => ({
              ...prev,
              totalOrders: orderCountRes.data.count || 0
            }));
          }
        } catch (error) {
          console.error("Error fetching order count:", error);
        }

        // Fetch real revenue data
        try {
          const revenueRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/order/list`);
          console.log("Revenue data response:", revenueRes.data);
          
          if (revenueRes.data.success && Array.isArray(revenueRes.data.allOrders)) {
            // Process orders to create a revenue timeline
            const orders = revenueRes.data.allOrders;
            
            // Filter orders based on selected time period
            const now = new Date();
            let filteredOrders = orders;
            let daysToShow = 30; // Default to 30 days (1month)
            
            if (timePeriod === '1week') {
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              filteredOrders = orders.filter(order => new Date(order.createdAt) >= weekAgo);
              daysToShow = 7;
            } else if (timePeriod === '3months') {
              const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
              filteredOrders = orders.filter(order => new Date(order.createdAt) >= threeMonthsAgo);
              daysToShow = 90;
            } else if (timePeriod === '6months') {
              const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
              filteredOrders = orders.filter(order => new Date(order.createdAt) >= sixMonthsAgo);
              daysToShow = 180;
            } else if (timePeriod === '1year') {
              const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
              filteredOrders = orders.filter(order => new Date(order.createdAt) >= yearAgo);
              daysToShow = 365;
            } else {
              // 1month (default)
              const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              filteredOrders = orders.filter(order => new Date(order.createdAt) >= monthAgo);
              daysToShow = 30;
            }
            
            // Create appropriate dates for selected period
            const dateLabels = [...Array(daysToShow)].map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (daysToShow - 1 - i));
              return date.toISOString().split('T')[0];
            });
            
            // Initialize revenue data for each day with 0
            const dailyRevenue = {};
            dateLabels.forEach(day => {
              dailyRevenue[day] = 0;
            });
            
            // Sum up revenue by day for the filtered orders
            filteredOrders.forEach(order => {
              if (!order.createdAt) return;
              
              const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
              if (dailyRevenue.hasOwnProperty(orderDate)) {
                dailyRevenue[orderDate] += (order.amount || 0);
              }
            });
            
            // Format labels for better display
            const formattedLabels = Object.keys(dailyRevenue).map(date => {
              const d = new Date(date);
              return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            });
            
            // Create chart data
            setRevenueData({
              labels: formattedLabels,
              datasets: [
                {
                  label: "Daily Revenue",
                  data: Object.values(dailyRevenue),
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderColor: "rgba(75, 192, 192, 1)",
                  fill: true,
                  tension: 0.4,
                },
              ],
            });
          } else {
            // Fallback to sample data if API response is not as expected
            const sampleLabels = last7Days();
            const sampleData = generateRandomData(7, 1000, 10000);
            
            setRevenueData({
              labels: sampleLabels,
              datasets: [
                {
                  label: "Revenue Generated",
                  data: sampleData,
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderColor: "rgba(75, 192, 192, 1)",
                  fill: true,
                  tension: 0.4,
                },
              ],
            });
          }
        } catch (error) {
          console.error("Error fetching revenue data:", error);
          // Fallback to sample data
          const sampleLabels = last7Days();
          const sampleData = generateRandomData(7, 1000, 10000);
          
          setRevenueData({
            labels: sampleLabels,
            datasets: [
              {
                label: "Revenue Generated",
                data: sampleData,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                fill: true,
                tension: 0.4,
              },
            ],
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
        toast.error("Failed to load dashboard data.");
      }
    };

    fetchDashboardData();
  }, [timePeriod]);

  // Helper function to get last 7 days as labels
  const last7Days = () => {
    return [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
  };

  // Helper function to generate random data for fallback
  const generateRandomData = (count, min, max) => {
    return [...Array(count)].map(() => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // First try to fetch and analyze orders from list endpoint for accurate status counts
        let orderStatusCounts = {
          pending: 0,
          processing: 0,
          completed: 0,
          delivered: 0,
          cancelled: 0
        };
        
        try {
          const ordersRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/order/list`);
          if (ordersRes.data.success && Array.isArray(ordersRes.data.allOrders)) {
            const orders = ordersRes.data.allOrders;
            
            // Detailed status counting for better pie chart
            orders.forEach(order => {
              const status = (order.status || '').toLowerCase();
              
              if (status === 'pending') {
                orderStatusCounts.pending++;
              } else if (status === 'processing' || status === 'food processing') {
                orderStatusCounts.processing++;
              } else if (status === 'completed') {
                orderStatusCounts.completed++;
              } else if (status === 'delivered') {
                orderStatusCounts.delivered++;
              } else if (status === 'cancelled') {
                orderStatusCounts.cancelled++;
              } else {
                // For any unrecognized status, count as pending
                orderStatusCounts.pending++;
              }
            });
            
            // Set order stats for the UI
            setOrderStats({
              totalOrders: orders.length,
              pendingOrders: orderStatusCounts.pending + orderStatusCounts.processing,
              completedOrders: orderStatusCounts.completed + orderStatusCounts.delivered,
              cancelledOrders: orderStatusCounts.cancelled
            });
            
            // Also get a sample of recent orders for the table
            const recentOrdersData = orders
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 10)
              .map(order => ({
                _id: order._id || 'unknown',
                userId: { 
                  name: order.address?.firstName 
                    ? `${order.address.firstName} ${order.address.lastName || ''}`
                    : "Guest User"
                },
                totalAmount: order.totalAmount || order.amount || 0,
                status: order.status || 'pending',
                createdAt: order.createdAt || new Date()
              }));
            
            setRecentOrders(recentOrdersData);
          }
        } catch (error) {
          console.error('Error fetching orders list:', error);
          
          // Fall back to stats endpoint if list fails
          try {
            const statsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/order/stats`);
            if (statsResponse.data.success) {
              setOrderStats({
                totalOrders: statsResponse.data.total || 0,
                pendingOrders: statsResponse.data.pending || 0,
                completedOrders: statsResponse.data.completed || 0,
                cancelledOrders: statsResponse.data.cancelled || 0
              });
            }
          } catch (statsError) {
            console.error('Error fetching order stats:', statsError);
          }
        }
      } catch (error) {
        console.error('Error in fetchOrderData:', error);
      }
    };

    // Updated to fetch real top selling products data
    const fetchTopProducts = async () => {
      try {
        console.log('Fetching top selling products...');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/list`);
        
        if (response.data && (response.data.success || Array.isArray(response.data.message) || Array.isArray(response.data))) {
          // Extract products array from response
          const products = response.data.message || response.data || [];
          
          // Get all orders to calculate product sales
          const ordersRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/order/list`);
          const orders = ordersRes.data.allOrders || [];
          
          // Create a map to count sales by product
          const productSalesMap = {};
          
          // Process orders to count item sales
          orders.forEach(order => {
            if (Array.isArray(order.items)) {
              order.items.forEach(item => {
                const productId = item._id || item.productId;
                if (productId) {
                  // Count each item based on quantity
                  const quantity = item.quantity || 1;
                  productSalesMap[productId] = (productSalesMap[productId] || 0) + quantity;
                }
              });
            }
          });
          
          // Match sales counts with product details
          const productsWithSales = products.map(product => ({
            name: product.name || "Unknown Product",
            sales: productSalesMap[product._id] || 0,
            _id: product._id
          }));
          
          // Sort by sales (highest first) and take top 5
          const topSellingProducts = productsWithSales
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);
            
          console.log('Top selling products:', topSellingProducts);
          
          // If we found products with sales, use them
          if (topSellingProducts.length > 0) {
            setBestSellers(topSellingProducts);
          } else {
            // Fallback to existing sample data if no sales found
            console.log('No sales data found, using sample data');
            setBestSellers([
              { name: "Organic Tomatoes", sales: 120 },
              { name: "Fresh Carrots", sales: 95 },
              { name: "Premium Rice", sales: 85 },
              { name: "Potatoes", sales: 70 },
              { name: "Onions", sales: 65 }
            ]);
          }
        }
      } catch (error) {
        console.error('Error fetching top products:', error);
        // Fallback to sample data
        setBestSellers([
          { name: "Organic Tomatoes", sales: 120 },
          { name: "Fresh Carrots", sales: 95 },
          { name: "Premium Rice", sales: 85 },
          { name: "Potatoes", sales: 70 },
          { name: "Onions", sales: 65 }
        ]);
      }
    };

    // Updated to calculate real monthly sales data from orders
    const fetchMonthlySales = async () => {
      try {
        console.log('Fetching monthly sales data...');
        const ordersRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/order/list`);
        const orders = ordersRes.data.allOrders || [];
        
        if (orders.length > 0) {
          // Create a map of month names
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          
          // Get current year
          const currentYear = new Date().getFullYear();
          
          // Initialize monthly totals with 0 for each month
          const monthlySales = Array(12).fill(0);
          
          // Process orders to sum amounts by month
          orders.forEach(order => {
            if (order.createdAt && order.amount) {
              const orderDate = new Date(order.createdAt);
              const orderYear = orderDate.getFullYear();
              
              // Only count orders from current year
              if (orderYear === currentYear) {
                const month = orderDate.getMonth(); // 0-11
                monthlySales[month] += order.amount;
              }
            }
          });
          
          // Get labels for months with sales
          const monthsWithSales = [];
          const salesAmounts = [];
          
          monthlySales.forEach((amount, index) => {
            if (amount > 0 || index <= new Date().getMonth()) {
              monthsWithSales.push(monthNames[index]);
              salesAmounts.push(amount);
            }
          });
          
          console.log('Monthly sales data:', monthsWithSales, salesAmounts);
          
          // If we have sales data, use it
          if (monthsWithSales.length > 0) {
            setSalesData({
              labels: monthsWithSales,
              data: salesAmounts
            });
          } else {
            // Fallback to sample data if no sales found
            setSalesData({
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              data: [2500, 3200, 2800, 4100, 3700, 4500]
            });
          }
        } else {
          // Fallback to sample data if no orders found
          setSalesData({
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            data: [2500, 3200, 2800, 4100, 3700, 4500]
          });
        }
      } catch (error) {
        console.error('Error fetching monthly sales data:', error);
        // Fallback to sample data
        setSalesData({
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          data: [2500, 3200, 2800, 4100, 3700, 4500]
        });
      }
    };

    // Execute all fetches
    fetchOrderData();
    fetchTopProducts();
    fetchMonthlySales();
  }, []);

  // Ensure we have fallback data if the API calls fail
  const salesChartData = {
    labels: salesData.labels || ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Sales (₹)",
        data: salesData.data || Array(6).fill(0),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.2)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: "rgb(53, 162, 235)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(53, 162, 235)",
        pointRadius: 4,
        pointHoverRadius: 6
      },
    ],
  };

  // Update the bestSellersChartData with different colors for each bar
  const bestSellersChartData = {
    labels: bestSellers.length 
      ? bestSellers.map((item) => item.name || "Unknown")
      : ["No Data Available"],
    datasets: [
      {
        label: "Sales Quantity",
        data: bestSellers.length 
          ? bestSellers.map((item) => item.sales || 0)
          : [0],
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(153, 102, 255, 0.7)"
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)"
        ],
        borderWidth: 1
      },
    ],
  };

  // Now define barChartOptions after chartOptions is defined
  const barChartOptions = {
    ...chartOptions,
    indexAxis: 'y', // Makes the bar chart horizontal for better readability
    scales: {
      y: {
        grid: {
          display: false,
        }
      },
      x: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      }
    },
  };

  const orderStatusData = {
    labels: ["In Progress", "Completed", "Cancelled"],
    datasets: [
      {
        data: [
          orderStats.pendingOrders || 0,
          orderStats.completedOrders || 0,
          orderStats.cancelledOrders || 0
        ],
        backgroundColor: [
          "rgba(255, 159, 64, 0.7)",  // Orange for in-progress
          "rgba(75, 192, 192, 0.7)",  // Green for completed
          "rgba(255, 99, 132, 0.7)"   // Red for cancelled
        ],
        borderColor: [
          "rgba(255, 159, 64, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)"
        ],
        borderWidth: 1
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaUsers className="text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Users</h3>
              <p className="text-2xl font-semibold">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaShoppingCart className="text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Orders</h3>
              <p className="text-2xl font-semibold">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaBox className="text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Products</h3>
              <p className="text-2xl font-semibold">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaTools className="text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Tools</h3>
              <p className="text-2xl font-semibold">{stats.totalTools}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <FaMoneyBillWave className="text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Revenue</h3>
              <p className="text-2xl font-semibold">₹{stats.totalRevenue}</p>
            </div>
          </div>
        </div>

        {/* Removed Average Rating card */}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-header">
            <h2 className="chart-title">Revenue Trend</h2>
            <select
              className="time-period-selector"
              value={timePeriod}
              onChange={handleTimePeriodChange}  // Use the new handler
            >
              <option value="1week">Last Week</option>
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
          <div className="chart-wrapper">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>

        {/* Order Status Pie Chart - Now with better labels and colors */}
        <div className="chart-container">
          <div className="chart-header">
            <h2 className="chart-title">Order Status</h2>
          </div>
          <div className="chart-wrapper">
            <Pie data={orderStatusData} options={{
              ...pieChartOptions,
              plugins: {
                ...pieChartOptions.plugins,
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = Math.round((value / total) * 100);
                      return `${label}: ${value} (${percentage}%)`;
                    }
                  }
                }
              }
            }} />
          </div>
        </div>

        {/* Updated Top Selling Products Chart with horizontal bars */}
        <div className="chart-container">
          <div className="chart-header">
            <h2 className="chart-title">Top Selling Products</h2>
          </div>
          <div className="chart-wrapper">
            <Bar data={bestSellersChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Updated Monthly Sales Chart with better styling */}
        <div className="chart-container">
          <div className="chart-header">
            <h2 className="chart-title">Monthly Sales</h2>
          </div>
          <div className="chart-wrapper">
            <Line data={salesChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <tr key={order._id || Math.random().toString()}>
                  <td>{order._id ? order._id.slice(-6) : 'N/A'}</td>
                  <td>{order.userId?.name || "Guest User"}</td>
                  <td>₹{order.totalAmount || order.amount || 0}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        order.status?.toLowerCase() === "completed" || order.status?.toLowerCase() === "delivered" 
                          ? "status-completed" 
                          : order.status?.toLowerCase() === "cancelled" 
                            ? "status-cancelled" 
                            : "status-pending"
                      }`}
                    >
                      {order.status || 'Processing'}
                    </span>
                  </td>
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">No recent orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
