import { baseApi } from "@/redux/baseApi/baseApi";

const paymentRequest = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentRequest: builder.mutation({
      query: (paymentRequestBody) => ({
        url: "/payments/create-pay",
        method: "POST",
        body: paymentRequestBody,
      }),
    }),

    myPaymentRequest: builder.query({
      query: ({ page, search, sort }) => ({
        url: `/payments/my-pay-request?page=${page}&limit=10&search=${search}&status=${status}&sort=${sort}`,
        method: "GET",
      }),
    }),

    getPaymeRequestStats: builder.query({
      query: () => ({
        url: `/payments/payment-request-stats`,
        method: "GET",
      }),
    }),
    getPaymentRequestSummary: builder.query({
      query: () => ({
        url: `/payments/payment-request-summary`,
        method: "GET",
      }),
    }),

    getPaymentWithDrawlElgble: builder.query({
      query: () => ({
        url: `/payments/my-eligable-withdrawl`,
        method: "GET",
      }),
    }),
    getSinglePaymentdetails: builder.query({
      query: (id) => ({
        url: `/payments/details/${id}`,
        method: "GET",
      }),
    }),
    // payment methods card;
    // Banks Endpoints
    getMyCards: builder.query({
      query: () => ({
        url: `/banks/my-cards`,
        method: "GET",
      }),
      providesTags: ["payment_method"],
    }),

    addBankCard: builder.mutation({
      query: (bankCardBody) => ({
        url: "/banks/add",
        method: "POST",
        body: bankCardBody,
      }),
      invalidatesTags: ["payment_method"],
    }),

    removeBankCard: builder.mutation({
      query: (id) => ({
        url: `/banks/remove/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["payment_method"],
    }),
  }),
});

export const {
  useCreatePaymentRequestMutation,
  useMyPaymentRequestQuery,
  useGetPaymeRequestStatsQuery,
  useGetPaymentWithDrawlElgbleQuery,
  useGetSinglePaymentdetailsQuery,
  useGetPaymentRequestSummaryQuery,

  // payment methods
  useGetMyCardsQuery,
  useAddBankCardMutation,
  useRemoveBankCardMutation,
} = paymentRequest;
