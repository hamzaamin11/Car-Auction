import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "../../components/Redux/UserSlice";
import NavigationSliceReducer from "../../components/Redux/NavigationSlice";
export const store = configureStore({
  reducer: {
    auth: userSliceReducer,
    navigateState: NavigationSliceReducer,
  },
});
