import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
};

const EmailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    validationUser: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { validationUser } = EmailSlice.actions;

export default EmailSlice.reducer;
