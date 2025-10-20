import { baseApi } from "@/redux/baseApi/baseApi";

const GetWishList = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    AllGetWishList: builder.query({
      query: () => ({
        url: "wishlists/my-wishlist",
        method: "GET",
      }),
      providesTags: ["my_wishList", "header_statics"],
    }),
    AllDeleteWishList: builder.mutation({
      query: () => ({
        url: "/wishlists/remove-all",
        method: "DELETE",
      }),
      invalidatesTags: ["my_wishList", "header_statics"],
    }),
    removeSingleProductWishlit: builder.mutation({
      query: (id) => ({
        url: `/wishlists/remove/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["my_wishList", "header_statics"],
    }),

    addNewToWishList: builder.mutation({
      query: (withlistBody) => ({
        url: "/wishlists/add",
        method: "POST",
        body: withlistBody,
      }),
      invalidatesTags: ["my_wishList", "header_statics"],
    }),
  }),
});

export const {
  useAllGetWishListQuery,
  useAllDeleteWishListMutation,
  useAddNewToWishListMutation,
  useRemoveSingleProductWishlitMutation,
} = GetWishList;
