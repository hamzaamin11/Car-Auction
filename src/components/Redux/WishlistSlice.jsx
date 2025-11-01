import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

const initialState = {
  wishVehicle: [],
};

const WishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addInList: (state, action) => {
      state.wishVehicle.push(action.payload);
      Swal.fire({
        title: "Success!",
        text: "Vehicle has been addded  successfully!",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });
    },
    removeInList: (state, action) => {
      state.wishVehicle = state.wishVehicle.filter(
        (v) => v.id !== action.payload
      );
    },
  },
});
export const { addInList, removeInList } = WishlistSlice.actions;
export default WishlistSlice.reducer;
