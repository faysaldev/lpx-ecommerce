import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store/store"; // Make sure this is correct

interface User {
  name: string;
  email: string;
  image: string | null; // image might be null
  password: string;
  role: "user" | "admin";
  type: "customer" | "seller" | "admin"; // Modify as per your requirements
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
