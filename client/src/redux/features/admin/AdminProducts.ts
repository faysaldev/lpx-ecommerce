import { baseApi } from "@/redux/baseApi/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    AdminProductsStats: builder.query({
      query: () => ({
        url: `/admin/product-stats`,
        method: "GET",
      }),
    }),

    searchAdminProducts: builder.query({
      query: ({
        query,
        minPrice,
        maxPrice,
        condition,
        sortBy,
        page,
        limit,
        category,
      }) => ({
        url: `/admin/all-products?query=${query || ""}&minPrice=${
          minPrice || ""
        }&maxPrice=${maxPrice || ""}&condition=${
          condition || ""
        }&sortBy=${sortBy}&page=${page}&limit=${limit}&category=${
          category || ""
        }`,
          method: "GET",
      }),
    }),
  }),
});

export const { useSearchAdminProductsQuery, useAdminProductsStatsQuery } =
  authApi;
