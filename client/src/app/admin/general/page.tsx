/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
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
      console.error(error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await removeSingleCategory(id).unwrap();
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
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
      console.error(error);
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await removeSingleCoupon(id).unwrap();
      toast.success("Coupon deleted successfully");
    } catch (error) {
      toast.error("Failed to delete coupon");
      console.error(error);
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
      console.error(error);
    }
  };

  const deleteCondition = async (index: number) => {
    try {
      await removeCondition(index).unwrap();
      toast.success("Condition removed successfully");
    } catch (error) {
      toast.error("Failed to remove condition");
      console.error(error);
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
      console.error(error);
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
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-2">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          {/* <TabsTrigger value="coupons">Coupons</TabsTrigger> */}
          {/* <TabsTrigger value="conditions">Conditions</TabsTrigger> */}
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoriesManagement />
        </TabsContent>

        {/* <TabsContent value="coupons">
          <CouponsManagement />
        </TabsContent> */}

        {/* <TabsContent value="conditions">
          <ConditionsManagement />
        </TabsContent> */}

        <TabsContent value="settings">
          <GeneralSettingsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
