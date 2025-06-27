import { createSlice } from '@reduxjs/toolkit';

// Get initial state from localStorage if available
const getSavedUser = () => {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Error parsing saved user:", error);
    return null;
  }
};

const initialState = {
  user: getSavedUser(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    }
  },
});

export const { updateUser } = userSlice.actions;

export const updateUserAsync = (userData) => (dispatch) => {
  console.log("Updating user in Redux:", userData);
  
  // Save updated user to localStorage
  localStorage.setItem("user", JSON.stringify(userData));
  
  dispatch(updateUser(userData));
  console.log("Updated user state:", userData);
};

export const clearUser = () => (dispatch) => {
  dispatch({
    type: 'user/clearUser',
  });
};

export default userSlice.reducer;