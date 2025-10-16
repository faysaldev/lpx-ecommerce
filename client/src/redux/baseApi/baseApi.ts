"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/redux/store/store";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
      // Extract the token correctly by parsing the stringified token object
      const token = (getState() as RootState).auth.token?.replace(/['"]+/g, "");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "recipe",
    "user",
    "product",
    "rating",
    "comment",
    "order",
    "Earnings",
    "User",
    "settings",
    "New_Category",
    "Ratings",
    "General_Settings",
    "Condition",
    "Coupon",
    "header_statics",
    "my_wishList",
    "my_cartList",
    "vendor_update",
    "payment_method",
  ],
  endpoints: () => ({}),
});
