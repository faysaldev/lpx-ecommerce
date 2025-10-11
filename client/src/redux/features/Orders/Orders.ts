import { baseApi } from "@/redux/baseApi/baseApi";

const BrowseCollectibles = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allUserOrders: builder.query({
      query: ({ status, sortBy, page, limit }) => ({
        url: `/orders/my-order?status=${status}&sortBy=${sortBy}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
    singleOrderDetails: builder.query({
      query: (orderId) => ({
        url: `/orders/order-details/${orderId}`,
        method: "GET",
      }),
    }),
    DashBoardStatitics: builder.query({
      query: () => ({
        url: `/lpx/customer-dashboard`,
        method: "GET",
      }),
    }),
    getHasUserPursched: builder.query({
      query: ({ id, type }) => ({
        url: `/lpx/has-user-purchased?id=${id}&type=${type}`,
        method: "GET",
      }),
    }),
    GetProductsOrVendorRating: builder.query({
      query: ({ id, type }) => ({
        url: `/ratings/my-ratings?type=${type}&id=${id}`,
        method: "GET",
      }),
      providesTags: ["Ratings"],
    }),
    AddNewratings: builder.mutation({
      query: (data) => ({
        url: `/ratings/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Ratings"],
    }),
    singleInvoiceDownload: builder.query({
      query: (orderId) => ({
        url: `/orders/invoice/${orderId}`,
        method: "GET",
        responseHandler: (response) => response.blob(), // Handle the response as a Blob
      }),
    }),
  }),
});

export const {
  useAllUserOrdersQuery,
  useSingleOrderDetailsQuery,
  useDashBoardStatiticsQuery,
  useGetHasUserPurschedQuery,
  useGetProductsOrVendorRatingQuery,
  useAddNewratingsMutation,
  useSingleInvoiceDownloadQuery,
} = BrowseCollectibles;
