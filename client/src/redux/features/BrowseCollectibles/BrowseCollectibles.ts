import { baseApi } from "@/redux/baseApi/baseApi";

const BrowseCollectibles = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    AllProductsBrowseCollectibles: builder.query({
      query: () => ({
        url: "/products/all-products",
        method: "GET",
      }),
    }),
  }),
});

export const {useAllProductsBrowseCollectiblesQuery} = BrowseCollectibles;