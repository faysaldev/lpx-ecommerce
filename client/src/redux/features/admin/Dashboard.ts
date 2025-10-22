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
    // deactive single user
    removeSingleUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/remove-user/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAdminDasboardQuery,
  useAdminUsersQuery,
  useRemoveSingleUserMutation,
} = authApi;
