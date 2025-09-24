import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store/store";

export type TUser = {
  name: string;
  email: string;
  password: string;
  _id?: string;
  id: string;
};
type TAuthState = {
  user: null | TUser;
  token: null | string;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
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

// export const selectCurrentUser = (state: RootState) => state.auth;
