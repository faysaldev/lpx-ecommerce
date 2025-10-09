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
      query: (args) => {
        const { id, data } = args;
        return {
          url: `/products/edite/${id}`,
          method: "PATCH",
          body: data,
        };
      },
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
  }),
});

export const {
  useProductCreateMutation,
  useProductUpdateMutation,
  useDraftsCreateMutation,
  useGetSingleProductQuery,
  useRemoveSingleProductsMutation,
} = authApi;
