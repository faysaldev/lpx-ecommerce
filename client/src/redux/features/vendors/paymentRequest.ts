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
  }),
});

export const { useCreatePaymentRequestMutation, useMyPaymentRequestQuery } =
  paymentRequest;
