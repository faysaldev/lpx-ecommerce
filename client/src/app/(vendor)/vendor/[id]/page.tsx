/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ArrowUpDown,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Facebook,
  Globe,
  Grid3x3,
  Instagram,
  LayoutList,
  Linkedin,
  Package,
  Search,
  Shield,
  SlidersHorizontal,
  Star,
  Store,
  Twitter,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import ProductCard from "@/components/shared/ProductCard";
import { Badge } from "@/components/UI/badge";
import { Card, CardContent } from "@/components/UI/card";
import { productStyles } from "@/components/UI/product.variants";
import { Skeleton } from "@/components/UI/skeleton";
import type { Category, Product, Vendor } from "@/lib/types";
import { cn } from "@/lib/utils";
import { QuickView } from "@/components/Browse/QuickView";
import {
  useSearchSingleVendorProductsQuery,
  useVendorSingleDetailsGetsQuery,
} from "@/redux/features/vendors/vendor";
import VendorPageSkeleton from "@/components/Vendors/SingleVendorView/VendorPageSkeleton";
import ReviewAndRatingsProduct from "@/components/ReviewAndRatingsProduct/ReviewAndRatingsProduct";
import VendorTruncateDetails from "@/components/Vendors/SingleVendorView/VendorTruncateDetails";
import { useAppSelector } from "@/redux/hooks";
import { selectCategories } from "@/redux/features/Common/CommonSlice";

type ViewMode = "grid" | "list";

