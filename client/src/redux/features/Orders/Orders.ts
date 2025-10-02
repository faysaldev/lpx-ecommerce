import { baseApi } from "@/redux/baseApi/baseApi";

const BrowseCollectibles = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allUserOrders: builder.query({
      query: ({ status, sortBy, page, limit }) => ({
        url: `/orders/my-order?status=${status}&sortBy=${sortBy}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
    singleOrderDetails: builder.query({
      query: (orderId) => ({
        url: `/orders/order-details/${orderId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useAllUserOrdersQuery, useSingleOrderDetailsQuery } =
  BrowseCollectibles;
