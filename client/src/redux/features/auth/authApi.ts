import { baseApi } from "@/redux/baseApi/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
    }),

    register: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/register",
        method: "POST",
        body: userInfo,
      }),
    }),

    forgetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resitPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body: data,
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: `/auth/change-password`,
        method: "POST",
        body: data,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: `/auth/verify-email`,
        method: "POST",
        body: data,
      }),
    }),
    resendVerification: builder.mutation({
      query: ({ email }) => ({
        url: `/auth/resend-verification/${email}`,
        method: "GET",
      }),
    }),

    checkUserExist: builder.mutation({
      query: ({ email }) => ({
        url: `/auth//check-user/${email}`,
        method: "GET",
      }),
    }),
    GoogleLogin: builder.mutation({
      query: (data) => {
        // console.log("Google login data:", data);
        return {
          url: `/auth/google`,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgetPasswordMutation,
  useResitPasswordMutation,
  useChangePasswordMutation,
  useVerifyEmailMutation,
  useGoogleLoginMutation,
  useResendVerificationMutation,
  useCheckUserExistMutation,
} = authApi;
