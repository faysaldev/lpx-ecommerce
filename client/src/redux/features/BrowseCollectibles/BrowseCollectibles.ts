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
      providesTags: ["New_Category"],
    }),

    addTocart: builder.mutation({
      query: (cartBody) => ({
        url: `/carts/add`,
        body: cartBody,
        method: "POST",
      }),
    }),

    remmoveTocart: builder.query({
      query: (productId) => ({
        url: `/carts/remove/${productId}`,
        method: "DELETE",
      }),
    }),

    addToWishList: builder.mutation({
      query: (wishlistBody) => ({
        url: `/wishlists/add`,
        body: wishlistBody,
        method: "POST",
      }),
    }),

    remmoveToWishlist: builder.query({
      query: (wishlitId) => ({
        url: `/wishlists/remove/${wishlitId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAllProductsBrowseCollectiblesQuery,
  useAllCategoriesQuery,
  useAddTocartMutation,
  useRemmoveTocartQuery,
} = BrowseCollectibles;
