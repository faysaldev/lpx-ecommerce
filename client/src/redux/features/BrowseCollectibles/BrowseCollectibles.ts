import { baseApi } from "@/redux/baseApi/baseApi";

const BrowseCollectibles = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    AllProductsBrowseCollectibles: builder.query({
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
        url: `/products/search?query=${query}&minPrice=${minPrice}&maxPrice=${maxPrice}&condition=${condition}&sortBy=${sortBy}&page=${page}&limit=${limit}&category=${category}`,
        method: "GET",
      }),
    }),
    AllCategories: builder.query({
      query: () => ({
        url: "/categories/all",
        method: "GET",
      }),
    }),
  }),
});

export const { useAllProductsBrowseCollectiblesQuery, useAllCategoriesQuery } =
  BrowseCollectibles;
