import { baseApi } from "@/redux/baseApi/baseApi";

const ShoppingCart = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    AllShoppingCart: builder.query({
      query: () => ({
        url: "/carts/my-carts",
        method: "GET",
      }),
      providesTags: ["my_wishList"],
    }),
    DeleteSingleCart: builder.mutation({
      query: ({ id }) => ({
        url: `/carts/remove/${id}`,
        method: "DELETE",
      }),
    }),
    allDeleteCart: builder.mutation({
      query: () => ({
        url: "/carts/remove-all",
        method: "DELETE",
      }),
      invalidatesTags: ["header_statics"],
    }),
    updateCartQuantity: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `/carts/update-quantity/${id}`,
        method: "PATCH",
        body: { quantity },
      }),
    }),
  }),
});

export const {
  useAllShoppingCartQuery,
  useDeleteSingleCartMutation,
  useAllDeleteCartMutation,
  useUpdateCartQuantityMutation,
} = ShoppingCart;
