// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { DollarSign, Eye, Package, Save } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";

// import { Button } from "@/components/UI/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
// import { Input } from "@/components/UI/input";
// import { Label } from "@/components/UI/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/UI/select";
// import { Textarea } from "@/components/UI/textarea";
// import { useProductCreateMutation } from "@/redux/features/products/product";
// import TagInput from "@/components/Vendors/AddnewProduct/TagInput";
// import ConditionSelector from "@/components/Vendors/AddnewProduct/ConditionSelector";
// import ImageUploadSection from "@/components/Vendors/AddnewProduct/ImageUploadSection";
// import { useAppSelector } from "@/redux/hooks";
// import { selectCategories } from "@/redux/features/Common/CommonSlice";
// import {
//   gradedConditions,
//   ProductFormData,
//   productSchema,
//   rawConditions,
// } from "./productValidate";

// function AddNewProductForm() {
//   const router = useRouter();
//   const [images, setImages] = useState<File[]>([]);
//   const [tags, setTags] = useState<string[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
//   const categories = useAppSelector(selectCategories);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       productName: "",
//       description: "",
//       price: 0,
//       optionalPrice: 0,
//       category: "",
//       condition: "",
//       brand: "",
//       stockQuantity: 1,
//       tags: [],
//       isDraft: false,
//       discountPercentage: 0,
//       shippingCost: 0,
//       weight: 0,
//       dimensions: "",
//       acceptOffers: false,
//       minOffer: 0,
//     },
//   });

//   // Watch the fields that affect price calculation
//   const watchedOptionalPrice = watch("optionalPrice");
//   const watchedDiscountPercentage = watch("discountPercentage");
//   const [createProducts] = useProductCreateMutation();

//   // Calculate price whenever original price or discount percentage changes
//   useEffect(() => {
//     const originalPrice = watchedOptionalPrice || 0;
//     const discountPercentage = watchedDiscountPercentage || 0;

//     if (originalPrice > 0 && discountPercentage > 0) {
//       const discountAmount = (originalPrice * discountPercentage) / 100;
//       const finalPrice = originalPrice - discountAmount;
//       setCalculatedPrice(Number(finalPrice.toFixed(2)));
//       setValue("price", finalPrice);
//     } else if (originalPrice > 0) {
//       // If no discount, use original price as selling price
//       setCalculatedPrice(originalPrice);
//       setValue("price", originalPrice);
//     } else {
//       // Reset if no original price
//       setCalculatedPrice(0);
//       setValue("price", 0);
//     }
//   }, [watchedOptionalPrice, watchedDiscountPercentage, setValue]);

//   const onSubmit = async (data: ProductFormData) => {
//     setIsSubmitting(true);

//     // Check if images are selected
//     if (images.length === 0) {
//       toast.error("Please upload at least one image.");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const formData = new FormData();

//       // Append all form data
//       Object.entries(data).forEach(([key, value]) => {
//         if (value !== undefined && value !== null) {
//           if (typeof value === "boolean") {
//             formData.append(key, value.toString());
//           } else {
//             formData.append(key, value.toString());
//           }
//         }
//       });

//       // Append images
//       images.forEach((image) => {
//         formData.append("image", image);
//       });

//       if (tags) {
//         tags?.map((tag) => formData.append("tags", tag));
//       }

//       // Submit based on draft status
//       if (data.isDraft) {
//         // Set the type to 'true' for drafts
//         await createProducts({ productInfo: formData, type: "true" }).unwrap(); // Save as draft
//         toast.success("Product saved as draft!");
//       } else {
//         // Set the type to 'false' for published products
//         await createProducts({ productInfo: formData, type: "false" }).unwrap(); // Save as published
//         toast.success("Product published successfully!");
//       }

//       router.push("/vendor/dashboard");
//     } catch (error) {
//       toast.error("An error occurred while creating the product.");
//       console.error("Error creating product:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Set isDraft flag dynamically based on the button clicked
//   const handleSaveDraft = () => {
//     setValue("isDraft", true);
//     handleSubmit(onSubmit)();
//   };

//   const handlePublishNow = () => {
//     setValue("isDraft", false);
//     handleSubmit(onSubmit)();
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//       {/* Images Section */}
//       <ImageUploadSection images={images} onImagesChange={setImages} />

//       {/* Basic Information */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Package className="h-5 w-5" />
//             Product Information
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="grid md:grid-cols-2 gap-6">
//             {/* Product Name */}
//             <div className="md:col-span-2">
//               <Label htmlFor="productName" className="text-base font-medium">
//                 Product Name *
//               </Label>
//               <Input
//                 id="productName"
//                 {...register("productName")}
//                 placeholder="Enter product name"
//                 className="mt-2 h-11"
//               />
//               {errors.productName && (
//                 <p className="text-sm text-destructive mt-2">
//                   {errors.productName.message}
//                 </p>
//               )}
//             </div>

