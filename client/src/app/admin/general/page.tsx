/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Badge } from "@/components/UI/badge";
import {
  Trash2,
  Plus,
  Loader2,
  Tag,
  Percent,
  Settings,
  List,
} from "lucide-react";
import {
  useGetAllCategoriesQuery,
  useAddNewCategoryMutation,
  useRemoveSingleCategoryMutation,
  useGetAllCouponsQuery,
  useAddNewCouponMutation,
  useRemoveSingleCouponMutation,
  useGetGeneralSettingsQuery,
  useUpdateGeneralSettingsMutation,
  useAddNewConditionMutation,
  useRemoveConditionMutation,
} from "@/redux/features/admin/adminGeneral";

type Category = {
  _id: string;
  name: string;
  description: string;
};

type Coupon = {
  _id: string;
  code: string;
  percentage: number;
  isActive: boolean;
};

function formatTimeAgo(dateString: string): string {
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

// ==================== Categories Component ====================
function CategoriesManagement() {
  const { data: categoriesData, isLoading } = useGetAllCategoriesQuery({});
  const [createNewCategory, { isLoading: isCreating }] =
    useAddNewCategoryMutation();
  const [removeSingleCategory, { isLoading: isDeleting }] =
    useRemoveSingleCategoryMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    try {
      await createNewCategory({ name, description }).unwrap();
      toast.success("Category created successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await removeSingleCategory(id).unwrap();
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const categories = categoriesData?.data?.attributes || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add Category Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Add New Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter category name"
                required
                disabled={isCreating}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Enter category description"
                disabled={isCreating}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Categories{" "}
            <Badge variant="secondary">{categories.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">
                Loading categories...
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <Tag className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">No categories yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add your first category to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {categories.map((category: Category) => (
                <div
                  key={category._id}
                  className="flex justify-between items-start p-4 border rounded-lg hover:bg-accent transition"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCategory(category._id)}
                    disabled={isDeleting}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== Coupons Component ====================
function CouponsManagement() {
  const { data: couponsData, isLoading } = useGetAllCouponsQuery({});
  const [addNewCoupon, { isLoading: isCreating }] = useAddNewCouponMutation();
  const [removeSingleCoupon, { isLoading: isDeleting }] =
    useRemoveSingleCouponMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const code = formData.get("code") as string;
    const percentage = parseInt(formData.get("percentage") as string);

    if (percentage < 1 || percentage > 100) {
      toast.error("Percentage must be between 1 and 100");
      return;
    }

    try {
      await addNewCoupon({ code: code.toUpperCase(), percentage }).unwrap();
      toast.success("Coupon created successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to create coupon");
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await removeSingleCoupon(id).unwrap();
      toast.success("Coupon deleted successfully");
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };

  const coupons = couponsData?.data?.attributes || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add Coupon Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Add New Coupon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="code">
                Coupon Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                name="code"
                placeholder="e.g., SAVE20"
                required
                disabled={isCreating}
                className="uppercase"
              />
            </div>

            <div>
              <Label htmlFor="percentage">
                Discount Percentage <span className="text-red-500">*</span>
              </Label>
              <Input
                id="percentage"
                name="percentage"
                type="number"
                min="1"
                max="100"
                placeholder="Enter percentage (1-100)"
                required
                disabled={isCreating}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Coupon
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Coupons List */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Coupons <Badge variant="secondary">{coupons.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">
                Loading coupons...
              </p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <Percent className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">No coupons yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create your first coupon code
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {coupons.map((coupon: Coupon) => (
                <div
                  key={coupon._id}
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <Percent className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold font-mono">{coupon.code}</h3>
                      <p className="text-sm text-muted-foreground">
                        {coupon.percentage}% discount
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={coupon.isActive ? "default" : "secondary"}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCoupon(coupon._id)}
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== Conditions Component ====================
function ConditionsManagement() {
  const { data: generalSettings, isLoading } = useGetGeneralSettingsQuery({});
  const [addNewCondition, { isLoading: isCreating }] =
    useAddNewConditionMutation();
  const [removeCondition, { isLoading: isDeleting }] =
    useRemoveConditionMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const condition = formData.get("condition") as string;

    try {
      await addNewCondition({ condition }).unwrap();
      toast.success("Condition added successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to add condition");
    }
  };

  const deleteCondition = async (index: number) => {
    try {
      await removeCondition(index).unwrap();
      toast.success("Condition removed successfully");
    } catch (error) {
      toast.error("Failed to remove condition");
    }
  };

  const conditions = generalSettings?.data?.attributes?.conditions || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add Condition Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Add New Condition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="condition">
                Condition Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="condition"
                name="condition"
                placeholder="e.g., Near Mint, Good, Fair"
                required
                disabled={isCreating}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Product condition types for sellers to choose from
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Condition
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Conditions List */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Conditions{" "}
            <Badge variant="secondary">{conditions.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">
                Loading conditions...
              </p>
            </div>
          ) : conditions.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <List className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">No conditions yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add product condition types
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {conditions.map((condition: string, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent transition"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span className="font-medium">{condition}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCondition(index)}
                    disabled={isDeleting}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== General Settings Component ====================
function GeneralSettingsManagement() {
  const { data: generalSettings, isLoading } = useGetGeneralSettingsQuery({});
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateGeneralSettingsMutation();

  const settings = generalSettings?.data?.attributes;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const shippingCharge = parseFloat(formData.get("shippingCharge") as string);
    const platformCharge = parseFloat(formData.get("platformCharge") as string);
    const estimatedTax = parseFloat(formData.get("estimatedTax") as string);

    try {
      await updateSettings({
        shippingCharge,
        platformCharge,
        estimatedTax,
      }).unwrap();
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground mt-2">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Platform Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="shippingCharge">Shipping Charge (AED)</Label>
              <Input
                id="shippingCharge"
                name="shippingCharge"
                type="number"
                step="0.01"
                min="0"
                defaultValue={settings?.shippingCharge || 0}
                disabled={isUpdating}
              />
            </div>

            <div>
              <Label htmlFor="platformCharge">Platform Charge (%)</Label>
              <Input
                id="platformCharge"
                name="platformCharge"
                type="number"
                step="0.01"
                min="0"
                max="100"
                defaultValue={settings?.platformCharge || 0}
                disabled={isUpdating}
              />
            </div>

            <div>
              <Label htmlFor="estimatedTax">Estimated Tax (%)</Label>
              <Input
                id="estimatedTax"
                name="estimatedTax"
                type="number"
                step="0.01"
                min="0"
                max="100"
                defaultValue={settings?.estimatedTax || 0}
                disabled={isUpdating}
              />
            </div>
          </div>

          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Settings"
            )}
          </Button>
        </form>

        {/* Display Current Settings */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="font-semibold mb-4">Current Configuration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  Total Categories
                </p>
                <p className="text-2xl font-bold">
                  {settings?.categories?.length || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Active Coupons</p>
                <p className="text-2xl font-bold">
                  {settings?.coupons?.length || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Conditions</p>
                <p className="text-2xl font-bold">
                  {settings?.conditions?.length || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">
                  {settings?.updatedAt
                    ? formatTimeAgo(settings.updatedAt)
                    : "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== Main Page Component ====================
export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">General Settings</h1>
        <p className="text-muted-foreground">
          Manage categories, coupons, conditions, and platform settings
        </p>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoriesManagement />
        </TabsContent>

        <TabsContent value="coupons">
          <CouponsManagement />
        </TabsContent>

        <TabsContent value="conditions">
          <ConditionsManagement />
        </TabsContent>

        <TabsContent value="settings">
          <GeneralSettingsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import {
//   useAddNewCategoryMutation,
//   useAddNewConditionMutation,
//   useAddNewCouponMutation,
//   useGetAllConditionsQuery,
//   useGetAllCouponsQuery,
//   useGetGeneralSettingsQuery,
//   useRemoveConditionMutation,
//   useRemoveSingleCategoryMutation,
//   useRemoveSingleCouponMutation,
//   useUpdateGeneralSettingsMutation,
// } from "@/redux/features/admin/adminGeneral";
// import { useAllCategoriesQuery } from "@/redux/features/BrowseCollectibles/BrowseCollectibles";
// import React, { useState } from "react";

// type Category = {
//   _id: string;
//   name: string;
//   description: string;
//   createdAt: string;
// };

// export function formatTimeAgo(dateString: string): string {
//   const date = new Date(dateString);
//   const now = new Date();
//   const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

//   const intervals: { [key: string]: number } = {
//     year: 31536000,
//     month: 2592000,
//     week: 604800,
//     day: 86400,
//     hour: 3600,
//     minute: 60,
//     second: 1,
//   };

//   for (const [unit, value] of Object.entries(intervals)) {
//     const interval = Math.floor(seconds / value);
//     if (interval >= 1) {
//       return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
//     }
//   }

//   return "just now";
// }

// function Page() {
//   const { data: categoriesData, isLoading: categoriesLoading } =
//     useAllCategoriesQuery({});
//   const [createNewCategory] = useAddNewCategoryMutation({});
//   const [removeSingleCategory] = useRemoveSingleCategoryMutation();

//   // 🎟 Coupons
//   const { data: coupons, isLoading: couponsLoading } = useGetAllCouponsQuery(
//     {}
//   );
//   const [addCoupon] = useAddNewCouponMutation();
//   const [removeCoupon] = useRemoveSingleCouponMutation();

//   // ⚙️ General Settings
//   const { data: generalSettings, isLoading: generalSettingsLoading } =
//     useGetGeneralSettingsQuery({});
//   const [updateGeneralSettings] = useUpdateGeneralSettingsMutation();

//   // 📋 Conditions
//   const { data: conditions, isLoading: conditionsLoading } =
//     useGetAllConditionsQuery({});
//   const [addCondition] = useAddNewConditionMutation();
//   const [removeCondition] = useRemoveConditionMutation();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const form = e.currentTarget; // keep reference to the form
//     const formData = new FormData(form);

//     const name = formData.get("name") as string;
//     const description = formData.get("description") as string;

//     const res = await createNewCategory({ name, description });
//     // If creation successful → reset form fields
//     form.reset();
//   };

//   console.log(coupons, "cupons");
//   console.log(generalSettings, "general setting");
//   console.log(conditions, "conditions");

//   const deleteCategory = async (id: string) => {
//     await removeSingleCategory(id);
//     // setCategories((prev) => prev.filter((category) => category.id !== id));
//   };

//   return (
//     <div className="min-h-screen bg-[#1A202C] text-gray-100 py-10 px-4 sm:px-8">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-white mb-10 tracking-wide">
//           🗂️ Category Management
//         </h1>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//           {/* Left Section - Add Category Form */}
//           <div className="bg-[#2D3748] rounded-2xl shadow-lg shadow-black/30 p-8 border border-gray-700">
//             <h2 className="text-2xl font-semibold text-white mb-6">
//               Add New Category
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Category Name */}
//               <div>
//                 <label
//                   htmlFor="name"
//                   className="block text-sm font-medium text-gray-300 mb-2"
//                 >
//                   Category Name <span className="text-red-400">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   // value={formData.name}
//                   // onChange={handleInputChange}
//                   className="w-full px-4 py-2.5 bg-[#1A202C] border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                   placeholder="Enter category name"
//                   required
//                 />
//               </div>

//               {/* Description */}
//               <div>
//                 <label
//                   htmlFor="description"
//                   className="block text-sm font-medium text-gray-300 mb-2"
//                 >
//                   Description
//                 </label>
//                 <textarea
//                   id="description"
//                   name="description"
//                   // value={formData.description}
//                   // onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-4 py-2.5 bg-[#1A202C] border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                   placeholder="Enter category description"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md shadow-blue-500/20"
//               >
//                 Add Category
//               </button>
//             </form>
//           </div>

//           {/* Right Section - Categories List */}
//           <div className="bg-[#2D3748] rounded-2xl shadow-lg shadow-black/30 p-8 border border-gray-700">
//             <h2 className="text-2xl font-semibold text-white mb-6">
//               All Categories{" "}
//               <span className="text-sm text-gray-400">
//                 ({categoriesData?.data?.attributes.length})
//               </span>
//             </h2>

//             {categoriesLoading ? (
//               <div className="text-center py-12 text-gray-400 border border-dashed border-gray-600 rounded-lg animate-pulse">
//                 <p className="text-sm font-medium text-gray-300">
//                   Loading categories...
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Please wait a moment.
//                 </p>
//               </div>
//             ) : categoriesData?.data?.attributes.length === 0 ? (
//               <div className="text-center py-12 text-gray-400 border border-dashed border-gray-600 rounded-lg">
//                 <p className="text-sm font-medium">No categories added yet.</p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Start by adding your first category.
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {categoriesData?.data?.attributes.map((category: Category) => (
//                   <div
//                     key={category._id}
//                     className="bg-[#1E2533] border border-gray-700 rounded-xl p-5 flex justify-between items-start hover:bg-[#232B3A] transition-all duration-200"
//                   >
//                     <div className="flex-1">
//                       <h3 className="text-lg font-semibold text-white">
//                         {category.name}
//                       </h3>
//                       {category.description && (
//                         <p className="text-gray-400 mt-1 text-sm">
//                           {category.description}
//                         </p>
//                       )}
//                       <p className="text-xs text-gray-500 mt-2">
//                         Created: {formatTimeAgo(category.createdAt)}
//                       </p>
//                     </div>

//                     <button
//                       onClick={() => deleteCategory(category._id)}
//                       className="ml-4 text-red-400 hover:text-red-500 focus:outline-none transition"
//                       title="Delete category"
//                     >
//                       <svg
//                         className="w-5 h-5"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Page;
