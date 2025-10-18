import { baseApi } from "@/redux/baseApi/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminDasboard: builder.query({
      query: () => ({
        url: `/admin/dashboard`,
        method: "GET",
      }),
    }),

    adminUsers: builder.query({
      query: () => ({
        url: `/admin/users`,
        method: "GET",
      }),
    }),
  }),
});

export const { useAdminDasboardQuery, useAdminUsersQuery } = authApi;