export default function VendorStorefrontPage() {
  const params = useParams();
  const vendorId = params?.id as string;
  const type = "vendor";
  const id = vendorId;
  const idtype = { id, type };

  // State for UI controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const categories = useAppSelector(selectCategories);

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "highToLow", label: "Price: High to Low" },
    { value: "lowToHigh", label: "Price: Low to High" },
    { value: "mostPopular", label: "Most Popular" },
  ];

  // Fetch vendor details
  const {
    data: vendorSingleDetails,
    isLoading: isVendorLoading,
    isError: isVendorError,
  } = useVendorSingleDetailsGetsQuery(vendorId!, {
    skip: !vendorId,
  });

 console.log('vendor data show this section page ', vendorSingleDetails);

  // Fetch vendor products with filters
  const { data: vendorProductsData, isLoading: isProductsLoading } =
    useSearchSingleVendorProductsQuery(
      {
        vendorId: vendorId!,
        query: searchQuery || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        sortBy: sortBy as "mostPopular" | "highToLow" | "lowToHigh" | "newest",
      },
      {
        skip: !vendorId,
      }
    );

  // Transform vendor data
  const vendor = useMemo(() => {
    if (!vendorSingleDetails?.data?.attributes) return null;

    const vendorData = vendorSingleDetails.data.attributes;
    
    return {
      id: vendorData._id,
      slug:
        vendorData.slug ||
        vendorData.storeName.replace(/\s+/g, "-").toLowerCase(), // Adding slug
      name: vendorData.storeName,
      description: vendorData.description || "No description available",
      location: vendorData.location,
      rating: vendorData.averageRating || 0,
      verified: vendorData.verified || false,
      totalProducts: vendorData.productsCount || 0,
      specialties: vendorData.category ? [vendorData.category] : [],
      joinedDate: vendorData.createdAt,
      logo: vendorData.storePhoto,
      ownerName: vendorData.ownerName,
      email: vendorData.email,
      website: vendorData.website,
      socialMedia: vendorData.socialLinks?.reduce((acc: any, link: any) => {
        acc[link.type] = `https://${link.type}.com/${link.username}`;
        return acc;
      }, {}),
      contact: {
        website: vendorData.website,
        email: vendorData.contactEmail,
        phone: vendorData.phoneNumber,
      },
      policies: vendorData.storePolicies
        ? {
            shipping: vendorData.storePolicies.shippingPolicy,
            returns: vendorData.storePolicies.returnPolicy,
            authenticity: vendorData.storePolicies.authenticityPolicy, // Assuming this policy exists
          }
        : undefined,
      responseTime: "within hours",
      totalSales: 0, // You might want to calculate this from orders
    } as Vendor;
  }, [vendorSingleDetails]);

  // Transform products data
  const products = useMemo(() => {
    if (!vendorProductsData?.data?.attributes?.products) return [];

    return vendorProductsData.data.attributes.products.map(
      (product: any) =>
        ({
          id: product._id,
          slug: product.slug || product.productName.toLowerCase().replace(/\s+/g, "-"),
          name: product.productName,
          description: product.description || "",
          discountPercentage: product.discountPercentage,
          price: product.price,
          optionalPrice: product.optionalPrice || product.price,
          stock: product.stockQuantity || 0,
          image: product.images?.[0] || "",
          images: product.images || [],
          category: product.category,
          categorySlug:
            product.category?.toLowerCase().replace(/\s+/g, "-") ||
            "uncategorized",
          vendor: product.vendor?.storeName || vendor?.name || "Unknown Vendor",
          vendorId: product.vendor?._id || vendorId,
          condition: product.condition || "new",
          rating: product.rating || 0,
          reviewCount: product.reviewCount || 0,
          // Add any other missing properties with default values as needed
        } as Product)
    );
  }, [vendorProductsData, vendor, vendorId]);

  // Get unique categories from products
  const vendorCategories = useMemo(() => {
    const categoryMap = new Map();

    products.forEach((p: any) => {
      if (p.category && !categoryMap.has(p.categorySlug)) {
        categoryMap.set(p.categorySlug, {
          id: p.categorySlug,
          name: p.category,
          slug: p.categorySlug,
        });
      }
    });

    return Array.from(categoryMap.values()) as Category[];
  }, [products]);

  // Calculate active filter count
  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) + (searchQuery ? 1 : 0);

  // Handle product actions
  const handleAddToCart = (product: Product) => {
    toast.success(`${product.name} added to cart`);
  };

  const handleAddToWishlist = (product: Product) => {
    toast.success(`${product.name} added to wishlist`);
  };

  const handleBuyNow = (product: Product) => {
    toast.info("Buy now functionality coming soon!");
    console.log(product);
  };

  const handleShare = (product: Product) => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Check out ${product.name} on LPX Collect`,
          url: `${window.location.origin}/product/${product.id}`,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/product/${product.id}`
      );
      toast.success("Product link copied to clipboard!");
    }
  };

  // Loading state
  if (isVendorLoading) {
    return (
      <PageLayout
        title="Loading..."
        breadcrumbs={[
          { label: "Vendors", href: "/vendors" },
          { label: "Loading..." },
        ]}
      >
        <VendorPageSkeleton />
      </PageLayout>
    );
  }

  // Error state
  if (isVendorError || !vendor) {
    return (
      <PageLayout
        title="Vendor Not Found"
        breadcrumbs={[
          { label: "Vendors", href: "/vendors" },
          { label: "Not Found" },
        ]}
      >
        <EmptyStates.NoVendorInfo />
      </PageLayout>
    );
  }

  const breadcrumbs = [
    { label: "Vendors", href: "/vendors" },
    { label: vendor.name },
  ];

  return (
    <PageLayout title={vendor.name} breadcrumbs={breadcrumbs}>
      {/* Vendor Header Card */}
      <Card className="mb-8 border-0 shadow-none">
        <CardContent className="p-0 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar Info */}
            <div className="lg:w-80 w-full space-y-4 lg:sticky lg:top-4 lg:self-start">
              {/* Vendor Card */}
              <div className="text-center bg-card rounded-lg p-6 border">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  {vendor.logo ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/${vendor.logo}`}
                      alt={vendor.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <Store className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <h1 className="text-2xl font-bold">{vendor.name}</h1>
                {vendor.verified && (
                  <div className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Verified Seller</span>
                  </div>
                )}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{vendor.rating}</span>
                    <span className="text-muted-foreground">(0 reviews)</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {vendor.totalSales?.toLocaleString() || 0} sales •{" "}
                    {vendor.totalProducts || 0} items
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Member since{" "}
                    {new Date(vendor.joinedDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* Specialties */}
              {vendor.specialties && vendor.specialties.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Specializes in
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {vendor.specialties.map((specialty) => (
                      <Badge
                        key={`spec-${specialty}`}
                        variant="secondary"
                        className="text-xs"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact & Social */}
              {(vendor.contact || vendor.socialMedia) && (
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-medium text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Connect
                  </h3>

                  {vendor.contact?.website && (
                    <a
                      href={vendor.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Globe className="h-4 w-4" />
                      Visit Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  <div className="flex gap-2">
                    {vendor.socialMedia?.facebook && (
                      <a
                        href={vendor.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border rounded-md hover:bg-accent"
                      >
                        <Facebook className="h-4 w-4" />
                      </a>
                    )}
                    {vendor.socialMedia?.instagram && (
                      <a
                        href={vendor.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border rounded-md hover:bg-accent"
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                    )}
                    {vendor.socialMedia?.twitter && (
                      <a
                        href={vendor.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border rounded-md hover:bg-accent"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}

                    {vendor.socialMedia?.twitter && (
                      <a
                        href={vendor.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border rounded-md hover:bg-accent"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
            </div>

            {/* Main Content Area - Products */}
            <div className="flex-1">
              <div id="products" className="space-y-6">
                <h2 className="text-xl font-semibold">Products</h2>

                {/* Filter Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                        className={cn(
                          productStyles.forms.button.md,
                          "flex items-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                        )}
                      >
                        <SlidersHorizontal
                          className={productStyles.forms.icon.md}
                        />
                        <span>Filters</span>
                        {activeFilterCount > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {activeFilterCount}
                          </Badge>
                        )}
                        {isFilterExpanded ? (
                          <ChevronUp className={productStyles.forms.icon.md} />
                        ) : (
                          <ChevronDown
                            className={productStyles.forms.icon.md}
                          />
                        )}
                      </button>

                      {/* Quick Search */}
                      <div className="relative hidden sm:block">
                        <Search
                          className={cn(
                            productStyles.forms.icon.md,
                            "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          )}
                        />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Quick search..."
                          className={cn(
                            productStyles.forms.input.md,
                            "pl-10 w-64 border border-input bg-background",
                            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          )}
                        />
                      </div>

                      {/* Active Filter Pills */}
                      {!isFilterExpanded && activeFilterCount > 0 && (
                        <div className="flex items-center gap-2">
                          {selectedCategory !== "all" && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                              {
                                vendorCategories.find(
                                  (c) => c.slug === selectedCategory
                                )?.name
                              }
                              <button
                                type="button"
                                onClick={() => setSelectedCategory("all")}
                                className="ml-1 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          )}
                          {searchQuery && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                              Search: {searchQuery}
                              <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="ml-1 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Sort */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsSortOpen(!isSortOpen)}
                          onBlur={() =>
                            setTimeout(() => setIsSortOpen(false), 200)
                          }
                          className={cn(
                            productStyles.forms.select.md,
                            "flex items-center justify-between gap-2 w-48 border border-input bg-background hover:bg-accent transition-colors"
                          )}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <ArrowUpDown
                              className={cn(
                                productStyles.forms.icon.md,
                                "text-muted-foreground flex-shrink-0"
                              )}
                            />
                            <span className="truncate">
                              {
                                sortOptions.find((o) => o.value === sortBy)
                                  ?.label
                              }
                            </span>
                          </span>
                        </button>
                        {isSortOpen && (
                          <div className="absolute right-0 mt-1 w-48 bg-popover border border-input rounded-md shadow-lg z-10">
                            {sortOptions.map((option) => (
                              <button
                                type="button"
                                key={`sort-${option.value}`}
                                onClick={() => {
                                  setSortBy(option.value);
                                  setIsSortOpen(false);
                                }}
                                className={cn(
                                  "w-full text-left px-3 py-2 text-sm hover:bg-accent",
                                  sortBy === option.value && "bg-accent"
                                )}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* View Mode */}
                      <div className="flex items-center border border-input rounded-md overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setViewMode("grid")}
                          className={cn(
                            "h-9 px-3 flex items-center justify-center",
                            "rounded-none border-0 transition-colors",
                            viewMode === "grid"
                              ? "bg-primary text-primary-foreground"
                              : "bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                          aria-label="Grid view"
                        >
                          <Grid3x3 className={productStyles.forms.icon.md} />
                        </button>
                        <div className="w-px h-6 bg-input" />
                        <button
                          type="button"
                          onClick={() => setViewMode("list")}
                          className={cn(
                            "h-9 px-3 flex items-center justify-center",
                            "rounded-none border-0 transition-colors",
                            viewMode === "list"
                              ? "bg-primary text-primary-foreground"
                              : "bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                          aria-label="List view"
                        >
                          <LayoutList className={productStyles.forms.icon.md} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Filter Content */}
                  {isFilterExpanded && (
                    <div className="border-t border-border py-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Category Filter */}
                        <div>
                          <label
                            htmlFor="category-select"
                            className="text-sm font-medium text-muted-foreground mb-2 block"
                          >
                            Category
                          </label>
                          <select
                            id="category-select"
                            value={selectedCategory}
                            onChange={(e) =>
                              setSelectedCategory(e.target.value)
                            }
                            className={cn(
                              productStyles.forms.select.md,
                              "w-full border border-input bg-background"
                            )}
                          >
                            <option value="all">All Categories</option>
                            {categories?.map((cat) => (
                              <option key={cat._id} value={cat.name}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Search on Mobile */}
                        <div className="sm:hidden">
                          <label
                            htmlFor="mobile-search"
                            className="text-sm font-medium text-muted-foreground mb-2 block"
                          >
                            Search
                          </label>
                          <div className="relative">
                            <Search
                              className={cn(
                                productStyles.forms.icon.md,
                                "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                              )}
                            />
                            <input
                              id="mobile-search"
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search products..."
                              className={cn(
                                productStyles.forms.input.md,
                                "pl-10 w-full border border-input bg-background",
                                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Clear Filters */}
                      {activeFilterCount > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery("");
                              setSelectedCategory("all");
                            }}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Clear all filters
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Products Grid/List */}
                {isProductsLoading ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-2 lg:grid-cols-3 gap-4"
                        : "space-y-4"
                    }
                  >
                    {Array.from({ length: 6 }, (_, index) => (
                      <Skeleton
                        key={index}
                        className={
                          viewMode === "grid"
                            ? "h-64 rounded-lg"
                            : "h-48 rounded-lg"
                        }
                      />
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <EmptyStates.NoProducts />
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-2 lg:grid-cols-3 gap-4"
                        : "space-y-4"
                    }
                  >
                    {products.map((product: any) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        viewMode={viewMode}
                        showQuickView={true}
                        onQuickView={setQuickViewProduct}
                        onAddToCart={handleAddToCart}
                        onAddToWishlist={handleAddToWishlist}
                        onBuyNow={handleBuyNow}
                        onShare={handleShare}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <div className="flex flex-col lg:flex-row gap-6 mt-8">
        <div className="lg:w-80 w-full" />
        <div className="flex-1 space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">About {vendor.name}</h2>
            <VendorTruncateDetails
              description={vendor.description}
              truncateLength={200}
            />
          </div>

          {/* Policies Section */}
          {vendor.policies && (
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Policies</h2>
              <div className="space-y-4">
                {vendor.policies.shipping && (
                  <div>
                    <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Shipping Policy
                    </h3>

                    <VendorTruncateDetails
                      description={vendor.policies.shipping}
                      truncateLength={220}
                    />
                  </div>
                )}
                {vendor.policies.returns && (
                  <div>
                    <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Return Policy
                    </h3>
                    <VendorTruncateDetails
                      description={vendor.policies.returns}
                      truncateLength={220}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
      />

      <ReviewAndRatingsProduct idtype={idtype} />
    </PageLayout>
  );
}
