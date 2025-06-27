import { Header } from './components/Header';
import './App.css';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Products } from './pages/Products';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { About } from './pages/About';
import { Schemes } from './pages/Schemes';
import { Signup } from './pages/Signup';
import React, { useState } from 'react';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar'; // Make sure this matches the export
import { Add } from './components/Add';
import List from './components/List';
import { Order } from './pages/Order';
import Cart from './pages/Cart';
import Verify from './pages/Verify';
import MyOrders from './pages/Myorders';
import ManageUser from './pages/ManageUser';
import Aorder from './pages/Aorders';
import { Empty } from './components/Empty';
import { AddTool } from './components/AddTool';
import ListTool from './components/ListTool';
import { Articles } from './pages/Articles';
import { ToastContainer, toast } from 'react-toastify';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerRevenue from './pages/FarmerRevenue';
import 'react-toastify/dist/ReactToastify.css';
import FeedbackList from './components/FeedbackList';
import AdminDashboard from './pages/AdminDashboard';
import SellProducts from './pages/SellProducts';
import SellTools from './pages/SellTools';
import Wishlist from './pages/Wishlist';
import { useSelector } from "react-redux";
import { StoreProvider } from "./pages/redux/context/storeContext";
import { Provider } from "react-redux";
import { store } from "./pages/redux/store"; 
import NetworkStatus from './components/NetworkStatus';

// Removed global toast assignment
// Separate component for the app content that uses useLocation
const AppContent = () => {
  const [category, setCategory] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  // Toggle sidebar function
  const toggleSidebar = () => {
    console.log('Toggle sidebar called. Current state:', isSidebarOpen);
    setIsSidebarOpen(prev => {
      console.log('New sidebar state:', !prev);
      return !prev;
    });
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <Header onMenuClick={toggleSidebar} />
      <div className="flex-1 overflow-auto">
        <main className="p-4">
          <Routes>
            <Route
              path="/"
              element={<Home category={category} setCategory={setCategory} />}
            />
            <Route
              path="/Market"
              element={<Products category={category} setCategory={setCategory} />}
            />
            <Route path="/About" element={<About />} />
            <Route path="/Schemes" element={<Schemes />} />
            <Route path="/Articles" element={<Articles />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/farmerdashboard" element={<FarmerDashboard />} />
              <Route path="/farmerrevenue" element={<FarmerRevenue />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/empty" element={<Empty />} />
              <Route path="/order" element={<Order />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/myorders" element={<MyOrders />} />
              <Route path="/sell-products" element={<SellProducts />} />
              <Route path="/sell-tools" element={<SellTools />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Route>
            <Route path="/add" element={<Add />} />
            <Route path="/addtool" element={<AddTool />} />
            <Route path="/list" element={<List />} />
            <Route path="/listtool" element={<ListTool />} />
            <Route path="/orders" element={<Aorder />} />
            <Route path="/manage-users" element={<ManageUser />} />
            <Route path="/feedbacks" element={<FeedbackList />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <StoreProvider>
        <BrowserRouter>
          <>
            <ToastContainer 
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable={false}
              pauseOnHover={false}
              limit={3}
              theme="light"
            />
            <AppContent />
            <NetworkStatus />
          </>
        </BrowserRouter>
      </StoreProvider>
    </Provider>
  );
}

export default App;
