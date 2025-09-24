"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import type { Category, Product } from "@/lib/types";
import type { SortOption, ViewMode } from "@/lib/browse-utils";
import { VendorStyleFilterBar } from "@/components/Browse/VendorStyleFilterBar";
import { ProductGrid } from "@/components/Browse/ProductGrid";

export default function CategoryPage() {
  const params: Record<string, string | string[]> | null = useParams();
  const categorySlug = params ? (params.slug as string | null) : null;
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const categoryAPI = getCategoryAPI();
  //       const productAPI = getProductAPI();

  //       const [categoryResponse, productsResponse] = await Promise.all([
  //         categoryAPI.getCategoryBySlug(categorySlug),
  //         productAPI.getProductsByCategory(categorySlug),
  //       ]);

  //       if (categoryResponse.success) {
  //         setCategory(categoryResponse.data);
  //       }

  //       if (productsResponse.success) {
  //         setProducts(productsResponse.data.data);
  //       }
  //     } catch (error) {
  //       if (process.env.NODE_ENV !== "production")
  //         console.error("Failed to fetch category data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchData();
  // }, [categorySlug]);

  // Get products for this category
  const categoryProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Default sorting
        break;
    }

    return filtered;
  }, [products, sortBy, searchQuery]);

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

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading category...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!category) {
    return (
      <PageLayout>
        <EmptyStates.Error
          onRetry={() => window.location.reload()}
          title="Category Not Found"
          description="The category you're looking for doesn't exist or has been removed."
          actionLabel="Browse All Products"
          actionHref="/browse"
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={category.name}
      description={`${categoryProducts.length} ${
        categoryProducts.length === 1 ? "product" : "products"
      } found`}
      breadcrumbs={[
        { label: "Browse", href: "/browse" },
        { label: category.name },
      ]}
    >
      <div className="space-y-6">
        {/* Controls */}
        <VendorStyleFilterBar
          search={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          activeFilterCount={searchQuery ? 1 : 0}
          activeFilters={
            searchQuery
              ? [
                  {
                    type: "search",
                    value: searchQuery,
                    label: `Search: ${searchQuery}`,
                  },
                ]
              : []
          }
          onRemoveFilter={(type) => {
            if (type === "search") setSearchQuery("");
          }}
          onClearAllFilters={() => setSearchQuery("")}
          className="mb-6"
        />

        {/* Products Grid/List */}
        <ProductGrid
          products={categoryProducts}
          viewMode={viewMode}
          isLoading={loading}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onBuyNow={handleBuyNow}
          onShare={handleShare}
        />
      </div>
    </PageLayout>
  );
}