//             {/* Description */}
//             <div className="md:col-span-2">
//               <Label htmlFor="description" className="text-base font-medium">
//                 Product Description *
//               </Label>
//               <Textarea
//                 id="description"
//                 {...register("description")}
//                 placeholder="Provide detailed description including features, specifications, and key selling points"
//                 className="mt-2 min-h-[140px] resize-vertical"
//               />
//               {errors.description && (
//                 <p className="text-sm text-destructive mt-2">
//                   {errors.description.message}
//                 </p>
//               )}
//             </div>

//             {/* Category */}
//             <div>
//               <Label htmlFor="category" className="text-base font-medium">
//                 Category *
//               </Label>
//               <Select onValueChange={(value) => setValue("category", value)}>
//                 <SelectTrigger className="mt-2 h-11">
//                   <SelectValue placeholder="Select category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categories?.map((category) => (
//                     <SelectItem key={category?._id} value={category?.name}>
//                       {category?.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {errors.category && (
//                 <p className="text-sm text-destructive mt-2">
//                   {errors.category.message}
//                 </p>
//               )}
//             </div>

//             {/* Brand */}
//             <div>
//               <Label htmlFor="brand" className="text-base font-medium">
//                 Brand/Manufacturer
//               </Label>
//               <Input
//                 id="brand"
//                 {...register("brand")}
//                 placeholder="Enter brand name"
//                 className="mt-2 h-11"
//               />
//             </div>

//             {/* Condition */}
//             <div className="md:col-span-2">
//               <Label className="text-base font-medium block mb-2">
//                 Condition *
//               </Label>
//               <ConditionSelector
//                 rawConditions={rawConditions}
//                 gradedConditions={gradedConditions}
//                 value={watch("condition")}
//                 onChange={(value) => setValue("condition", value)}
//               />
//               {errors.condition && (
//                 <p className="text-sm text-destructive mt-2">
//                   {errors.condition.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Tags */}
//           <div>
//             <Label className="text-base font-medium">Product Tags</Label>
//             <p className="text-sm text-muted-foreground mt-2 mb-3">
//               Add relevant tags to improve product visibility and searchability
//             </p>
//             <TagInput tags={tags} onTagsChange={setTags} />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Pricing & Inventory */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <DollarSign className="h-5 w-5" />
//             Pricing & Inventory
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {/* Original Price */}
//             <div>
//               <Label htmlFor="optionalPrice" className="text-base font-medium">
//                 Original Price *
//               </Label>
//               <Input
//                 id="optionalPrice"
//                 type="number"
//                 step="0.01"
//                 min="0.01"
//                 {...register("optionalPrice", { valueAsNumber: true })}
//                 placeholder="0.00"
//                 className="mt-2 h-11"
//               />
//               {errors.optionalPrice && (
//                 <p className="text-sm text-destructive mt-2">
//                   {errors.optionalPrice.message}
//                 </p>
//               )}
//               <p className="text-xs text-muted-foreground mt-2">
//                 Base price before any discounts
//               </p>
//             </div>

//             {/* Discount Percentage */}
//             <div>
//               <Label
//                 htmlFor="discountPercentage"
//                 className="text-base font-medium"
//               >
//                 Discount %
//               </Label>
//               <Input
//                 id="discountPercentage"
//                 type="number"
//                 min="0"
//                 max="100"
//                 {...register("discountPercentage", { valueAsNumber: true })}
//                 placeholder="0"
//                 className="mt-2 h-11"
//               />
//               <p className="text-xs text-muted-foreground mt-2">
//                 Enter percentage (0-100)
//               </p>
//               {errors.discountPercentage && (
//                 <p className="text-sm text-destructive mt-2">
//                   {errors.discountPercentage.message}
//                 </p>
//               )}
//             </div>

//             {/* Selling Price */}
//             <div>
//               <Label htmlFor="price" className="text-base font-medium">
//                 Selling Price *
//               </Label>
//               <Input
//                 id="price"
//                 type="number"
//                 step="0.01"
//                 min="0.01"
//                 value={calculatedPrice}
//                 readOnly
//                 className="mt-2 h-11 bg-muted font-medium"
//               />
//               <p className="text-xs text-muted-foreground mt-2">
//                 Final price after discount
//               </p>
//               {errors.price && (
//                 <p className="text-sm text-destructive mt-2">
//                   {errors.price.message}
//                 </p>
//               )}
//             </div>

