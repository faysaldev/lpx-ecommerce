import { baseApi } from "@/redux/baseApi/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    AdminOrdersStats: builder.query({
      query: () => ({
        url: `/admin/order-stats`,
        method: "GET",
      }),
    }),

    searchAdminOrders: builder.query({
      query: ({ query }) => ({
        url: `/admin/all-orders?query=${query || ""}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useAdminOrdersStatsQuery, useSearchAdminOrdersQuery } = authApi;
