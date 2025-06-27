/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./FarmerDashboard.css";
import { useSelector } from "react-redux";
import { storeContext } from "./redux/context/storeContext";

const FarmerDashboard = () => {
  let { currentUser } = useSelector((state) => state.user);
  const { fetchProducts } = useContext(storeContext);
  const email = currentUser?.email;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchFarmerProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!email) {
        setError("Email is missing, cannot fetch products");
        toast.error("Email is missing, cannot fetch products");
        setLoading(false);
        return;
      }
      
      console.log("Fetching products for farmer with email:", email);
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/farmerlist`,
        { email },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache' // Prevent caching
          } 
        }
      );
      
      console.log("API Response:", response.data);
      
      if (response.data.success) {
        if (response.data.products && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
          console.log("Products loaded:", response.data.products.length);
        } else if (response.data.message && Array.isArray(response.data.message)) {
          setProducts(response.data.message);
          console.log("Products loaded from message:", response.data.message.length);
        } else {
          console.error("Unexpected response format:", response.data);
          setProducts([]);
          setError("Unexpected data format received from server");
          toast.warning("No products found or unexpected data format");
        }
      } else {
        setError(response.data.message || "Error fetching products");
        toast.error(response.data.message || "Error fetching products");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message || "Error fetching products");
      toast.error(error.response?.data?.message || "Error fetching products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
  };

  const handleDeleteClick = async (productId) => {
    const confirmation = window.confirm("Are you sure you want to delete this product?");
    if (confirmation) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/product/farmerdelete/${productId}`);
        if (response.data.success) {
          toast.success("Product deleted successfully!");
          fetchFarmerProducts(); // Refresh the product list
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Error deleting product.");
      }
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...editingProduct,
      name: e.target.name.value,
      description: e.target.description.value,
      price: e.target.price.value,
      stockQuantity: e.target.stockQuantity.value,
      category: e.target.category ? e.target.category.value : editingProduct.category,
    };
    
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/farmerupdate/${editingProduct._id}`,
        updatedProduct
      );
      if (response.data.success) {
        toast.success("Product updated successfully!");
        setEditingProduct(null);
        // Force refresh from the server to ensure we have the latest data
        setTimeout(() => {
          fetchFarmerProducts();
        }, 500);
      } else {
        toast.error(response.data.message || "Error updating product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Error updating product.");
    }
  };

  useEffect(() => {
    if (email) {
      fetchFarmerProducts();
      const interval = setInterval(fetchFarmerProducts, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [email]);

  // Add a debugging function to track down product fetching issues
  const debugFetchProducts = () => {
    console.log("Debug: Fetching products directly from API");
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/list`)
      .then(response => {
        console.log("Debug: API response for products:", response.data);
        toast.info(`Products API returned ${response.data.success ? 'success' : 'failure'}`);
      })
      .catch(error => {
        console.error("Debug: Error fetching products:", error);
        toast.error("Failed to fetch products during debug");
      });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2 className="dashboard-title">Your Items</h2>
        <div className="loading">Loading your products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h2 className="dashboard-title">Your Items</h2>
        <div className="error-message">
          Error loading your products: {error}
          <button onClick={fetchFarmerProducts} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Your Items</h2>
      <div className="action-buttons">
        <button onClick={fetchFarmerProducts} className="refresh-button">
          Refresh Products
        </button>
      </div>

      {products.length === 0 ? (
        <div className="no-products-message">No products found for this farmer.</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={product.image ? `${import.meta.env.VITE_BACKEND_URL}/images/${product.image}` : 'https://via.placeholder.com/150?text=No+Image'}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.onerror = null;
                  // e.target.src = 'https://via.placeholder.com/150?text=Error';
                }}
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-category">
                <strong>Category:</strong> {product.category}
              </p>
              <p className="product-price">
                <strong>Price:</strong> Rs {product.price}/-
              </p>
              <p className="product-stock">
                <strong>Stock remaining :</strong> {product.stockQuantity} items
              </p>
              <p
                className={`product-status ${
                  product.status === "Sold Out" ? "sold-out" : "on-sale"
                }`}
              >
                <strong>Status:</strong> {product.status}
              </p>

              <div className="product-actions flex gap-4 justify-around my-4">
                <button
                  className="edit-button"
                  onClick={() => handleEditClick(product)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteClick(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingProduct && (
        <div className="edit-modal">
          <form onSubmit={handleUpdateProduct}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              defaultValue={editingProduct.name}
              required
            />
            <label>Description</label>
            <textarea
              name="description"
              defaultValue={editingProduct.description}
              required
            />
            <label>Price</label>
            <input
              type="number"
              name="price"
              defaultValue={editingProduct.price}
              required
            />
            <label>Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              defaultValue={editingProduct.stockQuantity}
              required
            />
            <div>
              <button type="submit">Update Product</button>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
