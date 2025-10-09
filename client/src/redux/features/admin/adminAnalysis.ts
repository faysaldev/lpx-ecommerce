import { baseApi } from "@/redux/baseApi/baseApi";

const analysisApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get analytics stats (already exists)
    getAnalyticsStats: builder.query({
      query: () => ({
        url: `/admin/analytics-stats`,
        method: "GET",
      }),
    }),

    // Get total sales
    getTotalSales: builder.query({
      query: () => ({
        url: `/admin/analytics-total-sales`,
        method: "GET",
      }),
    }),

    // Get total users
    getTotalUsers: builder.query({
      query: () => ({
        url: `/admin/analytics-total-users`,
        method: "GET",
      }),
    }),

    // Get total products
    getTotalProducts: builder.query({
      query: () => ({
        url: `/admin/analytics-total-products`,
        method: "GET",
      }),
    }),

    // Get total revenue
    getTotalRevenue: builder.query({
      query: () => ({
        url: `/admin/analytics-total-revinue`,
        method: "GET",
      }),
    }),

    // Get top selling categories
    getTopSellingCategories: builder.query({
      query: () => ({
        url: `/admin/analytics-top-selling-categories`,
        method: "GET",
      }),
    }),

    // Get recent trends
    getRecentTrends: builder.query({
      query: () => ({
        url: `/admin/analytics-recent-trends`,
        method: "GET",
      }),
    }),
  }),
});

// Export the hooks for each query
export const {
  useGetAnalyticsStatsQuery,
  useGetTotalSalesQuery,
  useGetTotalUsersQuery,
  useGetTotalProductsQuery,
  useGetTotalRevenueQuery,
  useGetTopSellingCategoriesQuery,
  useGetRecentTrendsQuery,
} = analysisApi;
