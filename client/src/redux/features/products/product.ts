import { baseApi } from "@/redux/baseApi/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    productCreate: builder.mutation({
      query: ({ productInfo, type }) => ({
        url: `/products/add/${type}`, // type will be 'true' or 'false'
        method: "POST",
        body: productInfo, // productInfo will be the FormData
      }),
    }),

    removeSingleProducts: builder.mutation({
      query: (productId) => ({
        url: `/products/remove/${productId}`,
        method: "DELETE",
      }),
    }),
    productUpdate: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/edite/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["product"], // Add this to refresh product data after update
    }),
    getSingleProduct: builder.query({
      query: (id) => ({
        url: `/products/details/${id}`,
        method: "GET",
      }),
    }),
    getSingleProductQuickView: builder.mutation({
      query: (id) => ({
        url: `/products/quick-details/${id}`,
        method: "GET",
      }),
    }),

    // New Mutation: Add a Tag
    addTag: builder.mutation({
      query: (tag) => ({
        url: "/generals/tags/add", // Endpoint to add a new tag
        method: "POST",
        body: { tag }, // Send the tag in the body
      }),
    }),

    // New Query: Get Tags with Search Query
    getTags: builder.query({
      query: (searchQuery) => ({
        url: `/generals/tags?search=${searchQuery}`, // Endpoint to get tags based on the search query
        method: "GET",
      }),
    }),
  }),
});

export const {
  useProductCreateMutation,
  useProductUpdateMutation,
  useGetSingleProductQuery,
  useRemoveSingleProductsMutation,
  useGetSingleProductQuickViewMutation,
  useAddTagMutation,
  useGetTagsQuery,
} = authApi;
