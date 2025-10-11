import { baseApi } from "@/redux/baseApi/baseApi";

const generalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🗂 Categories
    getAllCategories: builder.query({
      query: () => ({
        url: `/generals/category-all`,
        method: "GET",
      }),
      providesTags: ["New_Category"],
    }),

    addNewCategory: builder.mutation({
      query: (categoryBody) => ({
        url: `/generals/categories/add`,
        method: "POST",
        body: categoryBody,
      }),
      invalidatesTags: ["New_Category"],
    }),

    removeSingleCategory: builder.mutation({
      query: (id) => ({
        url: `/generals/categories/remove/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["New_Category"],
    }),

    // 🎟 Coupons
    getAllCoupons: builder.query({
      query: () => ({
        url: `/generals/coupon-all`,
        method: "GET",
      }),
      providesTags: ["Coupon"],
    }),

    addNewCoupon: builder.mutation({
      query: (couponBody) => ({
        url: `/generals/coupon/add`,
        method: "POST",
        body: couponBody,
      }),
      invalidatesTags: ["Coupon"],
    }),

    removeSingleCoupon: builder.mutation({
      query: (id) => ({
        url: `/generals/coupon/remove/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),

    // ⚙️ General Settings
    getGeneralSettings: builder.query({
      query: () => ({
        url: `/generals/`,
        method: "GET",
      }),
      providesTags: ["General_Settings"],
    }),

    updateGeneralSettings: builder.mutation({
      query: (data) => ({
        url: `/generals/update`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["General_Settings"],
    }),

    // 📋 Conditions
    addNewCondition: builder.mutation({
      query: (conditionBody) => ({
        url: `/generals/conditions/add`,
        method: "POST",
        body: conditionBody,
      }),
      invalidatesTags: ["Condition"],
    }),

    removeCondition: builder.mutation({
      query: (index) => ({
        url: `/generals/conditions/remove/${index}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Condition"],
    }),

    getAllConditions: builder.query({
      query: () => ({
        url: `/generals/`,
        method: "GET",
      }),
      transformResponse: (response) => response.data.conditions,
      providesTags: ["Condition"],
    }),
  }),
});

export const {
  // 🗂 Categories
  useGetAllCategoriesQuery,
  useAddNewCategoryMutation,
  useRemoveSingleCategoryMutation,

  // 🎟 Coupons
  useGetAllCouponsQuery,
  useAddNewCouponMutation,
  useRemoveSingleCouponMutation,

  // ⚙️ General Settings
  useGetGeneralSettingsQuery,
  useUpdateGeneralSettingsMutation,

  // 📋 Conditions
  useAddNewConditionMutation,
  useRemoveConditionMutation,
  useGetAllConditionsQuery,
} = generalApi;
