
import { baseApi } from "@/redux/baseApi/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchVendorDashboardProducts: builder.query({
      query: ({ page, limit, search, status, sortBy }) => ({
        url: `/lpx/vendor/products?search=${search}&page=${page}&limit=${limit}&status=${status}&sortBy=${sortBy}`,
        method: "GET",
      }),
      providesTags: ["product"],
    }),
    vendorDashboardOverview: builder.query({
      query: () => ({
        url: "/lpx/vendor/overview",
        method: "GET",
      }),
    }),
    vendorDashboarRecentOrder: builder.query({
      query: ({ page, limit }) => ({
        url: `/lpx/vendor/recent-order?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
    vendorToSelling: builder.query({
      query: () => ({
        url: "/lpx/vendor/top-selling",
        method: "GET",
      }),
    }),
    vendorAnalytics: builder.query({
      query: () => ({
        url: "/lpx/vendor/analytics",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSearchVendorDashboardProductsQuery,
  useVendorDashboardOverviewQuery,
  useVendorDashboarRecentOrderQuery,
  useVendorToSellingQuery,
  useVendorAnalyticsQuery,
} = authApi;
