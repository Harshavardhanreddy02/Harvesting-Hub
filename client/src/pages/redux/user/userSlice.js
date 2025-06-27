import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    error : false,
    loading : false,
    userInfo: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginInStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        loginInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        loginInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        logoutSuccess : (state) => {
            state.currentUser = null
            state.error = false
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        clearUserInfo: (state) => {
            state.userInfo = null;
        },
        updateUser: (state, action) => {
            console.log("Updating user in Redux:", action.payload);
            state.currentUser = { ...state.currentUser, ...action.payload };
            console.log("Updated user state:", state.currentUser);
        }
    }
});

export const {loginInFailure,loginInStart,loginInSuccess,logoutSuccess,updateUser,clearUserInfo,setUserInfo} = userSlice.actions

// Async action to update user data in Redux and localStorage
export const updateUserAsync = (userData) => (dispatch) => {
  console.log("Updating user in Redux async:", userData);
  
  // Save updated user to localStorage
  localStorage.setItem("user", JSON.stringify(userData));
  
  dispatch(updateUser(userData));
  console.log("Updated user state:", userData);
};

// Export the reducer
export default userSlice.reducer;
