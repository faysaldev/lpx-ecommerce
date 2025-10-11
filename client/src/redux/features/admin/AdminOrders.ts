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
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/order-status-update/${id}?status=${status}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useAdminOrdersStatsQuery,
  useSearchAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} = authApi;
