"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, Eye, Package, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

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
import {
  gradedConditions,
  ProductFormData,
  productSchema,
  rarities,
  rawConditions,
} from "./productValidate";

function AddNewProductForm() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
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
      discountPercentage: 0,
      price: 0,
    },
  });

  // Watch the fields that affect price calculation
  const watchedOptionalPrice = watch("optionalPrice");
  const watchedDiscountPercentage = watch("discountPercentage");
  const watchedIsDraft = watch("isDraft");

  const [createProducts] = useProductCreateMutation();
  const [createDrafts] = useDraftsCreateMutation();

  // Calculate price whenever original price or discount percentage changes
  useEffect(() => {
    const originalPrice = watchedOptionalPrice || 0;
    const discountPercentage = watchedDiscountPercentage || 0;

    if (originalPrice > 0 && discountPercentage > 0) {
      const discountAmount = (originalPrice * discountPercentage) / 100;
      const finalPrice = originalPrice - discountAmount;
      setCalculatedPrice(Number(finalPrice.toFixed(2)));
      setValue("price", finalPrice);
    } else if (originalPrice > 0) {
      // If no discount, use original price as selling price
      setCalculatedPrice(originalPrice);
      setValue("price", originalPrice);
    } else {
      // Reset if no original price
      setCalculatedPrice(0);
      setValue("price", 0);
    }
  }, [watchedOptionalPrice, watchedDiscountPercentage, setValue]);

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
      // formData.append("vendor", "68d4c54fd4a487006236fabc");
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
              <Label htmlFor="optionalPrice">Original Price *</Label>
              <Input
                id="optionalPrice"
                type="number"
                step="0.01"
                min="0.01"
                {...register("optionalPrice", { valueAsNumber: true })}
                placeholder="0.00"
                className="mt-1"
              />
              {errors.optionalPrice && (
                <p className="text-sm text-destructive mt-1">
                  {errors.optionalPrice.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                The original price before discount
              </p>
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
              {errors.discountPercentage && (
                <p className="text-sm text-destructive mt-1">
                  {errors.discountPercentage.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Selling Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                value={calculatedPrice}
                readOnly
                className="mt-1 bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Calculated automatically
              </p>
              {errors.price && (
                <p className="text-sm text-destructive mt-1">
                  {errors.price.message}
                </p>
              )}
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
            <div className="hidden">
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
  );
}

export default AddNewProductForm;
