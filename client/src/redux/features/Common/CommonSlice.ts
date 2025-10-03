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

// Define the state for categories
type CommonState = {
  categories: CategoryAttributes[] | null;
};

const initialState: CommonState = {
  categories: null,
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

export const { setAllCategories, addCategory, resetCategories } =
  commonSlice.actions;

export default commonSlice.reducer;

// Selector to select categories from the state
export const selectCategories = (
  state: RootState
): CategoryAttributes[] | null => state.common.categories;
