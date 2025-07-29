import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: "",
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.error = null;
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
