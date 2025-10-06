import { baseApi } from "@/redux/baseApi/baseApi";

const generalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addNewcategory: builder.mutation({
      query: (categoryBody) => ({
        url: `/categories/add`,
        method: "POST",
        body: categoryBody,
      }),
      invalidatesTags: ["New_Category"],
    }),

    removeSingleCategory: builder.mutation({
      query: (id: string) => ({
        url: `/categories/remove/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["New_Category"],
    }),
  }),
});

export const { useAddNewcategoryMutation, useRemoveSingleCategoryMutation } =
  generalApi;
