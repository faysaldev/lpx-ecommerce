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

    searchSingleVendorProducts: builder.query({
      query: ({ vendorId, query, page, limit, category, sortBy }) => ({
        url: `/vendors/single-owner/${vendorId}?query=${query || ""}&page=${
          page || ""
        }&limit=${limit || ""}&category=${category || ""}&sortBy=${
          sortBy || ""
        }`,
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

    vendorSingleDetailsGets: builder.query({
      query: (id) => ({
        url: `/vendors/single/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useVendorCreateMutation,
  useVendorGetsQuery,
  useSearchVendorCollectionQuery,
  useVendorSingleDetailsGetsQuery,
  useSearchSingleVendorProductsQuery,
} = authApi;
