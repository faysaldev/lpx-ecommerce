"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
  DollarSign,
  Eye,
  Package,
  Plus,
  Save,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/UI/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
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
// import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import { cn } from "@/lib/utils";
import {
  useDraftsCreateMutation,
  useProductCreateMutation,
} from "@/redux/features/products/product";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(100, "Name too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description too long"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  originalPrice: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  condition: z.string().min(1, "Condition is required"),
  brand: z.string().optional(),
  year: z.string().optional(),
  rarity: z.string().optional(),
  stock: z.number().min(0, "Stock cannot be negative").default(1),
  sku: z.string().optional(),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
  shippingCost: z
    .number()
    .min(0, "Shipping cost cannot be negative")
    .default(0),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "active"]).default("draft"),
  acceptOffers: z.boolean().default(false),
  minOffer: z.number().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const categories = [
  "Trading Cards",
  "Comics",
  "Sports Cards",
  "Coins",
  "Stamps",
  "Toys",
  "Action Figures",
  "Vintage Items",
  "Memorabilia",
  "Art & Prints",
];

const conditions = [
  "Mint",
  "Near Mint",
  "Excellent",
  "Very Good",
  "Good",
  "Fair",
  "Poor",
  "CGC Graded",
  "PSA Graded",
  "BGS Graded",
];

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

