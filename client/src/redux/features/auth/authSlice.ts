import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store/store"; // Make sure this is correct

interface User {
  name: string;
  email: string;
  image: string | null; // image might be null
  password: string;
  role: "user" | "admin";
  type: "customer" | "vendor" | "admin"; // Modify as per your requirements
  address: string | null;
  phoneNumber: string;
  isProfileCompleted: boolean;
  totalEarnings: number;
  totalWithDrawal: number;
  createdAt: string;
  id: string;
}

type TAuthState = {
  user: User | null;
  token: string | null;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState): User | null =>
  state.auth.user;
export const selectToken = (state: RootState): string | null =>
  state.auth.token;

// import { createSlice } from "@reduxjs/toolkit";
// import { RootState } from "@/redux/store/store";

// interface User {
//   name: string;
//   email: string;
//   image: string; // image might be null
//   password: string; // Usually, hashed passwords should be kept as strings
//   role: "user" | "admin"; // Assuming roles are either "user" or "admin"
//   type: "customer" | "vendor" | "admin"; // Modify this if there are other types
//   address: string | null; // Address might be null if not provided
//   phoneNumber: string;
//   isProfileCompleted: boolean;
//   totalEarnings: number;
//   totalWithDrawal: number;
//   createdAt: string; // You can also use `Date` if you convert to a JavaScript Date object
//   id: string; // This should be a string (could be a UUID or a string-based identifier)
// }

// type TAuthState = {
//   user: null | User;
//   token: null | string;
// };

// const initialState: TAuthState = {
//   user: null,
//   token: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       const { user, token } = action.payload;
//       state.user = user;
//       state.token = token;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//     },
//   },
// });

// export const { setUser, logout } = authSlice.actions;

// export default authSlice.reducer;

// export const selectCurrentUser = (state: RootState) => state.auth;
