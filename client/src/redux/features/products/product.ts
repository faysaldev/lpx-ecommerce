import { baseApi } from "@/redux/baseApi/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    productCreate: builder.mutation({
      query: (productInfo) => ({
        url: "/products/add",
        method: "POST",
        body: productInfo,
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

    draftsCreate: builder.mutation({
      query: (productInfo) => ({
        url: "/drafts/add",
        method: "POST",
        body: productInfo,
      }),
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
  }),
});

export const {
  useProductCreateMutation,
  useProductUpdateMutation,
  useDraftsCreateMutation,
  useGetSingleProductQuery,
  useRemoveSingleProductsMutation,
  useGetSingleProductQuickViewMutation,
} = authApi;
