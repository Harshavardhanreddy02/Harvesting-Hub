import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar';
import './List.css';

// Ensure toast is configured safely
const safeToast = (message, type = 'info') => {
  try {
    switch (type) {
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

const List = () => {
  // Default URL should be for products, not tools
  const productUrl = `${import.meta.env.VITE_BACKEND_URL}/api/product/list`;
  const toolUrl = `${import.meta.env.VITE_BACKEND_URL}/api/tool/list`;
  
  const [list, setList] = useState([]);
  const [editingStock, setEditingStock] = useState(null);
  const [newStock, setNewStock] = useState({});
  const [listType, setListType] = useState('product'); // Default to products
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      setLoading(true);
      const currentUrl = listType === 'product' ? productUrl : toolUrl;
      console.log(`Fetching data from: ${currentUrl}`);
      
      const response = await axios.get(currentUrl);
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        setList(response.data.message);
        safeToast(`${listType === 'product' ? 'Product' : 'Tool'} list fetched successfully`, 'success');
      } else if (Array.isArray(response.data)) {
        // Handle case where response is a direct array
        setList(response.data);
        safeToast(`${listType === 'product' ? 'Product' : 'Tool'} list fetched successfully`, 'success');
      } else {
        safeToast(`Error fetching ${listType} list`, 'error');
      }
    } catch (error) {
      console.error(`Error fetching ${listType} list:`, error);
      safeToast(`Error fetching ${listType} list`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id) => {
    try {
      const updateUrl = listType === 'product' 
        ? `${import.meta.env.VITE_BACKEND_URL}/api/product/update/${id}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/tool/update/${id}`;
        
      const response = await axios.put(
        updateUrl,
        { stockQuantity: newStock[id] }
      );
      
      if (response.data.success) {
        safeToast('Stock updated successfully', 'success');
        await fetchList(); // Refresh the list
      } else {
        safeToast('Error updating stock', 'error');
      }
      setEditingStock(null);
    } catch (error) {
      console.error('Error updating stock:', error);
      safeToast('Error updating stock', 'error');
    }
  };

  const removeProduct = async (id) => {
    try {
      const deleteUrl = listType === 'product' 
        ? `${import.meta.env.VITE_BACKEND_URL}/api/product/delete/${id}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/tool/delete/${id}`;
        
      const response = await axios.post(deleteUrl);
      
      if (response.data.success) {
        safeToast(`${listType === 'product' ? 'Product' : 'Tool'} removed successfully`, 'success');
        await fetchList(); // Refresh the list
      } else {
        safeToast(`Error removing ${listType}`, 'error');
      }
    } catch (error) {
      console.error(`Error removing ${listType}:`, error);
      safeToast(`Error removing ${listType}`, 'error');
    }
  };

  useEffect(() => {
    fetchList();
  }, [listType]); // Refetch when list type changes

  return (
    <div className="flex items-start gap-12">
      <Sidebar />
      <div className="mr-20 ml-60">
        <div className="list add flex-col p-10">
          <div className="flex justify-between items-center mb-6">
            <p className="font-bold text-red-600 text-xl">
              {listType === 'product' ? 'Products List' : 'Tools List'}
            </p>
            {/* <div className="flex gap-4">
              <button 
                onClick={() => setListType('product')}
                className={`px-4 py-2 rounded ${listType === 'product' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Show Products
              </button>
              <button 
                onClick={() => setListType('tool')}
                className={`px-4 py-2 rounded ${listType === 'tool' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Show Tools
              </button>
            </div> */}
          </div>
          
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : list.length === 0 ? (
            <div className="text-center py-10">No items found</div>
          ) : (
            <div className="list-table mx-16">
              <div className="list-table-format title">
                <b className="mx-16 text-2xl">Product</b>
                <b className="mx-16 text-2xl">Name</b>
                <b className="mx-4 text-2xl">Category</b>
                <b className="-mx-4 text-2xl">Price</b>
                <b className="-mx-4 text-2xl">Stock</b>
              </div>
              {list.map((item, idx) => (
                <div
                  key={idx}
                  className="list-table-format transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-4 hover:border-blue-400 hover:bg-blue-200"
                >
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item.image}`}
                    alt=""
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-size='12' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E";
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
                      onClick={() => removeProduct(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default List;