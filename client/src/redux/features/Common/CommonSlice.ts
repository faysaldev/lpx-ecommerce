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

interface VendorOwnerDetails {
  vendorId: string;
  vendorName: string;
  sellerId: string;
}

type withListId = {
  id: string;
};

type UserHeaderStatus = {
  unreadNotificationsCount: number;
  cartItemsCount: number;
  wishlistProductIds: withListId[];
};

// Define the state for categories
type CommonState = {
  categories: CategoryAttributes[] | null;
  headerStatics: UserHeaderStatus | null;
  vendor: VendorOwnerDetails | null;
};

const initialState: CommonState = {
  categories: null,
  headerStatics: null,
  vendor: null,
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

    setVendorDetails: (
      state,
      action: PayloadAction<VendorOwnerDetails | null>
    ) => {
      state.vendor = action.payload;
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

    removeSingleWishlit: (state, action) => {
      if (state.headerStatics) {
        // Compare each string directly with the payload
        state.headerStatics.wishlistProductIds =
          state.headerStatics.wishlistProductIds.filter(
            (item) => item !== action.payload // Direct string comparison
          );
      }
    },
  },
});

export const {
  setAllCategories,
  addCategory,
  resetCategories,
  setHeaderStatitics,
  setVendorDetails,
  removeSingleWishlit,
} = commonSlice.actions;

export default commonSlice.reducer;

// Selector to select categories from the state
export const selectCategories = (
  state: RootState
): CategoryAttributes[] | null => state.common.categories;

export const selectHeaderStatitics = (
  state: RootState
): UserHeaderStatus | null => state.common.headerStatics;

export const selectSelectedVendor = (
  state: RootState
): VendorOwnerDetails | null => state.common.vendor;
