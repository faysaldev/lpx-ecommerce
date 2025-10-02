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

    searchVendorCollection: builder.query({
      query: ({ search, page, limit, category, sortBy, ratingFilter }) => ({
        url: `/vendors/search?search=${search || ""}&page=${page || ""}&limit=${
          limit || ""
        }&category=${category || ""}&sortBy=${sortBy || ""}&ratingFilter=${
          ratingFilter || ""
        }`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useVendorCreateMutation,
  useVendorGetsQuery,
  useSearchVendorCollectionQuery,
} = authApi;
