import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // localStorage ke liye
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

import userSliceReducer from "../../components/Redux/UserSlice";
import NavigationSliceReducer from "../../components/Redux/NavigationSlice";
import carSelectorReduce from "../../components/Redux/SelectorCarSlice";
import emailSliceReucer from "../../components/Redux/EmailSlice";
import WishlistSlice from "../../components/Redux/WishlistSlice";

// saare reducers combine kar do
const rootReducer = combineReducers({
  auth: userSliceReducer,
  navigateState: NavigationSliceReducer,
  carSelector: carSelectorReduce,
  emailValidation: emailSliceReucer,
  wishList: WishlistSlice,
});

// persist config
const persistConfig = {
  key: "root",
  storage,
};

// rootReducer ko persist ke sath wrap karo
const persistedReducer = persistReducer(persistConfig, rootReducer);

// store create karo
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist ke liye required hai
    }),
});

// persistor export karo
export const persistor = persistStore(store);
