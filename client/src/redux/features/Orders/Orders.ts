import { baseApi } from "@/redux/baseApi/baseApi";

const BrowseCollectibles = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allUserOrders: builder.query({
      query: ({ status, sortBy, page, limit }) => ({
        url: `/orders/my-order?status=${status}&sortBy=${sortBy}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useAllUserOrdersQuery } = BrowseCollectibles;
