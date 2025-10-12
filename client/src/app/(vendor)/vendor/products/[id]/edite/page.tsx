/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import {
  AlertCircle,
  DollarSign,
  ExternalLink,
  Package,
  Save,
  ImagePlus,
  X,
  Upload,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
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
  useGetSingleProductQuery,
  useProductUpdateMutation,
} from "@/redux/features/products/product";
import TagInput from "@/components/Vendors/AddnewProduct/TagInput";
import { Alert, AlertDescription } from "@/components/UI/alert";
import Image from "next/image";
import { useSelector } from "react-redux";

const rawConditions = [
  "Mint",
  "Near Mint",
  "Excellent",
  "Very Good",
  "Good",
  "Fair",
  "Poor",
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

// Image Upload Section Component
interface ImageUploadSectionProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  existingImages?: string[];
  onExistingImagesChange?: (images: string[]) => void;
}

const ImageUploadSection = ({
  images,
  onImagesChange,
  existingImages = [],
  onExistingImagesChange,
}: ImageUploadSectionProps) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingPreviews, setExistingPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      const formattedImages = existingImages.map((img) => {
        const cleanPath = img.replace(/\\/g, "/");
        return `${process.env.NEXT_PUBLIC_BASE_URL}/${cleanPath}`;
      });
      setExistingPreviews(formattedImages);
    }
  }, [existingImages]);

  useEffect(() => {
    if (onExistingImagesChange) {
      const originalPaths = existingPreviews.map((preview) => {
        const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/`;
        return preview.replace(baseUrl, "").replace(/\//g, "\\");
      });
      onExistingImagesChange(originalPaths);
    }
  }, [existingPreviews, onExistingImagesChange]);

  useEffect(() => {
    if (images.length === 0) {
      setPreviews([]);
      return;
    }

    const newPreviews: string[] = [];
    images.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === images.length) {
          setPreviews([...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [images]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const validFiles = files.filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image file`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is larger than 5MB`);
          return false;
        }
        return true;
      });

      const totalImages =
        images.length + existingPreviews.length + validFiles.length;
      if (totalImages > 10) {
        toast.error("Maximum 10 images allowed");
        return;
      }

      onImagesChange([...images, ...validFiles]);
    },
    [images, existingPreviews.length, onImagesChange]
  );

  const removeNewImage = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    },
    [images, onImagesChange]
  );

  const removeExistingImage = useCallback(
    (index: number) => {
      const newExistingPreviews = existingPreviews.filter(
        (_, i) => i !== index
      );
      setExistingPreviews(newExistingPreviews);
    },
    [existingPreviews]
  );

  const replaceExistingImage = useCallback(
    (index: number) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
          }
          if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
          }
          const newExistingPreviews = existingPreviews.filter(
            (_, i) => i !== index
          );
          setExistingPreviews(newExistingPreviews);
          onImagesChange([...images, file]);
        }
      };
      input.click();
    },
    [existingPreviews, images, onImagesChange]
  );

  const totalImages = existingPreviews.length + previews.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImagePlus className="h-5 w-5" />
          Product Images
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload up to 10 high-quality images. First image will be the main
          product image.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {existingPreviews.map((preview, index) => (
            <div
              key={`existing-${index}`}
              className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden group"
            >
              <Image
                width={300}
                height={300}
                src={preview}
                alt={`Existing product ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => replaceExistingImage(index)}
                  className="h-8 px-2"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Replace
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => removeExistingImage(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}
            </div>
          ))}

          {previews.map((preview, index) => (
            <div
              key={`new-${index}`}
              className="relative aspect-square rounded-lg border-2 border-dashed border-primary/50 overflow-hidden group"
            >
              <Image
                width={300}
                height={300}
                src={preview}
                alt={`New upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => removeNewImage(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                New
              </div>
              {existingPreviews.length === 0 && index === 0 && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}
            </div>
          ))}

          {totalImages < 10 && (
            <Label
              htmlFor="image-upload"
              className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 bg-muted/50 hover:bg-muted"
            >
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <span className="text-xs text-muted-foreground text-center px-2">
                Add Image
              </span>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </Label>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {totalImages} / 10 images
          </span>
          {totalImages > 0 && (
            <span className="text-xs text-muted-foreground">
              {existingPreviews.length > 0 && (
                <span className="text-blue-600">
                  {existingPreviews.length} existing
                </span>
              )}
              {existingPreviews.length > 0 && previews.length > 0 && " • "}
              {previews.length > 0 && (
                <span className="text-green-600">{previews.length} new</span>
              )}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const NewProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetSingleProductQuery(id);
  const singleData = data?.data?.attributes;

  const categories = useSelector((state: any) => state.common.categories);
  const router = useRouter();

  // Form state
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [optionalPrice, setOptionalPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [rarity, setRarity] = useState("");
  const [brand, setBrand] = useState("");
  const [stockQuantity, setStockQuantity] = useState("1");
  const [isDraft, setIsDraft] = useState(true);
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [shippingCost, setShippingCost] = useState("0");
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [acceptOffers, setAcceptOffers] = useState(false);
  const [minOffer, setMinOffer] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [UpdateProducts] = useProductUpdateMutation();

  // Populate form with fetched data
  useEffect(() => {
    if (singleData) {
      setProductName(singleData.productName || "");
      setDescription(singleData.description || "");
      setPrice(singleData.price ? String(singleData.price) : "");
      setOptionalPrice(
        singleData.optionalPrice ? String(singleData.optionalPrice) : ""
      );
      setCategory(singleData.category || "");
      setCondition(singleData.condition || "");
      setRarity(singleData.rarity || "");
      setBrand(singleData.brand || "");
      setStockQuantity(String(singleData.stockQuantity || 1));
      setIsDraft(Boolean(singleData.isDraft));
      setDiscountPercentage(
        singleData.discountPercentage
          ? String(singleData.discountPercentage)
          : ""
      );
      setShippingCost(
        singleData.shipping?.shippingCost
          ? String(singleData.shipping.shippingCost)
          : "0"
      );
      setWeight(
        singleData.shipping?.weight ? String(singleData.shipping.weight) : ""
      );
      setDimensions(singleData.shipping?.dimensions || "");
      setAcceptOffers(Boolean(singleData.acceptOffers));
      setMinOffer(singleData.minOffer ? String(singleData.minOffer) : "");

      if (singleData.tags && Array.isArray(singleData.tags)) {
        const filteredTags = singleData.tags.filter(
          (tag: string) => tag && tag.trim() !== ""
        );
        setTags(filteredTags);
      }

      if (singleData.images && Array.isArray(singleData.images)) {
        setExistingImages(singleData.images);
      }
    }
  }, [singleData]);

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!productName.trim()) {
      newErrors.productName = "Product name is required";
    } else if (productName.length > 100) {
      newErrors.productName = "Name too long";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (description.length > 1000) {
      newErrors.description = "Description too long";
    }

    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!category) {
      newErrors.category = "Category is required";
    }

    if (!condition) {
      newErrors.condition = "Condition is required";
    }

    if (!rarity) {
      newErrors.rarity = "Rarity is required";
    }

    const stockNum = parseInt(stockQuantity);
    if (!stockQuantity || isNaN(stockNum) || stockNum < 1) {
      newErrors.stockQuantity = "Stock must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle update product
  const handleUpdateProduct = async () => {
    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();

    try {
      // Basic product information
      formData.append("productName", productName.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("category", category);
      formData.append("condition", condition);
      formData.append("rarity", rarity);
      formData.append("stockQuantity", stockQuantity);
      formData.append("isDraft", String(isDraft));
      formData.append("acceptOffers", String(acceptOffers));

      // Optional fields
      if (optionalPrice && parseFloat(optionalPrice) > 0) {
        formData.append("optionalPrice", optionalPrice);
      }

      if (brand && brand.trim()) {
        formData.append("brand", brand.trim());
      }

      if (discountPercentage && parseFloat(discountPercentage) >= 0) {
        formData.append("discountPercentage", discountPercentage);
      }

      if (minOffer && acceptOffers && parseFloat(minOffer) > 0) {
        formData.append("minOffer", minOffer);
      }

      // Shipping information
      formData.append("shippingCost", shippingCost);

      if (weight && parseFloat(weight) > 0) {
        formData.append("shippingWeight", weight);
      }

      if (dimensions && dimensions.trim()) {
        formData.append("shippingDimensions", dimensions.trim());
      }

      // Vendor ID
      if (singleData?.vendor?._id) {
        formData.append("vendor", singleData.vendor._id);
      }

      // Tags
      if (tags && tags.length > 0) {
        tags.forEach((tag) => {
          if (tag.trim()) {
            formData.append("tags", tag.trim());
          }
        });
      }

      // Existing images
      if (existingImages && existingImages.length > 0) {
        existingImages.forEach((img) => {
          formData.append("existingImages", img);
        });
      }

      // New images
      if (images.length > 0) {
        images.forEach((image) => {
          formData.append("images", image);
        });
      }

      // Calculate inStock
      formData.append("inStock", String(parseInt(stockQuantity) > 0));

      // Debug: Log FormData
      console.log("FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Send update request
      const res = await UpdateProducts({ id, data: formData });
      console.log("Update response:", res);

      if (res.error) {
        toast.error("Failed to update product. Please try again.");
        console.error("Update error:", res.error);
      } else {
        toast.success("Product updated successfully!");
        router.push("/vendor/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred while updating the product.");
      console.error("Error updating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PageLayout
        title="Edit Product"
        description="Loading..."
        breadcrumbs={[
          { label: "Dashboard", href: "/vendor/dashboard" },
          { label: "Products", href: "/vendor/dashboard" },
          { label: "Edit Product" },
        ]}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product data...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!singleData) {
    return (
      <PageLayout
        title="Edit Product"
        description="Product not found"
        breadcrumbs={[
          { label: "Dashboard", href: "/vendor/dashboard" },
          { label: "Products", href: "/vendor/dashboard" },
          { label: "Edit Product" },
        ]}
      >
        <div className="flex items-center justify-center py-12">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Product not found. It may have been deleted or you don't have
              permission to edit it.
            </AlertDescription>
          </Alert>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Edit Product"
      description={`Edit "${singleData.productName}"`}
      breadcrumbs={[
        { label: "Dashboard", href: "/vendor/dashboard" },
        { label: "Products", href: "/vendor/dashboard" },
        { label: "Edit Product" },
      ]}
    >
      {!singleData.isDraft && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This product is currently live and visible to buyers. Changes will
            take effect immediately after saving.
            <Button asChild variant="link" className="p-0 ml-2 h-auto">
              <a
                href={`/product/${singleData._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1"
              >
                View live listing <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        {/* Images Section */}
        <ImageUploadSection
          images={images}
          onImagesChange={setImages}
          existingImages={singleData.images}
          onExistingImagesChange={setExistingImages}
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
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., Charizard Base Set Holo"
                  className="mt-1"
                />
                {errors.productName && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.productName}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product in detail. Include condition, authenticity, provenance, and any special features."
                  className="mt-1 min-h-[120px]"
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat: any) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="rarity">Rarity *</Label>
                <Select value={rarity} onValueChange={setRarity}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    {rarities.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.rarity && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.rarity}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="brand">Brand/Manufacturer</Label>
                <Input
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g., Topps, Wizards of the Coast"
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="condition">Condition *</Label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {rawConditions?.map((c: any) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.condition && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.condition}
                  </p>
                )}
              </div>
            </div>

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
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="mt-1"
                />
                {errors.price && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.price}
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
                  value={optionalPrice}
                  onChange={(e) => setOptionalPrice(e.target.value)}
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
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  placeholder="1"
                  className="mt-1"
                />
                {errors.stockQuantity && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.stockQuantity}
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
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Percentage discount (0-100)
                </p>
              </div>
            </div>

            <Separator />
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
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
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
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 0.5"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
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
              value={isDraft ? "draft" : "active"}
              onValueChange={(value) => setIsDraft(value === "draft")}
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
              onClick={handleUpdateProduct}
              disabled={isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NewProductPage;

// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react/no-unescaped-entities */
// "use client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   AlertCircle,
//   DollarSign,
//   ExternalLink,
//   Package,
//   Save,
//   ImagePlus,
//   X,
//   Upload,
// } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState, useCallback } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import * as z from "zod";
// import PageLayout from "@/components/layout/PageLayout";
// import { Button } from "@/components/UI/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
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
// import {
//   useGetSingleProductQuery,
//   useProductUpdateMutation,
// } from "@/redux/features/products/product";
// import TagInput from "@/components/Vendors/AddnewProduct/TagInput";

// import { Alert, AlertDescription } from "@/components/UI/alert";
// import Image from "next/image";
// import { useSelector } from "react-redux";

// const productSchema = z.object({
//   productName: z
//     .string()
//     .min(1, "Product name is required")
//     .max(100, "Name too long"),
//   description: z
//     .string()
//     .min(10, "Description must be at least 10 characters")
//     .max(1000, "Description too long"),
//   price: z.number().min(0.01, "Price must be greater than 0"),
//   optionalPrice: z.number().optional(),
//   category: z.string().min(1, "Category is required"),
//   condition: z.string().min(1, "Condition is required"),
//   rarity: z.string().min(1, "Rarity is required"),
//   brand: z.string().optional(),
//   stockQuantity: z.number().min(1, "Stock must be at least 1").default(1),
//   tags: z.array(z.string()).default([]),
//   isDraft: z.boolean().default(true),
//   discountPercentage: z.number().min(0).max(100).optional(),
//   shippingCost: z
//     .number()
//     .min(0, "Shipping cost cannot be negative")
//     .default(0),
//   weight: z.number().min(0, "Weight cannot be negative").optional(),
//   dimensions: z.string().optional(),
//   acceptOffers: z.boolean().default(false),
//   minOffer: z.number().optional(),
// });

// type ProductFormData = z.infer<typeof productSchema>;

// const rawConditions = [
//   "Mint",
//   "Near Mint",
//   "Excellent",
//   "Very Good",
//   "Good",
//   "Fair",
//   "Poor",
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

// // Image Upload Section Component
// interface ImageUploadSectionProps {
//   images: File[];
//   onImagesChange: (images: File[]) => void;
//   existingImages?: string[];
//   onExistingImagesChange?: (images: string[]) => void;
// }

// const ImageUploadSection = ({
//   images,
//   onImagesChange,
//   existingImages = [],
//   onExistingImagesChange,
// }: ImageUploadSectionProps) => {
//   const [previews, setPreviews] = useState<string[]>([]);
//   const [existingPreviews, setExistingPreviews] = useState<string[]>([]);

//   // Load existing images from backend
//   useEffect(() => {
//     if (existingImages && existingImages.length > 0) {
//       const formattedImages = existingImages.map((img) => {
//         const cleanPath = img.replace(/\\/g, "/");
//         return `${process.env.NEXT_PUBLIC_BASE_URL}/${cleanPath}`;
//       });
//       setExistingPreviews(formattedImages);
//     }
//   }, [existingImages]);

//   // Sync existing previews with parent component
//   useEffect(() => {
//     if (onExistingImagesChange) {
//       const originalPaths = existingPreviews.map((preview) => {
//         const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/`;
//         return preview.replace(baseUrl, "").replace(/\//g, "\\");
//       });
//       onExistingImagesChange(originalPaths);
//     }
//   }, [existingPreviews, onExistingImagesChange]);

//   // Generate previews for new uploaded files
//   useEffect(() => {
//     if (images.length === 0) {
//       setPreviews([]);
//       return;
//     }

//     const newPreviews: string[] = [];
//     images.forEach((file) => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         newPreviews.push(reader.result as string);
//         if (newPreviews.length === images.length) {
//           setPreviews([...newPreviews]);
//         }
//       };
//       reader.readAsDataURL(file);
//     });

//     return () => {
//       previews.forEach((preview) => URL.revokeObjectURL(preview));
//     };
//   }, [images]);

//   const handleFileChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const files = Array.from(e.target.files || []);
//       if (files.length === 0) return;

//       const validFiles = files.filter((file) => {
//         if (!file.type.startsWith("image/")) {
//           toast.error(`${file.name} is not an image file`);
//           return false;
//         }
//         if (file.size > 5 * 1024 * 1024) {
//           toast.error(`${file.name} is larger than 5MB`);
//           return false;
//         }
//         return true;
//       });

//       const totalImages =
//         images.length + existingPreviews.length + validFiles.length;
//       if (totalImages > 10) {
//         toast.error("Maximum 10 images allowed");
//         return;
//       }

//       onImagesChange([...images, ...validFiles]);
//     },
//     [images, existingPreviews.length, onImagesChange]
//   );

//   const removeNewImage = useCallback(
//     (index: number) => {
//       const newImages = images.filter((_, i) => i !== index);
//       onImagesChange(newImages);
//     },
//     [images, onImagesChange]
//   );

//   const removeExistingImage = useCallback(
//     (index: number) => {
//       const newExistingPreviews = existingPreviews.filter(
//         (_, i) => i !== index
//       );
//       setExistingPreviews(newExistingPreviews);
//     },
//     [existingPreviews]
//   );

//   const replaceExistingImage = useCallback(
//     (index: number) => {
//       const input = document.createElement("input");
//       input.type = "file";
//       input.accept = "image/*";
//       input.onchange = (e: Event) => {
//         const target = e.target as HTMLInputElement;
//         const file = target.files?.[0];
//         if (file) {
//           if (!file.type.startsWith("image/")) {
//             toast.error("Please select an image file");
//             return;
//           }
//           if (file.size > 5 * 1024 * 1024) {
//             toast.error("Image size should be less than 5MB");
//             return;
//           }
//           const newExistingPreviews = existingPreviews.filter(
//             (_, i) => i !== index
//           );
//           setExistingPreviews(newExistingPreviews);
//           onImagesChange([...images, file]);
//         }
//       };
//       input.click();
//     },
//     [existingPreviews, images, onImagesChange]
//   );

//   const totalImages = existingPreviews.length + previews.length;

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <ImagePlus className="h-5 w-5" />
//           Product Images
//         </CardTitle>
//         <p className="text-sm text-muted-foreground">
//           Upload up to 10 high-quality images. First image will be the main
//           product image.
//         </p>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {/* Image Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
//           {/* Existing Images from Backend */}
//           {existingPreviews.map((preview, index) => (
//             <div
//               key={`existing-${index}`}
//               className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden group"
//             >
//               <Image
//                 width={300}
//                 height={300}
//                 src={preview}
//                 alt={`Existing product ${index + 1}`}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
//                 <Button
//                   type="button"
//                   size="sm"
//                   variant="secondary"
//                   onClick={() => replaceExistingImage(index)}
//                   className="h-8 px-2"
//                 >
//                   <Upload className="h-4 w-4 mr-1" />
//                   Replace
//                 </Button>
//                 <Button
//                   type="button"
//                   size="sm"
//                   variant="destructive"
//                   onClick={() => removeExistingImage(index)}
//                   className="h-8 w-8 p-0"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//               {index === 0 && (
//                 <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
//                   Main
//                 </div>
//               )}
//             </div>
//           ))}

//           {/* New Uploaded Images */}
//           {previews.map((preview, index) => (
//             <div
//               key={`new-${index}`}
//               className="relative aspect-square rounded-lg border-2 border-dashed border-primary/50 overflow-hidden group"
//             >
//               <Image
//                 width={300}
//                 height={300}
//                 src={preview}
//                 alt={`New upload ${index + 1}`}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                 <Button
//                   type="button"
//                   size="sm"
//                   variant="destructive"
//                   onClick={() => removeNewImage(index)}
//                   className="h-8 w-8 p-0"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//               <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
//                 New
//               </div>
//               {existingPreviews.length === 0 && index === 0 && (
//                 <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
//                   Main
//                 </div>
//               )}
//             </div>
//           ))}

//           {/* Upload Button */}
//           {totalImages < 10 && (
//             <Label
//               htmlFor="image-upload"
//               className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 bg-muted/50 hover:bg-muted"
//             >
//               <ImagePlus className="h-8 w-8 text-muted-foreground" />
//               <span className="text-xs text-muted-foreground text-center px-2">
//                 Add Image
//               </span>
//               <input
//                 id="image-upload"
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//             </Label>
//           )}
//         </div>

//         {/* Image Counter */}
//         <div className="flex items-center justify-between text-sm">
//           <span className="text-muted-foreground">
//             {totalImages} / 10 images
//           </span>
//           {totalImages > 0 && (
//             <span className="text-xs text-muted-foreground">
//               {existingPreviews.length > 0 && (
//                 <span className="text-blue-600">
//                   {existingPreviews.length} existing
//                 </span>
//               )}
//               {existingPreviews.length > 0 && previews.length > 0 && " • "}
//               {previews.length > 0 && (
//                 <span className="text-green-600">{previews.length} new</span>
//               )}
//             </span>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const NewProductPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const { data, isLoading } = useGetSingleProductQuery(id);
//   const singleData = data?.data?.attributes;

//   const categories = useSelector((state: any) => state.common.categories);

//   const router = useRouter();
//   const [images, setImages] = useState<File[]>([]);
//   const [existingImages, setExistingImages] = useState<string[]>([]);
//   const [tags, setTags] = useState<string[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm<ProductFormData>({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       isDraft: true,
//       stockQuantity: 1,
//       shippingCost: 0,
//       acceptOffers: false,
//     },
//   });

//   // Populate form with fetched data
//   useEffect(() => {
//     if (singleData) {
//       reset({
//         productName: singleData.productName || "",
//         description: singleData.description || "",
//         price: Number(singleData.price) || 0,
//         optionalPrice: singleData.optionalPrice
//           ? Number(singleData.optionalPrice)
//           : undefined,
//         category: singleData.category || "",
//         condition: singleData.condition || "",
//         rarity: singleData.rarity || "",
//         brand: singleData.brand || "",
//         stockQuantity: Number(singleData.stockQuantity) || 1,
//         isDraft: Boolean(singleData.isDraft),
//         discountPercentage: singleData.discountPercentage
//           ? Number(singleData.discountPercentage)
//           : undefined,
//         shippingCost: singleData.shipping?.shippingCost
//           ? Number(singleData.shipping.shippingCost)
//           : 0,
//         weight: singleData.shipping?.weight
//           ? Number(singleData.shipping.weight)
//           : undefined,
//         dimensions: singleData.shipping?.dimensions || "",
//         acceptOffers: Boolean(singleData.acceptOffers),
//         minOffer: singleData.minOffer ? Number(singleData.minOffer) : undefined,
//       });

//       // Set tags - filter out empty strings
//       if (singleData.tags && Array.isArray(singleData.tags)) {
//         const filteredTags = singleData.tags.filter(
//           (tag: string) => tag && tag.trim() !== ""
//         );
//         setTags(filteredTags);
//       }

//       // Set existing images
//       if (singleData.images && Array.isArray(singleData.images)) {
//         setExistingImages(singleData.images);
//       }
//     }
//   }, [singleData, reset]);

//   const watchedIsDraft = watch("isDraft");
//   const watchedCategory = watch("category");
//   const watchedCondition = watch("condition");
//   const watchedRarity = watch("rarity");

//   const [UpdateProducts] = useProductUpdateMutation();

//   // Form submission with proper FormData handling
//   const onSubmit = async (data: ProductFormData) => {
//     console.log("Form data:", data);
//     setIsSubmitting(true);

//     const formData = new FormData();

//     try {
//       // Basic product information
//       formData.append("productName", data.productName);
//       formData.append("description", data.description);
//       formData.append("price", data.price.toString());
//       formData.append("category", data.category);
//       formData.append("condition", data.condition);
//       formData.append("rarity", data.rarity);
//       formData.append("stockQuantity", data.stockQuantity.toString());
//       formData.append("isDraft", data.isDraft.toString());
//       formData.append("acceptOffers", data.acceptOffers.toString());

//       // Optional fields - only append if they have values
//       if (data.optionalPrice) {
//         formData.append("optionalPrice", data.optionalPrice.toString());
//       }

//       if (data.brand && data.brand.trim()) {
//         formData.append("brand", data.brand.trim());
//       }

//       if (
//         data.discountPercentage !== undefined &&
//         data.discountPercentage !== null
//       ) {
//         formData.append(
//           "discountPercentage",
//           data.discountPercentage.toString()
//         );
//       }

//       if (data.minOffer && data.acceptOffers) {
//         formData.append("minOffer", data.minOffer.toString());
//       }

//       // Shipping information
//       formData.append("shippingCost", data.shippingCost.toString());

//       if (data.weight) {
//         formData.append("shippingWeight", data.weight.toString());
//       }

//       if (data.dimensions && data.dimensions.trim()) {
//         formData.append("shippingDimensions", data.dimensions.trim());
//       }

//       // Vendor ID
//       if (singleData?.vendor?._id) {
//         formData.append("vendor", singleData.vendor._id);
//       }

//       // Tags - append each tag individually
//       if (tags && tags.length > 0) {
//         tags.forEach((tag) => {
//           if (tag.trim()) {
//             formData.append("tags", tag.trim());
//           }
//         });
//       }

//       // Existing images that weren't removed
//       if (existingImages && existingImages.length > 0) {
//         existingImages.forEach((img) => {
//           formData.append("existingImages", img);
//         });
//       }

//       // New images - only append new images
//       if (images.length > 0) {
//         images.forEach((image) => {
//           formData.append("images", image);
//         });
//       }

//       // Calculate inStock based on stockQuantity
//       formData.append("inStock", (data.stockQuantity > 0).toString());

//       // Debug: Log FormData contents
//       console.log("FormData entries:");
//       for (const [key, value] of formData.entries()) {
//         console.log(key, value);
//       }

//       // Send update request
//       const res = await UpdateProducts({ id, data: formData });
//       console.log("Update response:", res);

//       // Handle response
//       if (res.error) {
//         toast.error("Failed to update product. Please try again.");
//         console.error("Update error:", res.error);
//       } else {
//         toast.success("Product updated successfully!");
//         router.push("/vendor/dashboard");
//       }
//     } catch (error) {
//       toast.error("An error occurred while updating the product.");
//       console.error("Error updating product:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <PageLayout
//         title="Edit Product"
//         description="Loading..."
//         breadcrumbs={[
//           { label: "Dashboard", href: "/vendor/dashboard" },
//           { label: "Products", href: "/vendor/dashboard" },
//           { label: "Edit Product" },
//         ]}
//       >
//         <div className="flex items-center justify-center py-12">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//             <p className="text-muted-foreground">Loading product data...</p>
//           </div>
//         </div>
//       </PageLayout>
//     );
//   }

//   if (!singleData) {
//     return (
//       <PageLayout
//         title="Edit Product"
//         description="Product not found"
//         breadcrumbs={[
//           { label: "Dashboard", href: "/vendor/dashboard" },
//           { label: "Products", href: "/vendor/dashboard" },
//           { label: "Edit Product" },
//         ]}
//       >
//         <div className="flex items-center justify-center py-12">
//           <Alert variant="destructive" className="max-w-md">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>
//               Product not found. It may have been deleted or you don't have
//               permission to edit it.
//             </AlertDescription>
//           </Alert>
//         </div>
//       </PageLayout>
//     );
//   }

//   return (
//     <PageLayout
//       title="Edit Product"
//       description={`Edit "${singleData.productName}"`}
//       breadcrumbs={[
//         { label: "Dashboard", href: "/vendor/dashboard" },
//         { label: "Products", href: "/vendor/dashboard" },
//         { label: "Edit Product" },
//       ]}
//     >
//       {/* Product Status Alert */}
//       {!singleData.isDraft && (
//         <Alert className="mb-6">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>
//             This product is currently live and visible to buyers. Changes will
//             take effect immediately after saving.
//             <Button asChild variant="link" className="p-0 ml-2 h-auto">
//               <a
//                 href={`/product/${singleData._id}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1"
//               >
//                 View live listing <ExternalLink className="h-3 w-3" />
//               </a>
//             </Button>
//           </AlertDescription>
//         </Alert>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//         {/* Images Section */}
//         <ImageUploadSection
//           images={images}
//           onImagesChange={setImages}
//           existingImages={singleData.images}
//           onExistingImagesChange={setExistingImages}
//         />

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
//                 <Label htmlFor="productName">Product Name *</Label>
//                 <Input
//                   id="productName"
//                   {...register("productName")}
//                   placeholder="e.g., Charizard Base Set Holo"
//                   className="mt-1"
//                 />
//                 {errors.productName && (
//                   <p className="text-sm text-destructive mt-1">
//                     {errors.productName.message}
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
//                 <Select
//                   value={watchedCategory || ""}
//                   onValueChange={(value) => setValue("category", value)}
//                 >
//                   <SelectTrigger className="mt-1">
//                     <SelectValue placeholder={singleData?.category} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {categories?.map((category: any) => (
//                       <SelectItem key={category._id} value={category._id}>
//                         {category?.name}
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
//                 <Label htmlFor="rarity">Rarity *</Label>
//                 <Select
//                   value={watchedRarity || ""}
//                   onValueChange={(value) => setValue("rarity", value)}
//                 >
//                   <SelectTrigger className="mt-1">
//                     <SelectValue placeholder={singleData?.rarity} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {rarities.map((rarity) => (
//                       <SelectItem key={rarity} value={rarity}>
//                         {rarity}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {errors.rarity && (
//                   <p className="text-sm text-destructive mt-1">
//                     {errors.rarity.message}
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

//               <div className="md:col-span-2">
//                 <Label htmlFor="condition">Condition *</Label>
//                 <Select
//                   value={watchedCondition || ""}
//                   onValueChange={(value) => setValue("condition", value)}
//                 >
//                   <SelectTrigger className="mt-1">
//                     <SelectValue placeholder={singleData?.condition} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {rawConditions?.map((Condition: any) => (
//                       <SelectItem key={Condition} value={Condition}>
//                         {Condition}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
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
//                 <Label htmlFor="optionalPrice">Original Price (optional)</Label>
//                 <Input
//                   id="optionalPrice"
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   {...register("optionalPrice", { valueAsNumber: true })}
//                   placeholder="0.00"
//                   className="mt-1"
//                 />
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Show as crossed out for sale pricing
//                 </p>
//               </div>

//               <div>
//                 <Label htmlFor="stockQuantity">Stock Quantity *</Label>
//                 <Input
//                   id="stockQuantity"
//                   type="number"
//                   min="1"
//                   {...register("stockQuantity", { valueAsNumber: true })}
//                   placeholder="1"
//                   className="mt-1"
//                 />
//                 {errors.stockQuantity && (
//                   <p className="text-sm text-destructive mt-1">
//                     {errors.stockQuantity.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <Label htmlFor="discountPercentage">Discount Percentage</Label>
//                 <Input
//                   id="discountPercentage"
//                   type="number"
//                   min="0"
//                   max="100"
//                   {...register("discountPercentage", { valueAsNumber: true })}
//                   placeholder="0"
//                   className="mt-1"
//                 />
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Percentage discount (0-100)
//                 </p>
//               </div>
//             </div>

//             <Separator />
//           </CardContent>
//         </Card>

//         {/* Shipping */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Shipping Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid md:grid-cols-3 gap-4">
//               <div className="hidden">
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
//               value={watchedIsDraft ? "draft" : "active"}
//               onValueChange={(value) => setValue("isDraft", value === "draft")}
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
//             disabled={isSubmitting}
//           >
//             Cancel
//           </Button>

//           <div className="flex gap-3">
//             <Button type="submit" disabled={isSubmitting}>
//               <Save className="mr-2 h-4 w-4" />
//               {isSubmitting ? "Updating..." : "Update Product"}
//             </Button>
//           </div>
//         </div>
//       </form>
//     </PageLayout>
//   );
// };

// export default NewProductPage;
