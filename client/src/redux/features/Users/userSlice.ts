import { baseApi } from "@/redux/baseApi/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Existing getUserProfile endpoint
    getUserProfile: builder.query({
      query: () => ({
        url: "/users/self/in",
        method: "GET",
      }),
    }),

    // New endpoint for changing the password
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data, // The data here is expected to be an object with oldPassword and newPassword
      }),
    }),

    // New endpoint for updating the user's profile (name, phone number, address, image)
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/users/self/update",
        method: "PATCH",
        body: formData, // We will pass formData as the body for the profile update
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,
} = authApi;
