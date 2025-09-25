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
    draftsCreate: builder.mutation({
      query: (productInfo) => ({
        url: "/drafts/add",
        method: "POST",
        body: productInfo,
      }),
    }),
  }),
});

export const { useProductCreateMutation, useDraftsCreateMutation } = authApi;