//             {/* Stock Quantity */}
//             <div>
//               <Label htmlFor="stockQuantity" className="text-base font-medium">
//                 Stock Quantity *
//               </Label>
//               <Input
//                 id="stockQuantity"
//                 type="number"
//                 min="1"
//                 {...register("stockQuantity", { valueAsNumber: true })}
//                 placeholder="1"
//                 className="mt-2 h-11"
//               />
//               {errors.stockQuantity && (
//                 <p className="text-sm text-destructive mt-2">
//                   {errors.stockQuantity.message}
//                 </p>
//               )}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Shipping Information */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Shipping Details</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid md:grid-cols-3 gap-6">
//             {/* Weight */}
//             <div>
//               <Label htmlFor="weight" className="text-base font-medium">
//                 Weight (oz)
//               </Label>
//               <Input
//                 id="weight"
//                 type="number"
//                 step="0.1"
//                 min="0"
//                 {...register("weight", { valueAsNumber: true })}
//                 placeholder="0.0"
//                 className="mt-2 h-11"
//               />
//               <p className="text-xs text-muted-foreground mt-2">
//                 Product weight in ounces
//               </p>
//             </div>

//             {/* Dimensions */}
//             <div>
//               <Label htmlFor="dimensions" className="text-base font-medium">
//                 Dimensions
//               </Label>
//               <Input
//                 id="dimensions"
//                 {...register("dimensions")}
//                 placeholder="L x W x H in"
//                 className="mt-2 h-11"
//               />
//               <p className="text-xs text-muted-foreground mt-2">
//                 Length × Width × Height
//               </p>
//             </div>

//             {/* Shipping Cost - Hidden but functional */}
//             <div className="hidden">
//               <Label htmlFor="shippingCost">Shipping Cost</Label>
//               <Input
//                 id="shippingCost"
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 {...register("shippingCost", { valueAsNumber: true })}
//                 placeholder="0.00"
//                 className="mt-2 h-11"
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Action Buttons */}
//       <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t gap-4">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={() => router.push("/vendor/dashboard")}
//           disabled={isSubmitting}
//           className="w-full sm:w-auto order-2 sm:order-1"
//         >
//           Cancel
//         </Button>

//         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2">
//           <Button
//             type="button"
//             variant="outline"
//             disabled={isSubmitting}
//             onClick={handleSaveDraft}
//             className="w-full sm:w-auto"
//           >
//             <Save className="mr-2 h-4 w-4" />
//             {isSubmitting ? "Saving..." : "Save Draft"}
//           </Button>
//           <Button
//             type="button"
//             disabled={isSubmitting}
//             onClick={handlePublishNow}
//             className="w-full sm:w-auto"
//           >
//             <Eye className="mr-2 h-4 w-4" />
//             {isSubmitting ? "Publishing..." : "Publish Product"}
//           </Button>
//         </div>
//       </div>
//     </form>
//   );
// }

// export default AddNewProductForm;

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, Eye, Package, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { Textarea } from "@/components/UI/textarea";
import { useProductCreateMutation } from "@/redux/features/products/product";
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
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      description: "",
      price: 0,
      optionalPrice: 0,
      category: "",
      condition: "",
      rarity: "",
      brand: "",
      stockQuantity: 1,
      tags: [],
      isDraft: false,
      discountPercentage: 0,
      shippingCost: 0,
      weight: 0,
      dimensions: "",
      acceptOffers: false,
      minOffer: 0,
    },
  });

  // Watch the fields that affect price calculation
  const watchedOptionalPrice = watch("optionalPrice");
  const watchedDiscountPercentage = watch("discountPercentage");
  const [createProducts] = useProductCreateMutation();

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

    // Check if images are selected
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      setIsSubmitting(false);
      return;
    }

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

      // Append images
      images.forEach((image) => {
        formData.append("image", image);
      });

      if (tags) {
        tags?.map((tag) => formData.append("tags", tag));
      }

      // Submit based on draft status
      if (data.isDraft) {
        // Set the type to 'true' for drafts
        await createProducts({ productInfo: formData, type: "true" }).unwrap(); // Save as draft
        toast.success("Product saved as draft!");
      } else {
        // Set the type to 'false' for published products
        await createProducts({ productInfo: formData, type: "false" }).unwrap(); // Save as published
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

  // Set isDraft flag dynamically based on the button clicked
  const handleSaveDraft = () => {
    setValue("isDraft", true);
    handleSubmit(onSubmit)();
  };

  const handlePublishNow = () => {
    setValue("isDraft", false);
    handleSubmit(onSubmit)();
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
            onClick={handleSaveDraft}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={handlePublishNow}
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
