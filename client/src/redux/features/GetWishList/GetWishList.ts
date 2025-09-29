import { baseApi } from "@/redux/baseApi/baseApi";

const GetWishList = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    AllGetWishList: builder.query({
      query: () => ({
        url: "wishlists/my-wishlist",
        method: "GET",
      }),
    }),
    AllDeleteWishList: builder.mutation({
      query: () => ({
        url: "/wishlists/remove-all",
        method: "DELETE",
      }),
    }),
  }),
});

export const {useAllGetWishListQuery, useAllDeleteWishListMutation} = GetWishList;