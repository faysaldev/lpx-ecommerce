import { baseApi } from "@/redux/baseApi/baseApi";

const paymentRequest = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    AdminPaymentStats: builder.query({
      query: () => ({
        url: `/admin/all-payment-stats`,
        method: "GET",
      }),
    }),

    searchAdminPaymentRequest: builder.query({
      query: ({ search, sortBy, page, limit, status }) => ({
        url: `/admin/all-payment-requests?search=${search}&status=${status}&limit=${limit}&condition=${page}&sortBy=${sortBy}`,
        method: "GET",
      }),
    }),

    adminPaymentVendorSummeries: builder.query({
      query: ({ page, limit }) => ({
        url: `/admin/pay-vendor-summaries?&limit=${limit}&condition=${page}`,
        method: "GET",
      }),
    }),

    adminPayRequestAnalysis: builder.query({
      query: () => ({
        url: `/admin/pay-financial-overview`,
        method: "GET",
      }),
    }),

    adminPayRequestInVoiceUpload: builder.mutation({
      query: ({ paymentId, data }) => ({
        url: `/admin/payment-completed/${paymentId}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useAdminPaymentStatsQuery,
  useSearchAdminPaymentRequestQuery,
  useAdminPaymentVendorSummeriesQuery,
  useAdminPayRequestAnalysisQuery,
  useAdminPayRequestInVoiceUploadMutation,
} = paymentRequest;
