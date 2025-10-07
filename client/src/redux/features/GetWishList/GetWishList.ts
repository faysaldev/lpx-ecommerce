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

    addNewToWishList: builder.mutation({
      query: (withlistBody) => ({
        url: "/wishlists/add",
        method: "POST",
        body: withlistBody,
      }),
      invalidatesTags: ["New_Category"],
    }),
  }),
});

export const {
  useAllGetWishListQuery,
  useAllDeleteWishListMutation,
  useAddNewToWishListMutation,
} = GetWishList;
