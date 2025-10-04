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
    productUpdate: builder.mutation({
      query: (args) => {
        const { id, productInfo } = args;
        return {
          url: `/products/update/${id}`,
          method: "PUT",
          body: productInfo,
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

export const { useProductCreateMutation, useProductUpdateMutation, useDraftsCreateMutation, useGetSingleProductQuery} = authApi;
