"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, DollarSign, Eye, Package, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Checkbox } from "@/components/UI/checkbox";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { RadioGroup, RadioGroupItem } from "@/components/UI/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { Separator } from "@/components/UI/separator";
import { Textarea } from "@/components/UI/textarea";
import {
  useDraftsCreateMutation,
  useProductCreateMutation,
} from "@/redux/features/products/product";
import TagInput from "@/components/Vendors/AddnewProduct/TagInput";
import ConditionSelector from "@/components/Vendors/AddnewProduct/ConditionSelector";
import ImageUploadSection from "@/components/Vendors/AddnewProduct/ImageUploadSection";
import { useAppSelector } from "@/redux/hooks";
import { selectCategories } from "@/redux/features/Common/CommonSlice";

const productSchema = z.object({
  productName: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Name too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description too long"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  optionalPrice: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  condition: z.string().min(1, "Condition is required"),
  rarity: z.string().min(1, "Rarity is required"),
  brand: z.string().optional(),
  stockQuantity: z.number().min(1, "Stock must be at least 1").default(1),
  tags: z.array(z.string()).default([]),
  isDraft: z.boolean().default(true),
  discountPercentage: z.number().min(0).max(100).optional(),
  shippingCost: z
    .number()
    .min(0, "Shipping cost cannot be negative")
    .default(0),
  weight: z.number().min(0, "Weight cannot be negative").optional(),
  dimensions: z.string().optional(),
  acceptOffers: z.boolean().default(false),
  minOffer: z.number().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const rawConditions = [
  "Mint",
  "Near Mint",
  "Excellent",
  "Very Good",
  "Good",
  "Fair",
  "Poor",
];

const gradedConditions = ["CGC Graded", "PSA Graded", "BGS Graded"];

const rarities = [
  "Common",
  "Uncommon",
  "Rare",
  "Super Rare",
  "Ultra Rare",
  "Secret Rare",
  "Legendary",
  "Mythic",
  "Promo",
  "First Edition",
];

export default function NewProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const categories = useAppSelector(selectCategories);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isDraft: true,
      stockQuantity: 1,
      shippingCost: 0,
      acceptOffers: false,
    },
  });

  const watchedIsDraft = watch("isDraft");
  const watchedAcceptOffers = watch("acceptOffers");
  const [createProducts] = useProductCreateMutation();
  const [createDrafts] = useDraftsCreateMutation();

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append all form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === "boolean") {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      console.log(tags);

      // Append images
      images.forEach((image) => {
        formData.append("image", image);
      });
      formData.append("vendor", "68d4c54fd4a487006236fabc");
      if (tags) {
        tags?.map((tag) => formData.append("tags", tag));
      }

      // Submit based on draft status
      if (data.isDraft) {
        await createDrafts(formData).unwrap();
        toast.success("Product saved as draft!");
      } else {
        await createProducts(formData).unwrap();
        toast.success("Product published successfully!");
      }

      router.push("/vendor/dashboard");
    } catch (error) {
      toast.error("An error occurred while creating the product.");
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // <ProtectedRoute>
    <PageLayout
      title="Add New Product"
      description="Create a new product listing for your store"
      breadcrumbs={[
        { label: "Dashboard", href: "/vendor/dashboard" },
        { label: "Products", href: "/vendor/dashboard" },
        { label: "New Product" },
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Images Section */}
        <ImageUploadSection images={images} onImagesChange={setImages} />

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  {...register("productName")}
                  placeholder="e.g., Charizard Base Set Holo"
                  className="mt-1"
                />
                {errors.productName && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.productName.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Describe your product in detail. Include condition, authenticity, provenance, and any special features."
                  className="mt-1 min-h-[120px]"
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category?._id} value={category?.name}>
                        {category?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="rarity">Rarity *</Label>
                <Select onValueChange={(value) => setValue("rarity", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    {rarities.map((rarity) => (
                      <SelectItem key={rarity} value={rarity}>
                        {rarity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.rarity && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.rarity.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="brand">Brand/Manufacturer</Label>
                <Input
                  id="brand"
                  {...register("brand")}
                  placeholder="e.g., Topps, Wizards of the Coast"
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <ConditionSelector
                  rawConditions={rawConditions}
                  gradedConditions={gradedConditions}
                  value={watch("condition")}
                  onChange={(value) => setValue("condition", value)}
                />
                {errors.condition && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.condition.message}
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label>Tags (optional)</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Add tags to help buyers find your product (max 10)
              </p>
              <TagInput tags={tags} onTagsChange={setTags} />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing & Inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="mt-1"
                />
                {errors.price && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="optionalPrice">Original Price (optional)</Label>
                <Input
                  id="optionalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("optionalPrice", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Show as crossed out for sale pricing
                </p>
              </div>

              <div>
                <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  min="1"
                  {...register("stockQuantity", { valueAsNumber: true })}
                  placeholder="1"
                  className="mt-1"
                />
                {errors.stockQuantity && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.stockQuantity.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="discountPercentage">Discount Percentage</Label>
                <Input
                  id="discountPercentage"
                  type="number"
                  min="0"
                  max="100"
                  {...register("discountPercentage", { valueAsNumber: true })}
                  placeholder="0"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Percentage discount (0-100)
                </p>
              </div>
            </div>

            <Separator />

            {/* Offers */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptOffers"
                  checked={watchedAcceptOffers}
                  onCheckedChange={(checked) =>
                    setValue("acceptOffers", !!checked)
                  }
                />
                <Label htmlFor="acceptOffers" className="text-sm font-normal">
                  Accept offers from buyers
                </Label>
              </div>

              {watchedAcceptOffers && (
                <div className="ml-6">
                  <Label htmlFor="minOffer">Minimum Offer Amount</Label>
                  <Input
                    id="minOffer"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("minOffer", { valueAsNumber: true })}
                    placeholder="Enter minimum acceptable offer"
                    className="mt-1 max-w-xs"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Shipping */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="shippingCost">Shipping Cost</Label>
                <Input
                  id="shippingCost"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("shippingCost", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Set to 0 for free shipping
                </p>
              </div>

              <div>
                <Label htmlFor="weight">Weight (oz)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  {...register("weight", { valueAsNumber: true })}
                  placeholder="e.g., 0.5"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  {...register("dimensions")}
                  placeholder="e.g., 3.5 x 2.5 x 0.1 in"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publishing Options */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing Options</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={watchedIsDraft ? "draft" : "active"}
              onValueChange={(value) => setValue("isDraft", value === "draft")}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="draft" id="draft" />
                <Label htmlFor="draft" className="flex-1">
                  <div>
                    <p className="font-medium">Save as Draft</p>
                    <p className="text-sm text-muted-foreground">
                      Save your product without publishing. You can edit and
                      publish later.
                    </p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active" className="flex-1">
                  <div>
                    <p className="font-medium">Publish Now</p>
                    <p className="text-sm text-muted-foreground">
                      Make your product visible to buyers immediately.
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/vendor/dashboard")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => {
                setValue("isDraft", true);
                handleSubmit(onSubmit)();
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setValue("isDraft", false);
                handleSubmit(onSubmit)();
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              {isSubmitting ? "Publishing..." : "Publish Now"}
            </Button>
          </div>
        </div>
      </form>
    </PageLayout>
    // </ProtectedRoute>
  );
}
