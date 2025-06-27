import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar';
import './ListTool.css';
import { assets } from './../../frontend_assets/assets';

// Ensure toast is configured safely
const safeToast = (message, type = 'info') => {
  try {
    switch(type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
      default:
        toast.info(message);
    }
  } catch (error) {
    console.error('Toast error:', error);
  }
};

const ListTool = () => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/api/tool/list`;
  const [list, setList] = useState([]);
  const [editingStock, setEditingStock] = useState(null);
  const [newStock, setNewStock] = useState({});

  const fetchList = async () => {
    const response = await axios.get(url);
    if (response.data.success) {
      setList(response.data.message);
      safeToast('Tool list fetched successfully', 'success');
    } else {
      safeToast('Error fetching tool list', 'error');
    }
  };

  const removeTool = async (id) => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tool/delete/${id}`);
    await fetchList();
    if (response.data.success) {
      safeToast(response.data.message, 'success');
    } else {
      safeToast(response.data.message, 'error');
    }
  };

  const updateStock = async (id) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/tool/update/${id}`,
      { stockQuantity: newStock[id] }
    );
    await fetchList();
    if (response.data.success) {
      safeToast('Stock updated successfully', 'success');
    } else {
      safeToast('Error updating stock', 'error');
    }
    setEditingStock(null);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="flex items-start gap-12">
      <Sidebar />
      <div className="mr-20 ml-60">
        <div className="list add flex-col p-10">
          <p className="flex justify-center font-bold text-red-600 text-xl m-4">
            All Tools List
          </p>
          <div className="list-table mx-16">
            <div className="list-table-format title">
              <b className="mx-16 text-2xl">Product</b>
              <b className="mx-16 text-2xl">Name</b>
              <b className="mx-4 text-2xl">Category</b>
              <b className="-mx-4 text-2xl">Price</b>
              <b className="-mx-4 text-2xl">Stock</b>
              {/* <b className="-mx-12 text-2xl">Action</b> */}
            </div>
            {list.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="list-table-format transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-4 hover:border-blue-400 hover:bg-blue-200"
                >
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item.image}`}
                    alt=""
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-size='12' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <p className="mx-20">{item.name}</p>
                  <p className="mx-12">{item.category}</p>
                  <p>{item.price}</p>
                  {editingStock === item._id ? (
                    <input
                      type="number"
                      value={newStock[item._id] || item.stockQuantity}
                      onChange={(e) =>
                        setNewStock({ ...newStock, [item._id]: e.target.value })
                      }
                    />
                  ) : (
                    <p>{item.stockQuantity}</p>
                  )}
                  <div className="actions">
                    {editingStock === item._id ? (
                      <button
                        className="edit-button"
                        onClick={() => updateStock(item._id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="edit-button"
                        onClick={() => setEditingStock(item._id)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="remove-button"
                      onClick={() => removeTool(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListTool;