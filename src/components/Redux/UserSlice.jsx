import { createSlice } from "@reduxjs/toolkit";

// ✅ NEW: Load initial state from localStorage
const loadUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error loading user from storage:", error);
    return null;
  }
};

const initialState = {
  currentUser: loadUserFromStorage(), // ✅ UPDATED: Initialize from localStorage instead of null
  error: "",
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.error = null;
      // ✅ NEW: Also save to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    authFailure: (state, action) => {
      state.error = action.payload;
    },
    logOut: (state) => {
      state.currentUser = null;
      localStorage.clear();
    },
    resetStore: () => initialState,
  },
});

export const { authSuccess, authFailure, logOut, resetStore } =
  userSlice.actions;
export default userSlice.reducer;