import { baseApi } from "@/redux/baseApi/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchVendor: builder.mutation({
      query: (vendorInfo) => ({
        url: `/admin/vendors?status=${vendorInfo.status}&search=${vendorInfo?.search}&page=${vendorInfo?.page}`,
        method: "GET",
      }),
    }),

    updateVendorStatus: builder.mutation({
      query: (vendorInfo) => ({
        url: `/admin/update-vendor`,
        method: "PATCH",
        body: vendorInfo,
      }),
      invalidatesTags: ["vendor_update"],
    }),
  }),
});

export const { useSearchVendorMutation, useUpdateVendorStatusMutation } =
  authApi;
