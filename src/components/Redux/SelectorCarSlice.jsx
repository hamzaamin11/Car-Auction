import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  year: "",
  make: "",
  model: "",
  series: "",
};

const CarSelectorSlice = createSlice({
  name: "carSelector",
  initialState,
  reducers: {
    addYear: (state, action) => {
      state.year = action.payload;
    },
    addMake: (state, action) => {
      state.make = action.payload;
    },
    addModel: (state, action) => {
      state.model = action.payload;
    },
    addSeries: (state, action) => {
      state.series = action.payload;
    },
  },
});

export const { addYear, addMake, addModel, addSeries } =
  CarSelectorSlice.actions;
export default CarSelectorSlice.reducer;
