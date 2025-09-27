import { baseApi } from "@/redux/baseApi/baseApi";

const ShoppingCart = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    AllShoppingCart: builder.query({
      query: () => ({
        url: "/carts/my-carts",
        method: "GET",
      }),
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
    }),
  }),
});

export const { useAllShoppingCartQuery, useDeleteSingleCartMutation, useAllDeleteCartMutation  } = ShoppingCart;