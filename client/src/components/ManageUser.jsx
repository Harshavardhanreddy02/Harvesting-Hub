import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar';
import './ManageUser.css';
import api from '../utils/axiosConfig';

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    password: ''
  });

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log("Submitting user data:", userData);
      
      // Map frontend role names to backend role names if necessary
      let formattedUserData = { ...userData };
      
      // Map 'Customer' to 'customer' (lowercase) if needed
      if (formattedUserData.role === 'Customer') {
        formattedUserData.role = 'customer';
      } else if (formattedUserData.role === 'Farmer') {
        formattedUserData.role = 'farmer';
      } else if (formattedUserData.role === 'Admin') {
        formattedUserData.role = 'admin';
      }
      
      console.log("Formatted user data:", formattedUserData);
      
      // Continue with the API call using the formatted data
      const response = await api.post('/admin/users', formattedUserData);
      
      if (response.data.success) {
        toast.success('User saved successfully');
        fetchUsers(); // Refresh user list
        setUserData(initialUserData); // Reset form
        setIsModalOpen(false); // Close modal
      } else {
        console.error('Error saving user:', response.data);
        toast.error(response.data.message || 'Failed to save user');
      }
    } catch (error) {
      console.error('Error saving user:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to save user');
    }
  };

  const handleEdit = (user) => {
    setUserData(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      if (response.data.success) {
        toast.success('User deleted successfully');
        fetchUsers(); // Refresh user list
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const initialUserData = {
    name: '',
    email: '',
    role: '',
    password: ''
  };

  return (
    <div className="flex items-start gap-12">
      <Sidebar />
      <div className="mr-20 ml-60">
        <div className="manage-user p-10">
          <div className="flex justify-between items-center mb-6">
            <p className="font-bold text-red-600 text-xl">Manage Users</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Add User
            </button>
          </div>
          <div className="user-table mx-16">
            <div className="user-table-format title">
              <b className="mx-16 text-2xl">Name</b>
              <b className="mx-16 text-2xl">Email</b>
              <b className="mx-4 text-2xl">Role</b>
              <b className="-mx-4 text-2xl">Actions</b>
            </div>
            {users.map((user, idx) => (
              <div
                key={idx}
                className="user-table-format transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-4 hover:border-blue-400 hover:bg-blue-200"
              >
                <p className="mx-20">{user.name}</p>
                <p className="mx-12">{user.email}</p>
                <p>{user.role}</p>
                <div className="actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="remove-button"
                    onClick={() => handleDelete(user._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </span>
            <h2>{userData._id ? 'Edit User' : 'Add User'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="customer">Customer</option>
                  <option value="farmer">Farmer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                {userData._id ? 'Update' : 'Add'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUser;