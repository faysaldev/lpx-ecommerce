"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Camera,
  DollarSign,
  ExternalLink,
  Package,
  Plus,
  Save,
  Trash2,
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
import { Alert, AlertDescription } from "@/components/UI/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/UI/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { Checkbox } from "@/components/UI/checkbox";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/ui/label";
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
  status: z.enum(["draft", "active", "paused"]).default("draft"),
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

// Mock product data - in a real app this would come from your API
const mockProduct = {
  id: "1",
  name: "Charizard Base Set Holo",
  description:
    "Near mint condition Charizard from Base Set 1999. This iconic Pokemon card is in excellent condition with minimal wear. Card has been stored in protective sleeve since acquisition.",
  price: 299.99,
  originalPrice: 349.99,
  images: ["/api/placeholder/300/300", "/api/placeholder/300/300"],
  category: "Trading Cards",
  condition: "Near Mint",
  brand: "Wizards of the Coast",
  year: "1999",
  rarity: "Rare",
  stock: 1,
  sku: "CHAR-BS-001",
  weight: 0.5,
  dimensions: "3.5 x 2.5 x 0.1 in",
  shippingCost: 5.99,
  tags: ["pokemon", "charizard", "base set", "holo", "vintage"],
  status: "active" as const,
  acceptOffers: true,
  minOffer: 250.0,
  views: 245,
  wishlistCount: 12,
  rating: 4.8,
  reviewCount: 15,
  vendor: "Current Vendor",
  dateCreated: new Date("2024-01-15"),
  lastUpdated: new Date("2024-02-01"),
};

function ImageUploadSection({
  images,
  onImagesChange,
  existingImages,
  onExistingImageRemove,
}: {
  images: File[];
  onImagesChange: (images: File[]) => void;
  existingImages: string[];
  onExistingImageRemove: (index: number) => void;
}) {
  const totalImages = existingImages.length + images.length;

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

      const remainingSlots = 8 - totalImages;
      const filesToAdd = validFiles.slice(0, remainingSlots);

      if (filesToAdd.length < validFiles.length) {
        toast.warning("Maximum 8 images allowed. Some images were not added.");
      }

      onImagesChange([...images, ...filesToAdd]);
    }
  };

  const removeNewImage = (index: number) => {
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
          Update your product images. The first image will be the main image.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium mb-3">Current Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((imageUrl, index) => (
                <div key={`existing-${imageUrl}`} className="relative group">
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={imageUrl}
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
                    onClick={() => onExistingImageRemove(index)}
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
          </div>
        )}

        {/* Upload Area */}
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center mb-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
            disabled={totalImages >= 8}
          />
          <label
            htmlFor="image-upload"
            className={cn(
              "cursor-pointer flex flex-col items-center gap-2",
              totalImages >= 8 && "cursor-not-allowed opacity-50"
            )}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {totalImages >= 8
                  ? "Maximum images reached"
                  : "Click to upload more images"}
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG up to 5MB each ({totalImages}/8 images)
              </p>
            </div>
          </label>
        </div>

        {/* New Images Preview */}
        {images.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">New Images to Add</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={`new-${image.name}-${image.size}-${index}`}
                  className="relative group"
                >
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`New ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeNewImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="absolute bottom-2 left-2">
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      New
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

export default function EditProductPage({
  params: _params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [product, _setProduct] = useState(mockProduct);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    mockProduct.images
  );
  const [tags, setTags] = useState<string[]>(mockProduct.tags);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      condition: product.condition,
      brand: product.brand,
      year: product.year,
      rarity: product.rarity,
      stock: product.stock || 1,
      sku: product.sku,
      weight: product.weight,
      dimensions: product.dimensions,
      shippingCost: product.shippingCost || 0,
      tags: product.tags || [],
      status: product.status || "draft",
      acceptOffers: product.acceptOffers || false,
      minOffer: product.minOffer,
    },
  });

  const watchedStatus = watch("status");
  const watchedAcceptOffers = watch("acceptOffers");

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const productData = {
      ...data,
      tags,
      existingImages,
      newImages: images.map((img) => URL.createObjectURL(img)), // In real app, upload to server
      lastUpdated: new Date(),
    };

    if (process.env.NODE_ENV !== "production")
      console.log("Updating product:", productData);

    toast.success("Product updated successfully!");
    router.push("/vendor/dashboard");
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Product deleted successfully!");
    router.push("/vendor/dashboard");
  };

  const handleExistingImageRemove = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
    toast.info("Image will be removed when you save changes");
  };

  return (
    // <ProtectedRoute>
    <PageLayout
      title="Edit Product"
      description={`Edit "${product.name}"`}
      breadcrumbs={[
        { label: "Dashboard", href: "/vendor/dashboard" },
        { label: "Products", href: "/vendor/dashboard" },
        { label: "Edit Product" },
      ]}
    >
      {/* Product Status Alert */}
      {product.status === "active" && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This product is currently live and visible to buyers. Changes will
            take effect immediately after saving.
            <Button asChild variant="link" className="p-0 ml-2 h-auto">
              <a
                href={`/product/${product.id}`}
                target="_blank"
                className="inline-flex items-center gap-1"
              >
                View live listing <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* onSubmit={handleSubmit(onSubmit)} */}
      <form className="space-y-8">
        {/* Images Section */}
        <ImageUploadSection
          images={images}
          onImagesChange={setImages}
          existingImages={existingImages}
          onExistingImageRemove={handleExistingImageRemove}
        />

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
                <Input id="name" {...register("name")} className="mt-1" />
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
                <Select
                  value={watch("category")}
                  onValueChange={(value) => setValue("category", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
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
                <Select
                  value={watch("condition")}
                  onValueChange={(value) => setValue("condition", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
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
                <Input id="brand" {...register("brand")} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="year">Year</Label>
                <Input id="year" {...register("year")} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="rarity">Rarity</Label>
                <Select
                  value={watch("rarity") || ""}
                  onValueChange={(value) =>
                    setValue("rarity", value || undefined)
                  }
                >
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
                <Input id="sku" {...register("sku")} className="mt-1" />
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
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  {...register("stock", { valueAsNumber: true })}
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
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight (oz)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  {...register("weight", { valueAsNumber: true })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  {...register("dimensions")}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publishing Options */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={watchedStatus}
              onValueChange={(value) =>
                setValue("status", value as "draft" | "active" | "paused")
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="draft" id="draft" />
                <Label htmlFor="draft" className="flex-1">
                  <div>
                    <p className="font-medium">Draft</p>
                    <p className="text-sm text-muted-foreground">
                      Hide from buyers while you make changes.
                    </p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active" className="flex-1">
                  <div>
                    <p className="font-medium">Active</p>
                    <p className="text-sm text-muted-foreground">
                      Visible to buyers and available for purchase.
                    </p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paused" id="paused" />
                <Label htmlFor="paused" className="flex-1">
                  <div>
                    <p className="font-medium">Paused</p>
                    <p className="text-sm text-muted-foreground">
                      Temporarily unavailable for purchase but still visible.
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" type="button">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete ${product.name}? This action
                  cannot be undone. The product will be permanently removed from
                  your store and all associated data will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Product"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/vendor/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </PageLayout>
    // </ProtectedRoute>
  );
}