function ImageUploadSection({
  images,
  onImagesChange,
}: {
  images: File[];
  onImagesChange: (images: File[]) => void;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter((file) => {
        const isValidType = file.type.startsWith("image/");
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
        return isValidType && isValidSize;
      });

      if (validFiles.length !== newFiles.length) {
        toast.error(
          "Some files were skipped. Only images under 5MB are allowed."
        );
      }

      onImagesChange([...images, ...validFiles]);
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Product Images
        </CardTitle>
        <CardDescription>
          Add up to 8 high-quality images of your product. The first image will
          be the main image.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Upload Area */}
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center mb-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
            disabled={images.length >= 8}
          />
          <label
            htmlFor="image-upload"
            className={cn(
              "cursor-pointer flex flex-col items-center gap-2",
              images.length >= 8 && "cursor-not-allowed opacity-50"
            )}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">Click to upload images</p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG up to 5MB each (max 8 images)
              </p>
            </div>
          </label>
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={`${image.name}-${image.size}-${index}`}
                className="relative group"
              >
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`Product ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2">
                    <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Main
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TagInput({
  tags,
  onTagsChange,
}: {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    if (
      inputValue.trim() &&
      !tags.includes(inputValue.trim()) &&
      tags.length < 10
    ) {
      onTagsChange([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a tag (e.g., vintage, rare, pokemon)"
          className="flex-1"
          maxLength={20}
        />
        <Button
          type="button"
          onClick={handleAddTag}
          variant="outline"
          disabled={
            !inputValue.trim() ||
            tags.includes(inputValue.trim()) ||
            tags.length >= 10
          }
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NewProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    // @ts-expect-error - Schema mismatch temporarily ignored for build
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: "draft",
      stock: 1,
      shippingCost: 0,
      acceptOffers: false,
    },
  });

  const watchedStatus = watch("status");
  const watchedAcceptOffers = watch("acceptOffers");
  const [createProducts] = useProductCreateMutation();
  const [createDrafts] = useDraftsCreateMutation();

  const prepareFormData = (
    data: ProductFormData,
    status: "draft" | "active"
  ) => {
    const formData = new FormData();

    // Adding simple fields to the form data
    formData.append("vendor", "68ce3947aa3b2c0748ddf305");
    formData.append("productName", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("condition", data.condition);
    formData.append("rarity", data.rarity || "");
    formData.append("price", data.price.toString());
    formData.append("optionalPrice", (data.originalPrice || 0).toString());
    formData.append("stockQuantity", data.stock.toString());
    formData.append("isDraft", (status === "draft").toString());

    // Adding the tags array as JSON string
    formData.append("tags", JSON.stringify(tags));

    // Adding images as actual files
    images.forEach((image, index) => {
      formData.append(`image`, image);
    });

    // Adding shipping information
    formData.append("shipping[shippingCost]", data.shippingCost.toString());
    formData.append("shipping[weight]", (data.weight || 0).toString());
    formData.append("shipping[dimensions]", data.dimensions || "");

    // Adding additional fields
    formData.append("brand", data.brand || "");
    formData.append("year", data.year || "");
    formData.append("sku", data.sku || "");
    formData.append("acceptOffers", data.acceptOffers.toString());
    formData.append("minOffer", (data.minOffer || 0).toString());

    return formData;
  };

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
      toast.error("Please add at least one product image");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = prepareFormData(data, data.status);

      // Log the form data for debugging
      console.log("FormData contents:", data.status);
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      if (data.status === "active") {
        await createProducts(formData);
      } else {
        await createDrafts(formData);
      }
      toast.success(
        data.status === "active"
          ? "Product published successfully!"
          : "Product saved as draft!"
      );
      router.push("/dashboard");
    } catch (error) {
      toast.error("An error occurred while creating the product.");
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = (e: React.MouseEvent) => {
    e.preventDefault();
    setValue("status", "draft");
    handleSubmit((data) => onSubmit(data))();
  };

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    setValue("status", "active");
    handleSubmit((data) => onSubmit(data))();
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
      <form className="space-y-8">
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
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., Charizard Base Set Holo"
                  className="mt-1"
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.name.message}
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
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
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
                <Label htmlFor="condition">Condition *</Label>
                <Select onValueChange={(value) => setValue("condition", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.condition && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.condition.message}
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

              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  {...register("year")}
                  placeholder="e.g., 1999, 2022"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="rarity">Rarity</Label>
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
              </div>

              <div>
                <Label htmlFor="sku">SKU/Item Number</Label>
                <Input
                  id="sku"
                  {...register("sku")}
                  placeholder="e.g., CHAR-BS-001"
                  className="mt-1"
                />
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
                <Label htmlFor="originalPrice">Original Price (optional)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("originalPrice", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Show as crossed out for sale pricing
                </p>
              </div>

              <div>
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  {...register("stock", { valueAsNumber: true })}
                  placeholder="1"
                  className="mt-1"
                />
                {errors.stock && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.stock.message}
                  </p>
                )}
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
              value={watchedStatus}
              onValueChange={(value) =>
                setValue("status", value as "draft" | "active")
              }
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
              onClick={handleSaveDraft}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={handlePublish}
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

// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Camera,
//   DollarSign,
//   Eye,
//   Package,
//   Plus,
//   Save,
//   Upload,
//   X,
// } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import * as z from "zod";
// import PageLayout from "@/components/layout/PageLayout";
// import { Button } from "@/components/UI/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/UI/card";
// import { Checkbox } from "@/components/UI/checkbox";
// import { Input } from "@/components/UI/input";
// import { Label } from "@/components/UI/label";
// import { RadioGroup, RadioGroupItem } from "@/components/UI/radio-group";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/UI/select";
// import { Separator } from "@/components/UI/separator";
// import { Textarea } from "@/components/UI/textarea";
// // import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
// import { cn } from "@/lib/utils";

// const productSchema = z.object({
//   name: z.string().min(1, "Product name is required").max(100, "Name too long"),
//   description: z
//     .string()
//     .min(10, "Description must be at least 10 characters")
//     .max(1000, "Description too long"),
//   price: z.number().min(0.01, "Price must be greater than 0"),
//   originalPrice: z.number().optional(),
//   category: z.string().min(1, "Category is required"),
//   condition: z.string().min(1, "Condition is required"),
//   brand: z.string().optional(),
//   year: z.string().optional(),
//   rarity: z.string().optional(),
//   stock: z.number().min(0, "Stock cannot be negative").default(1),
//   sku: z.string().optional(),
//   weight: z.number().optional(),
//   dimensions: z.string().optional(),
//   shippingCost: z
//     .number()
//     .min(0, "Shipping cost cannot be negative")
//     .default(0),
//   tags: z.array(z.string()).default([]),
//   status: z.enum(["draft", "active"]).default("draft"),
//   acceptOffers: z.boolean().default(false),
//   minOffer: z.number().optional(),
// });

// type ProductFormData = z.infer<typeof productSchema>;

// const categories = [
//   "Trading Cards",
//   "Comics",
//   "Sports Cards",
//   "Coins",
//   "Stamps",
//   "Toys",
//   "Action Figures",
//   "Vintage Items",
//   "Memorabilia",
//   "Art & Prints",
// ];

// const conditions = [
//   "Mint",
//   "Near Mint",
//   "Excellent",
//   "Very Good",
//   "Good",
//   "Fair",
//   "Poor",
//   "CGC Graded",
//   "PSA Graded",
//   "BGS Graded",
// ];

// const rarities = [
//   "Common",
//   "Uncommon",
//   "Rare",
//   "Super Rare",
//   "Ultra Rare",
//   "Secret Rare",
//   "Legendary",
//   "Mythic",
//   "Promo",
//   "First Edition",
// ];

// function ImageUploadSection({
//   images,
//   onImagesChange,
// }: {
//   images: File[];
//   onImagesChange: (images: File[]) => void;
// }) {
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const newFiles = Array.from(e.target.files);
//       const validFiles = newFiles.filter((file) => {
//         const isValidType = file.type.startsWith("image/");
//         const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
//         return isValidType && isValidSize;
//       });

//       if (validFiles.length !== newFiles.length) {
//         toast.error(
//           "Some files were skipped. Only images under 5MB are allowed."
//         );
//       }

//       onImagesChange([...images, ...validFiles]);
//     }
//   };

//   const removeImage = (index: number) => {
//     onImagesChange(images.filter((_, i) => i !== index));
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Camera className="h-5 w-5" />
//           Product Images
//         </CardTitle>
//         <CardDescription>
//           Add up to 8 high-quality images of your product. The first image will
//           be the main image.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         {/* Upload Area */}
//         <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center mb-4">
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={handleFileChange}
//             className="hidden"
//             id="image-upload"
//             disabled={images.length >= 8}
//           />
//           <label
//             htmlFor="image-upload"
//             className={cn(
//               "cursor-pointer flex flex-col items-center gap-2",
//               images.length >= 8 && "cursor-not-allowed opacity-50"
//             )}
//           >
//             <Upload className="h-8 w-8 text-muted-foreground" />
//             <div>
//               <p className="font-medium">Click to upload images</p>
//               <p className="text-sm text-muted-foreground">
//                 PNG, JPG up to 5MB each (max 8 images)
//               </p>
//             </div>
//           </label>
//         </div>

//         {/* Image Grid */}
//         {images.length > 0 && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {images.map((image, index) => (
//               <div
//                 key={`${image.name}-${image.size}-${index}`}
//                 className="relative group"
//               >
//                 <div className="aspect-square bg-muted rounded-lg overflow-hidden">
//                   <Image
//                     src={URL.createObjectURL(image)}
//                     alt={`Product ${index + 1}`}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   size="sm"
//                   className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
//                   onClick={() => removeImage(index)}
//                 >
//                   <X className="h-3 w-3" />
//                 </Button>
//                 {index === 0 && (
//                   <div className="absolute bottom-2 left-2">
//                     <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
//                       Main
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// function TagInput({
//   tags,
//   onTagsChange,
// }: {
//   tags: string[];
//   onTagsChange: (tags: string[]) => void;
// }) {
//   const [inputValue, setInputValue] = useState("");

//   const handleAddTag = () => {
//     if (
//       inputValue.trim() &&
//       !tags.includes(inputValue.trim()) &&
//       tags.length < 10
//     ) {
//       onTagsChange([...tags, inputValue.trim()]);
//       setInputValue("");
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleAddTag();
//     }
//   };

//   const removeTag = (tagToRemove: string) => {
//     onTagsChange(tags.filter((tag) => tag !== tagToRemove));
//   };

//   return (
//     <div className="space-y-3">
//       <div className="flex gap-2">
//         <Input
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Add a tag (e.g., vintage, rare, pokemon)"
//           className="flex-1"
//           maxLength={20}
//         />
//         <Button
//           type="button"
//           onClick={handleAddTag}
//           variant="outline"
//           disabled={
//             !inputValue.trim() ||
//             tags.includes(inputValue.trim()) ||
//             tags.length >= 10
//           }
//         >
//           <Plus className="h-4 w-4" />
//         </Button>
//       </div>

//       {tags.length > 0 && (
//         <div className="flex flex-wrap gap-2">
//           {tags.map((tag) => (
//             <div
//               key={tag}
//               className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
//             >
//               {tag}
//               <button
//                 type="button"
//                 onClick={() => removeTag(tag)}
//                 className="hover:text-destructive"
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function NewProductPage() {
//   const router = useRouter();
//   const [images, setImages] = useState<File[]>([]);
//   const [tags, setTags] = useState<string[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<ProductFormData>({
//     // @ts-expect-error - Schema mismatch temporarily ignored for build
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       status: "draft",
//       stock: 1,
//       shippingCost: 0,
//       acceptOffers: false,
//     },
//   });

//   const watchedStatus = watch("status");
//   const watchedAcceptOffers = watch("acceptOffers");

//   const onSubmit = async (data: ProductFormData) => {
//     if (images.length === 0) {
//       toast.error("Please add at least one product image");
//       return;
//     }

//     setIsSubmitting(true);

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     const productData = {
//       ...data,
//       tags,
//       images: images.map((img) => URL.createObjectURL(img)), // In real app, upload to server
//       vendor: "Current Vendor",
//       dateCreated: new Date(),
//       lastUpdated: new Date(),
//     };

//     // if (process.env.NODE_ENV !== "production")
//     console.log("Creating product:", productData);

//     toast.success(
//       data.status === "active"
//         ? "Product published successfully!"
//         : "Product saved as draft!"
//     );

//     router.push("/vendor/dashboard");
//   };

//   return (
//     // <ProtectedRoute>
//     <PageLayout
//       title="Add New Product"
//       description="Create a new product listing for your store"
//       breadcrumbs={[
//         { label: "Dashboard", href: "/vendor/dashboard" },
//         { label: "Products", href: "/vendor/dashboard" },
//         { label: "New Product" },
//       ]}
//     >
//       <form onSubmit={handleSubmit} className="space-y-8">
//         {/* Images Section */}
//         <ImageUploadSection images={images} onImagesChange={setImages} />

//         {/* Basic Information */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Package className="h-5 w-5" />
//               Basic Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid md:grid-cols-2 gap-4">
//               <div className="md:col-span-2">
//                 <Label htmlFor="name">Product Name *</Label>
//                 <Input
//                   id="name"
//                   {...register("name")}
//                   placeholder="e.g., Charizard Base Set Holo"
//                   className="mt-1"
//                 />
//                 {errors.name && (
//                   <p className="text-sm text-destructive mt-1">
//                     {errors.name.message}
//                   </p>
//                 )}
//               </div>

//               <div className="md:col-span-2">
//                 <Label htmlFor="description">Description *</Label>
//                 <Textarea
//                   id="description"
//                   {...register("description")}
//                   placeholder="Describe your product in detail. Include condition, authenticity, provenance, and any special features."
//                   className="mt-1 min-h-[120px]"
//                 />
//                 {errors.description && (
//                   <p className="text-sm text-destructive mt-1">
//                     {errors.description.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <Label htmlFor="category">Category *</Label>
//                 <Select onValueChange={(value) => setValue("category", value)}>
//                   <SelectTrigger className="mt-1">
//                     <SelectValue placeholder="Select category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {categories.map((category) => (
//                       <SelectItem key={category} value={category}>
//                         {category}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {errors.category && (
//                   <p className="text-sm text-destructive mt-1">
//                     {errors.category.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <Label htmlFor="condition">Condition *</Label>
//                 <Select onValueChange={(value) => setValue("condition", value)}>
//                   <SelectTrigger className="mt-1">
//                     <SelectValue placeholder="Select condition" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {conditions.map((condition) => (
//                       <SelectItem key={condition} value={condition}>
//                         {condition}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {errors.condition && (
//                   <p className="text-sm text-destructive mt-1">
//                     {errors.condition.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <Label htmlFor="brand">Brand/Manufacturer</Label>
//                 <Input
//                   id="brand"
//                   {...register("brand")}
//                   placeholder="e.g., Topps, Wizards of the Coast"
//                   className="mt-1"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="year">Year</Label>
//                 <Input
//                   id="year"
//                   {...register("year")}
//                   placeholder="e.g., 1999, 2022"
//                   className="mt-1"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="rarity">Rarity</Label>
//                 <Select onValueChange={(value) => setValue("rarity", value)}>
//                   <SelectTrigger className="mt-1">
//                     <SelectValue placeholder="Select rarity" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {rarities.map((rarity) => (
//                       <SelectItem key={rarity} value={rarity}>
//                         {rarity}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label htmlFor="sku">SKU/Item Number</Label>
//                 <Input
//                   id="sku"
//                   {...register("sku")}
//                   placeholder="e.g., CHAR-BS-001"
//                   className="mt-1"
//                 />
//               </div>
//             </div>

//             {/* Tags */}
//             <div>
//               <Label>Tags (optional)</Label>
//               <p className="text-sm text-muted-foreground mb-2">
//                 Add tags to help buyers find your product (max 10)
//               </p>
//               <TagInput tags={tags} onTagsChange={setTags} />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Pricing & Inventory */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <DollarSign className="h-5 w-5" />
//               Pricing & Inventory
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid md:grid-cols-3 gap-4">
//               <div>
//                 <Label htmlFor="price">Price *</Label>
//                 <Input
//                   id="price"
//                   type="number"
//                   step="0.01"
//                   min="0.01"
//                   {...register("price", { valueAsNumber: true })}
//                   placeholder="0.00"
//                   className="mt-1"
//                 />
//                 {errors.price && (
//                   <p className="text-sm text-destructive mt-1">
//                     {errors.price.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <Label htmlFor="originalPrice">Original Price (optional)</Label>
//                 <Input
//                   id="originalPrice"
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   {...register("originalPrice", { valueAsNumber: true })}
//                   placeholder="0.00"
//                   className="mt-1"
//                 />
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Show as crossed out for sale pricing
//                 </p>
//               </div>

//               <div>
//                 <Label htmlFor="stock">Stock Quantity *</Label>
//                 <Input
//                   id="stock"
//                   type="number"
//                   min="0"
//                   {...register("stock", { valueAsNumber: true })}
//                   placeholder="1"
//                   className="mt-1"
//                 />
//                 {errors.stock && (
//                   <p className="text-sm text-destructive mt-1">
//                     {errors.stock.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <Separator />

//             {/* Offers */}
//             <div className="space-y-4">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="acceptOffers"
//                   checked={watchedAcceptOffers}
//                   onCheckedChange={(checked) =>
//                     setValue("acceptOffers", !!checked)
//                   }
//                 />
//                 <Label htmlFor="acceptOffers" className="text-sm font-normal">
//                   Accept offers from buyers
//                 </Label>
//               </div>

//               {watchedAcceptOffers && (
//                 <div className="ml-6">
//                   <Label htmlFor="minOffer">Minimum Offer Amount</Label>
//                   <Input
//                     id="minOffer"
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     {...register("minOffer", { valueAsNumber: true })}
//                     placeholder="Enter minimum acceptable offer"
//                     className="mt-1 max-w-xs"
//                   />
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Shipping */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Shipping Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid md:grid-cols-3 gap-4">
//               <div>
//                 <Label htmlFor="shippingCost">Shipping Cost</Label>
//                 <Input
//                   id="shippingCost"
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   {...register("shippingCost", { valueAsNumber: true })}
//                   placeholder="0.00"
//                   className="mt-1"
//                 />
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Set to 0 for free shipping
//                 </p>
//               </div>

//               <div>
//                 <Label htmlFor="weight">Weight (oz)</Label>
//                 <Input
//                   id="weight"
//                   type="number"
//                   step="0.1"
//                   min="0"
//                   {...register("weight", { valueAsNumber: true })}
//                   placeholder="e.g., 0.5"
//                   className="mt-1"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="dimensions">Dimensions</Label>
//                 <Input
//                   id="dimensions"
//                   {...register("dimensions")}
//                   placeholder="e.g., 3.5 x 2.5 x 0.1 in"
//                   className="mt-1"
//                 />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Publishing Options */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Publishing Options</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <RadioGroup
//               value={watchedStatus}
//               onValueChange={(value) =>
//                 setValue("status", value as "draft" | "active")
//               }
//               className="space-y-3"
//             >
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="draft" id="draft" />
//                 <Label htmlFor="draft" className="flex-1">
//                   <div>
//                     <p className="font-medium">Save as Draft</p>
//                     <p className="text-sm text-muted-foreground">
//                       Save your product without publishing. You can edit and
//                       publish later.
//                     </p>
//                   </div>
//                 </Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="active" id="active" />
//                 <Label htmlFor="active" className="flex-1">
//                   <div>
//                     <p className="font-medium">Publish Now</p>
//                     <p className="text-sm text-muted-foreground">
//                       Make your product visible to buyers immediately.
//                     </p>
//                   </div>
//                 </Label>
//               </div>
//             </RadioGroup>
//           </CardContent>
//         </Card>

//         {/* Action Buttons */}
//         <div className="flex justify-between items-center pt-6 border-t">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => router.push("/vendor/dashboard")}
//           >
//             Cancel
//           </Button>

//           <div className="flex gap-3">
//             <Button
//               type="submit"
//               variant="outline"
//               disabled={isSubmitting}
//               onClick={() => setValue("status", "draft")}
//             >
//               <Save className="mr-2 h-4 w-4" />
//               {isSubmitting ? "Saving..." : "Save Draft"}
//             </Button>
//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               onClick={() => setValue("status", "active")}
//             >
//               <Eye className="mr-2 h-4 w-4" />
//               {isSubmitting ? "Publishing..." : "Publish Now"}
//             </Button>
//           </div>
//         </div>
//       </form>
//     </PageLayout>
//     // </ProtectedRoute>
//   );
// }
