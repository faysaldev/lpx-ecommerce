import { baseApi } from "@/redux/baseApi/baseApi";

const BrowseCollectibles = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    LandingpageFetureProducts: builder.query({
      query: () => ({
        url: "/lpx/fetures-products",
        method: "GET",
      }),
    }),

    LandingpageStatitics: builder.query({
      query: () => ({
        url: "/lpx/statitics",
        method: "GET",
      }),
    }),
    LandingpageHeaderStatitics: builder.query({
      query: () => ({
        url: "/lpx/header-statitics",
        method: "GET",
      }),
      providesTags: ["header_statics"],
    }),
    lpxtaxEtcDetails: builder.query({
      query: () => ({
        url: "/generals/shipping-tax",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLandingpageFetureProductsQuery,
  useLandingpageStatiticsQuery,
  useLandingpageHeaderStatiticsQuery,
  useLpxtaxEtcDetailsQuery,
} = BrowseCollectibles;
