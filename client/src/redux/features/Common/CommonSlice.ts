import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store/store"; // Ensure this path is correct

// Define the structure of a Category Attribute
interface CategoryAttributes {
  _id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
type UserHeaderStatus = {
  unreadNotificationsCount: number;
  cartItemsCount: number;
  wishlistItemsCount: number;
};

// Define the state for categories
type CommonState = {
  categories: CategoryAttributes[] | null;
  headerStatics: UserHeaderStatus | null;
};

const initialState: CommonState = {
  categories: null,
  headerStatics: null,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setAllCategories: (
      state,
      action: PayloadAction<CategoryAttributes[] | null>
    ) => {
      state.categories = action.payload;
    },

    setHeaderStatitics: (
      state,
      action: PayloadAction<UserHeaderStatus | null>
    ) => {
      state.headerStatics = action.payload;
    },
    addCategory: (state, action: PayloadAction<CategoryAttributes>) => {
      if (state.categories) {
        state.categories.push(action.payload);
      } else {
        state.categories = [action.payload];
      }
    },
    resetCategories: (state) => {
      state.categories = null;
    },
  },
});

export const {
  setAllCategories,
  addCategory,
  resetCategories,
  setHeaderStatitics,
} = commonSlice.actions;

export default commonSlice.reducer;

// Selector to select categories from the state
export const selectCategories = (
  state: RootState
): CategoryAttributes[] | null => state.common.categories;

export const selectHeaderStatitics = (
  state: RootState
): UserHeaderStatus | null => state.common.headerStatics;
