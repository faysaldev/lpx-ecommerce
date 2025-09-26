import { baseApi } from "@/redux/baseApi/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserWishlist: builder.query({
      query: () => ({
        url: "/wishlists/my-wishlist",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserWishlistQuery } = authApi;
