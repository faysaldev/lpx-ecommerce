/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useAddNewCategoryMutation,
  useRemoveSingleCategoryMutation,
} from "@/redux/features/admin/adminGeneral";
import { useAllCategoriesQuery } from "@/redux/features/BrowseCollectibles/BrowseCollectibles";
import React, { useState } from "react";

type Category = {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
};

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

function Page() {
  const { data: categoriesData, isLoading: categoriesLoading } =
    useAllCategoriesQuery({});
  const [createNewCategory] = useAddNewCategoryMutation({});
  const [removeSingleCategory] = useRemoveSingleCategoryMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget; // keep reference to the form
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const res = await createNewCategory({ name, description });
    // If creation successful → reset form fields
    form.reset();
  };

  const deleteCategory = async (id: string) => {
    await removeSingleCategory(id);
    // setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#1A202C] text-gray-100 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-10 tracking-wide">
          🗂️ Category Management
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Section - Add Category Form */}
          <div className="bg-[#2D3748] rounded-2xl shadow-lg shadow-black/30 p-8 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Add New Category
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Category Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  // value={formData.name}
                  // onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-[#1A202C] border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter category name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  // value={formData.description}
                  // onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#1A202C] border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter category description"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md shadow-blue-500/20"
              >
                Add Category
              </button>
            </form>
          </div>

          {/* Right Section - Categories List */}
          <div className="bg-[#2D3748] rounded-2xl shadow-lg shadow-black/30 p-8 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">
              All Categories{" "}
              <span className="text-sm text-gray-400">
                ({categoriesData?.data?.attributes.length})
              </span>
            </h2>

            {categoriesLoading ? (
              <div className="text-center py-12 text-gray-400 border border-dashed border-gray-600 rounded-lg animate-pulse">
                <p className="text-sm font-medium text-gray-300">
                  Loading categories...
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Please wait a moment.
                </p>
              </div>
            ) : categoriesData?.data?.attributes.length === 0 ? (
              <div className="text-center py-12 text-gray-400 border border-dashed border-gray-600 rounded-lg">
                <p className="text-sm font-medium">No categories added yet.</p>
                <p className="text-xs text-gray-500 mt-1">
                  Start by adding your first category.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {categoriesData?.data?.attributes.map((category: Category) => (
                  <div
                    key={category._id}
                    className="bg-[#1E2533] border border-gray-700 rounded-xl p-5 flex justify-between items-start hover:bg-[#232B3A] transition-all duration-200"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-gray-400 mt-1 text-sm">
                          {category.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Created: {formatTimeAgo(category.createdAt)}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteCategory(category._id)}
                      className="ml-4 text-red-400 hover:text-red-500 focus:outline-none transition"
                      title="Delete category"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
