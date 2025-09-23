import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/redux/slices/counterSlice";

export type RootState = ReturnType<typeof store.getState>;
// Define AppDispatch type
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export default store;
