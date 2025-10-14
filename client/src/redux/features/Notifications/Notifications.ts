import { baseApi } from "@/redux/baseApi/baseApi";

const Notifications = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    AllGetNotifications: builder.query({
      query: ({ type }) => ({
        url: `/notifications/my-notifications?type=${type}`,
        method: "GET",
      }),
    }),
    AllDeleteNotifications: builder.mutation({
      query: (type) => ({
        url: `/notifications/remove-all?type=${type}`,
        method: "DELETE",
      }),
    }),
    AllNotificationsRead: builder.mutation({
      query: () => ({
        url: "/notifications/make-as-read-all",
        method: "PATCH",
      }),
    }),
    UpdateNotifications: builder.mutation({
      query: (id) => ({
        url: `/notifications/make-as-read/${id}`,
        method: "PATCH",
      }),
    }),
    SingleDelete: builder.mutation({
      query: (id) => ({
        url: `/notifications/remove/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAllGetNotificationsQuery,
  useAllDeleteNotificationsMutation,
  useAllNotificationsReadMutation,
  useSingleDeleteMutation,
  useUpdateNotificationsMutation,
} = Notifications;
