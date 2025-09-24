"use client";

import {
  ArrowUpDown,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Facebook,
  Globe,
  Grid3x3,
  Heart,
  Instagram,
  LayoutList,
  MapPin,
  MessageCircle,
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
// import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import { ProductCard } from "@/components/shared/ProductCard";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/UI/card";
// import { CategoryBadge } from "@/components/ui/badge.variants";
import { productStyles } from "@/components/UI/product.variants";
// import { Progress } from "@/components/ui/progress";
// import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
// import { useCart } from "@/context/CartContext";
// import { useWishlist } from "@/context/WishlistContext";
// import { QuickView } from "@/features/browse/components/QuickView";
// import { MockProductAPI, MockVendorAPI } from "@/lib/api/mock";
// import { toDomainProduct } from "@/lib/api/product-adapters";
import type { Category, Product, Vendor } from "@/lib/types";
// import { designTokens } from "@/design-system/compat";
import { cn } from "@/lib/utils";
import { QuickView } from "@/components/Browse/QuickView";

type ViewMode = "grid" | "list";

// Initialize API instances
// const vendorAPI = new MockVendorAPI();
// const _productAPI = new MockProductAPI();

export default function VendorStorefrontPage() {
  const params: Record<string, string | string[]> | null = useParams();
  const vendorId = params ? (params.id as string | null) : null;
  // const { addToCart } = useCart();
  // const { addToWishlist } = useWishlist();

  // State for data
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productsLoading, setProductsLoading] = useState(false);

  // UI state
  const [isFollowing, setIsFollowing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "popular", label: "Most Popular" },
  ];

  // Fetch vendor data
  useEffect(() => {
    async function fetchVendor() {
      try {
        // setLoading(true);
        // setError(null);
        // const response = await vendorAPI.getVendorById(vendorId);
        // if (response.success) {
        //   setVendor(response.data);
        // } else {
        //   setError(response.error.message);
        // }
      } catch (_err) {
        setError("Failed to load vendor information");
      } finally {
        setLoading(false);
      }
    }

    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId]);

  // Fetch vendor products
  useEffect(() => {
    async function fetchProducts() {
      if (!vendor) return;

      try {
        setProductsLoading(true);

        // const response = await vendorAPI.getVendorProducts(vendor.id, {
        //   search: searchQuery || undefined,
        //   sortBy: sortBy as
        //     | "featured"
        //     | "newest"
        //     | "price-asc"
        //     | "price-desc"
        //     | "rating"
        //     | "popular"
        //     | "name",
        // });

        // if (response.success) {
        //   setProducts(response.data.data);
        // }
      } catch (err) {
        if (process.env.NODE_ENV !== "production")
          console.error("Failed to fetch products:", err);
      } finally {
        setProductsLoading(false);
      }
    }

    fetchProducts();
  }, [vendor, searchQuery, sortBy]);

  // Filter and sort products
  const vendorProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.categorySlug === selectedCategory);
    }

    return filtered;
  }, [products, selectedCategory]);

  // Get unique categories from vendor products
  const vendorCategories = useMemo(() => {
    const categoryMap = new Map();

    products.forEach((p) => {
      const category =
        typeof p.category === "string"
          ? {
              id: p.categorySlug || p.category,
              name: p.category,
              slug: p.categorySlug || p.category,
            }
          : p.category;

      if (category && !categoryMap.has(category.slug)) {
        categoryMap.set(category.slug, category);
      }
    });

    return Array.from(categoryMap.values()) as Category[];
  }, [products]);

  // Calculate active filter count
  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) + (searchQuery ? 1 : 0);

  // Handle product actions
  const handleAddToCart = (product: Product) => {
    // const domainProduct = toDomainProduct(product);
    // addToCart(domainProduct, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleAddToWishlist = (product: Product) => {
    // const domainProduct = toDomainProduct(product);
    // addToWishlist(domainProduct);
    toast.success(`${product.name} added to wishlist`);
  };

  const handleBuyNow = (product: Product) => {
    // TODO: Implement buy now functionality
    if (process.env.NODE_ENV !== "production")
      console.log("Buy now clicked for:", product.id);
    toast.info("Buy now functionality coming soon!");
  };

  const handleShare = (product: Product) => {
    // TODO: Implement share functionality
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
  if (loading) {
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
  if (error || !vendor) {
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
    <PageLayout
      title={vendor.name}
      description={vendor.description}
      breadcrumbs={breadcrumbs}
    >
      {/* Vendor Header Card - Enhanced with Real Data */}
      <Card className="mb-8 border-0 shadow-none">
        <CardContent className="p-0 space-y-6">
          {/* Sidebar-Style Layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar Info */}
            <div className="lg:w-80 w-full space-y-4 lg:sticky lg:top-4 lg:self-start">
              {/* Vendor Card */}
              <div className="text-center bg-card rounded-lg p-6 border">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  {vendor.logo ? (
                    <Image
                      src={vendor.logo}
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
                    <span className="text-muted-foreground">
                      ({vendor.reviewCount || 0} reviews)
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {vendor.totalSales?.toLocaleString() || 0} sales •{" "}
                    {vendor.totalProducts || vendor.productCount || 0} items
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3" />
                    Responds {vendor.responseTime || "quickly"}
                  </div>
                  {vendor.location && (
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {typeof vendor.location === "string"
                        ? vendor.location
                        : `${vendor.location.city}, ${vendor.location.country}`}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Member since{" "}
                    {new Date(vendor.joinedDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* Quick Stats - Enhanced */}
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
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <Button className="w-full" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Seller
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsFollowing(!isFollowing)}
                  className="w-full"
                  size="sm"
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 mr-2",
                      isFollowing ? "fill-current text-red-500" : ""
                    )}
                  />
                  {isFollowing ? "Following" : "Follow Shop"}
                </Button>
              </div>
            </div>

            {/* Main Content Area - Products */}
            <div className="flex-1">
              <div id="products" className="space-y-6">
                <h2 className="text-xl font-semibold">Products</h2>

                {/* Compact Filter Bar - Matching Browse Page */}
                <div className="mb-6">
                  {/* Filter Toggle & Quick Actions */}
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
                          <span className="badge badge-primary">
                            {activeFilterCount}
                          </span>
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
                            <span className="badge badge-secondary">
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
                            </span>
                          )}
                          {searchQuery && (
                            <span className="badge badge-secondary">
                              Search: {searchQuery}
                              <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="ml-1 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
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
                          <div className="dropdown-menu right-0">
                            {sortOptions.map((option) => (
                              <button
                                type="button"
                                key={`sort-${option.value}`}
                                onClick={() => {
                                  setSortBy(option.value);
                                  setIsSortOpen(false);
                                }}
                                className={`dropdown-item ${
                                  sortBy === option.value
                                    ? "dropdown-item-active"
                                    : ""
                                }`}
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
                    <div className="border-t border-border animate-slide-up py-4">
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
                            {vendorCategories.map((cat) => (
                              <option key={cat.id} value={cat.slug}>
                                {cat.name} (
                                {
                                  products.filter(
                                    (p) =>
                                      p.vendorId === vendorId &&
                                      p.categorySlug === cat.slug
                                  ).length
                                }
                                )
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
                {productsLoading ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? `grid grid-cols-2 lg:grid-cols-3 gap-4`
                        : "space-y-4"
                    }
                  >
                    {Array.from({ length: 6 }, (_, index) => ({
                      id: `vendor-${vendorId}-product-skeleton-${index}-${Math.random()
                        .toString(36)
                        .substr(2, 9)}`,
                      index,
                    })).map((item) => (
                      <div
                        key={item.id}
                        className={viewMode === "grid" ? "" : "h-48"}
                      >
                        <Skeleton
                          className={
                            viewMode === "grid"
                              ? "h-64 rounded-lg"
                              : "h-48 rounded-lg"
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : vendorProducts.length === 0 ? (
                  <EmptyStates.NoProducts />
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? `grid grid-cols-2 lg:grid-cols-3 gap-4`
                        : "space-y-4"
                    }
                  >
                    {vendorProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={{
                          ...product,
                          name: product.name,
                          image: product.image || product.images?.[0] || "",
                          category: product.category,
                          categorySlug:
                            product.categorySlug ||
                            product.category.toLowerCase().replace(/\s+/g, "-"),
                          vendor: vendor.name,
                          stock: product.stock || 0,
                          condition: product.condition || "new",
                        }}
                        viewMode={viewMode}
                        showQuickView={true}
                        onQuickView={(p) => setQuickViewProduct(p)}
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

      {/* Enhanced About Section */}
      <div className="flex flex-col lg:flex-row gap-6 mt-8">
        {/* Keep sidebar space */}
        <div className="lg:w-80 w-full" />

        {/* Main content area */}
        <div className="flex-1 space-y-6">
          {/* About Section */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">About {vendor.name}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {vendor.description}
            </p>
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
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {vendor.policies.shipping}
                    </p>
                  </div>
                )}
                {vendor.policies.returns && (
                  <div>
                    <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Return Policy
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {vendor.policies.returns}
                    </p>
                  </div>
                )}
                {vendor.policies.authenticity && (
                  <div>
                    <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Authenticity Guarantee
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {vendor.policies.authenticity}
                    </p>
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
    </PageLayout>
  );
}

// Loading skeleton component
function VendorPageSkeleton() {
  return (
    <Card className="mb-8 border-0 shadow-none">
      <CardContent className="p-0 space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Skeleton */}
          <div className="lg:w-80 w-full space-y-4">
            <div className="text-center bg-card rounded-lg p-6 border">
              <Skeleton className="w-20 h-20 rounded-full mx-auto mb-3" />
              <Skeleton className="h-6 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 mx-auto" />
                <Skeleton className="h-4 w-36 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
                <Skeleton className="h-4 w-40 mx-auto" />
              </div>
            </div>
            <div className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="flex flex-wrap gap-1">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1">
            <div className="space-y-6">
              <Skeleton className="h-8 w-32" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-10 w-32" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }, (_, index) => ({
                    id: `vendor-gallery-skeleton-${index}-${Math.random()
                      .toString(36)
                      .substr(2, 9)}`,
                    index,
                  })).map((item) => (
                    <Skeleton key={item.id} className="h-64 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
