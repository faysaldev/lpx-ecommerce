import { baseApi } from "@/redux/baseApi/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    vendorCreate: builder.mutation({
      query: (userInfo) => ({
        url: "/vendors/request",
        method: "POST",
        body: userInfo,
      }),
    }),
    vendorGets: builder.query({
      query: () => ({
        url: "/vendors/my-vendors",
        method: "GET",
      }),
    }),
  }),
});

export const { useVendorCreateMutation, useVendorGetsQuery } = authApi;
