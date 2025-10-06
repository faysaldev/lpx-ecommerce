import { baseApi } from "@/redux/baseApi/baseApi";
const BuyNowPyemant = baseApi.injectEndpoints({
  endpoints: (builder) => ({
     BuyNow: builder.mutation({
        query: (data) => ({
            url: `/stripes/checkout`,
            method: "POST",
            body: data,
        }),
    }),
  }),
});

export const {useBuyNowMutation} = BuyNowPyemant;