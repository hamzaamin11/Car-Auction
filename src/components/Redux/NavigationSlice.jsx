import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openPage: "",
  loader: false,
};

const NavigationSlice = createSlice({
  name: "navigate",
  initialState,
  reducers: {
    navigationStart: (state) => {
      state.loader = true;
    },
    navigationSuccess: (state, action) => {
      state.loader = false;
      state.openPage = action.payload;
    },
  },
});

export const { navigationStart, navigationSuccess } = NavigationSlice.actions;

export default NavigationSlice.reducer;
