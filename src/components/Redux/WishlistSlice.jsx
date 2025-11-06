import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

const initialState = {
  wishlistByUser: {}, // ✅ This should be the structure
};

const WishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addInList: (state, action) => {
      const { userId, vehicle } = action.payload;
      console.log({ userId, vehicle });

      // ✅ Ensure wishlistByUser exists first
      if (!state.wishlistByUser) {
        state.wishlistByUser = {};
      }

      // ✅ Then ensure this user's wishlist array exists
      if (!state.wishlistByUser[userId]) {
        state.wishlistByUser[userId] = [];
      }

      // ✅ Now safely check for duplicates
      const exists = state.wishlistByUser[userId].some(
        (v) => v.id === vehicle.id
      );

      if (!exists) {
        state.wishlistByUser[userId].push(vehicle);
        Swal.fire({
          title: "Success!",
          text: "Vehicle has been added successfully in wishlist!",
          icon: "success",
          confirmButtonColor: "#9333ea",
        });
      } else {
        Swal.fire({
          title: "Already Added!",
          text: "This vehicle is already in your wishlist.",
          icon: "info",
          confirmButtonColor: "#9333ea",
        });
      }
    },

    removeInList: (state, action) => {
      const { userId, vehicleId } = action.payload;

      if (state.wishlistByUser[userId]) {
        state.wishlistByUser[userId] = state.wishlistByUser[userId].filter(
          (v) => v.id !== vehicleId
        );
      }
    },

    clearUserWishlist: (state, action) => {
      const userId = action.payload;
      if (state.wishlistByUser[userId]) {
        delete state.wishlistByUser[userId];
      }
    },
  },
});

export const { addInList, removeInList, clearUserWishlist } =
  WishlistSlice.actions;
export default WishlistSlice.reducer;
