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
      query: (id) => ({
        url: `/carts/remove/${id}`,
      }),
    }),
  }),
});

export const { useAllShoppingCartQuery  } = ShoppingCart;