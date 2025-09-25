import { baseApi } from "@/redux/baseApi/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchVendor: builder.mutation({
      query: (vendorInfo) => ({
        url: `/admin/vendors?status=${vendorInfo.status}&${vendorInfo?.search}`,
        method: "GET",
      }),
    }),

    updateVendorStatus: builder.mutation({
      query: (vendorInfo) => ({
        url: `/admin//update-vendor`,
        method: "PATCH",
        body: vendorInfo,
      }),
    }),
  }),
});

export const { useSearchVendorMutation, useUpdateVendorStatusMutation } =
  authApi;
