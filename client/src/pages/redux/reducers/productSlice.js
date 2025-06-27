import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  try {
    // Log the request
    console.log("Redux: Fetching products from API");
    
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/list`);
    console.log("Redux: Product API response:", response.data);
    
    // Extract products based on response structure
    let products = [];
    if (response.data && response.data.success && Array.isArray(response.data.message)) {
      products = response.data.message;
    } else if (response.data && Array.isArray(response.data)) {
      products = response.data;
    } else if (response.data && response.data.products && Array.isArray(response.data.products)) {
      products = response.data.products;
    }
    
    // Ensure all products have minimum required fields
    const safeProducts = products.map(product => ({
      _id: product._id || `temp-${Math.random()}`,
      name: product.name || "Unnamed Product",
      description: product.description || "No description available",
      price: product.price || 0,
      category: product.category || "Uncategorized",
      image: product.image || "default.jpg",
      stockQuantity: product.stockQuantity || 0,
      ...product // Keep any additional fields
    }));
    
    console.log(`Redux: Processed ${safeProducts.length} products`);
    return safeProducts;
  } catch (error) {
    console.error("Redux: Error fetching products:", error);
    throw error;
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
