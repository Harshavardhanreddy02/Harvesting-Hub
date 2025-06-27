/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, updateUserAsync } from "./redux/user/userSlice";
import "./Profile.css";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { FaUser, FaShoppingCart, FaStar, FaEdit, FaSave } from 'react-icons/fa';
import api from '../utils/axiosConfig';
import axios from 'axios'; // Add the missing axios import

export default function Profile() {
  const token = localStorage.getItem("token");
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const [userName, setUserName] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [personalPhone, setPersonalPhone] = useState("");
  const [personalAddress, setPersonalAddress] = useState("");
  const [userRole, setUserRole] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [gstin, setGstin] = useState("");
  const [aboutBusiness, setAboutBusiness] = useState("");

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile data
  const fetchUserProfile = async () => {
    if (!token) {
      console.error('No token available for fetching user profile');
      return;
    }

    try {
      // First try to use the current user data from Redux if available
      if (currentUser && Object.keys(currentUser).length > 0) {
        console.log('Using current user data from Redux:', currentUser);
        
        // Update local state from Redux store
        setUserName(currentUser.user_name || currentUser.name || '');
        setPersonalEmail(currentUser.email || '');
        setPersonalPhone(currentUser.contact_number || currentUser.phone || '');
        setPersonalAddress(currentUser.personal_address || currentUser.address || '');
        setUserRole(currentUser.role || '');
        
        // Business fields
        setBusinessName(currentUser.business_name || '');
        setBusinessEmail(currentUser.business_email || '');
        setBusinessPhone(currentUser.business_contact_number || '');
        setBusinessAddress(currentUser.business_address || '');
        setAccountNumber(currentUser.business_account_number || '');
        setGstin(currentUser.business_gstin || '');
        setAboutBusiness(currentUser.business_about || '');
        
        return; // Don't make the API call if we have data
      }

      // If no current user in Redux, try fetching from API
      console.log('Fetching user profile from API with token:', token?.substring(0, 15) + '...');
      
      // Try using a direct axios call instead of the api utility
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/get-profile`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "token": token
        }
      });
      
      console.log('User profile API response:', response.data);

      if (response.data && (response.data.success || response.data.status === 'ok')) {
        const userData = response.data.user || response.data.user_details || response.data.message;
        console.log('Processed user data:', userData);
        
        // Update local state
        setUserName(userData.user_name || userData.name || '');
        setPersonalEmail(userData.email || '');
        setPersonalPhone(userData.contact_number || userData.phone || '');
        setPersonalAddress(userData.personal_address || userData.address || '');
        setUserRole(userData.role || '');
        
        // Business fields
        setBusinessName(userData.business_name || '');
        setBusinessEmail(userData.business_email || '');
        setBusinessPhone(userData.business_contact_number || '');
        setBusinessAddress(userData.business_address || '');
        setAccountNumber(userData.business_account_number || '');
        setGstin(userData.business_gstin || '');
        setAboutBusiness(userData.business_about || '');
        
        // Update Redux store
        dispatch(updateUser({
          ...userData,
          token: token
        }));
      } else {
        console.error('Failed to fetch user profile:', response.data?.message || 'Unknown error');
        // Don't show error toast - just log it
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Try alternative endpoint
      try {
        console.log('Trying alternative endpoint for profile...');
        const altResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "token": token
          }
        });
        
        console.log('Alternative endpoint response:', altResponse.data);
        
        if (altResponse.data && (altResponse.data.success || altResponse.data.status === 'ok')) {
          const userData = altResponse.data.user || altResponse.data.user_details || altResponse.data.message;
          
          // Update local state
          setUserName(userData.user_name || userData.name || '');
          setPersonalEmail(userData.email || '');
          setPersonalPhone(userData.contact_number || userData.phone || '');
          setPersonalAddress(userData.personal_address || userData.address || '');
          setUserRole(userData.role || '');
          
          // Update Redux store
          dispatch(updateUser({
            ...userData,
            token: token
          }));
        }
      } catch (altError) {
        console.error('Error with alternative profile endpoint:', altError);
      }
    }
  };

  // Only fetch user profile once when component mounts
  useEffect(() => {
    // Immediately use currentUser from Redux if available
    if (currentUser && Object.keys(currentUser).length > 0) {
      console.log('Setting profile data from Redux on mount:', currentUser);
      
      setUserName(currentUser.user_name || currentUser.name || '');
      setPersonalEmail(currentUser.email || '');
      setPersonalPhone(currentUser.contact_number || currentUser.phone || '');
      setPersonalAddress(currentUser.personal_address || currentUser.address || '');
      setUserRole(currentUser.role || '');
      
      // Business fields
      setBusinessName(currentUser.business_name || '');
      setBusinessEmail(currentUser.business_email || '');
      setBusinessPhone(currentUser.business_contact_number || '');
      setBusinessAddress(currentUser.business_address || '');
      setAccountNumber(currentUser.business_account_number || '');
      setGstin(currentUser.business_gstin || '');
      setAboutBusiness(currentUser.business_about || '');
    }
    
    // Still try to fetch updated data from the server
    if (token) {
      fetchUserProfile();
    }
  }, [token, currentUser?._id]); // Also re-run if currentUser._id changes

  const handleSaveOrEdit = async () => {
    if (isEditing) {
      // Save changes to the database
      if (!token) {
        console.error('No token available for profile update');
        toast.error('Authentication failed. Please log in again.');
        return;
      }

      // Create regular JSON object (not FormData)
      const userData = {
        user_name: userName,
        email: personalEmail,
        contact_number: personalPhone,
        personal_address: personalAddress,
        business_name: businessName,
        business_email: businessEmail,
        business_contact_number: businessPhone,
        business_address: businessAddress,
        business_account_number: accountNumber,
        business_gstin: gstin,
        business_about: aboutBusiness
      };

      console.log('Sending profile update with data:', userData);

      try {
        // Direct axios call with proper content type
        const response = await axios({
          method: 'post',
          url: `${import.meta.env.VITE_BACKEND_URL}/api/user/update-profile`,
          data: userData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'token': token,
            'Content-Type': 'application/json'
          }
        });

        console.log('Profile update response:', response.data);

        if (response.data.status === "ok" || response.data.success) {
          // Update local state with the new data from response
          const userDetails = response.data.user_details;
          
          if (userDetails) {
            setUserName(userDetails.user_name || userName);
            setPersonalEmail(userDetails.email || personalEmail);
            setPersonalPhone(userDetails.contact_number || personalPhone);
            setPersonalAddress(userDetails.personal_address || personalAddress);
            
            // Update business fields if present
            setBusinessName(userDetails.business_name || businessName);
            setBusinessEmail(userDetails.business_email || businessEmail);
            setBusinessPhone(userDetails.business_contact_number || businessPhone);
            setBusinessAddress(userDetails.business_address || businessAddress);
            setAccountNumber(userDetails.business_account_number || accountNumber);
            setGstin(userDetails.business_gstin || gstin);
            setAboutBusiness(userDetails.business_about || aboutBusiness);
          }
          
          // Update Redux store
          dispatch(updateUser({
            ...userDetails,
            token: token
          }));
          
          toast.success("Profile updated successfully!");
        } else {
          toast.error(response.data.message || "Failed to update profile");
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error("Failed to update profile. Please try again.");
      }
    }

    // Toggle editing state
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "user_name") {
      setUserName(value);
    } else if (name === "personal_email") {
      setPersonalEmail(value);
    } else if (name === "personal_contact_number") {
      setPersonalPhone(value);
    } else if (name === "personal_address") {
      setPersonalAddress(value);
    } else if (name === "business_name") {
      setBusinessName(value);
    } else if (name === "business_email") {
      setBusinessEmail(value);
    } else if (name === "business_contact_number") {
      setBusinessPhone(value);
    } else if (name === "business_address") {
      setBusinessAddress(value);
    } else if (name === "business_account_number") {
      setAccountNumber(value);
    } else if (name === "business_gstin") {
      setGstin(value);
    } else if (name === "business_about") {
      setAboutBusiness(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <FaUser className="text-6xl text-gray-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{userName.charAt(0).toUpperCase() + userName.slice(1)}</h1>
                  <p className="text-lg opacity-90">{userRole}</p>
                </div>
              </div>
              <button
                onClick={handleSaveOrEdit}
                className="bg-white text-green-500 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-6">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    name="user_name"
                    value={userName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="personal_email"
                    value={personalEmail}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="personal_contact_number"
                    value={personalPhone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="personal_address"
                    value={personalAddress}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              {currentUser?.role.toLowerCase() === "farmer" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Name</label>
                      <input
                        type="text"
                        name="business_name"
                        value={businessName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Email</label>
                      <input
                        type="email"
                        name="business_email"
                        value={businessEmail}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Phone</label>
                      <input
                        type="tel"
                        name="business_contact_number"
                        value={businessPhone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Address</label>
                      <input
                        type="text"
                        name="business_address"
                        value={businessAddress}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Number</label>
                      <input
                        type="text"
                        name="business_account_number"
                        value={accountNumber}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">GSTIN</label>
                      <input
                        type="text"
                        name="business_gstin"
                        value={gstin}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">About Your Business</label>
                      <textarea
                        name="business_about"
                        value={aboutBusiness}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        rows="4"
                      ></textarea>
                    </div>
                  </div>
                </>
              )}
              {/* <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                disabled={!isEditing} // Disable button if not in editing mode
              >
                Save Changes
              </button> */}
            </form>
          </div>
        </div>
      </div>

      {showNotification && (
        <div className="notification">{notificationMessage}</div>
      )}
    </div>
  );
}
