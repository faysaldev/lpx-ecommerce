/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// import { designTokens } from "@/design-system/compat";
import { cn } from "@/lib/utils";
import { Category, Product } from "@/lib/types";
import { useBrowseFilters } from "@/hooks/useBrowseFilters";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/UI/button";
import { Label } from "@/components/UI/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { Input } from "@/components/UI/input";
import { CONDITIONS } from "@/lib/browse-utils";
import { MobileFilterSheet } from "@/components/Browse/FilterSidebar";
import { VendorStyleFilterBar } from "@/components/Browse/VendorStyleFilterBar";
import { ProductGrid } from "@/components/Browse/ProductGrid";
import { QuickView } from "@/components/Browse/QuickView";
import { productStyles } from "@/components/UI/product.variants";
import { Pagination } from "@/components/Browse/Pagination";

function BrowsePageContent() {
  const _searchParams = useSearchParams();
  // const { addToCart } = useCart();
  // const { addToWishlist } = useWishlist();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [_loading, setLoading] = useState(true);

  // Get unique vendors for filtering
  // const _vendors = getUniqueVendors(products);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const productAPI = getProductAPI();
  //       const categoryAPI = getCategoryAPI();

  //       const [productsResponse, categoriesResponse] = await Promise.all([
  //         productAPI.getProducts({ limit: 100 }),
  //         categoryAPI.getCategories(),
  //       ]);

  //       if (productsResponse.success) {
  //         setProducts(productsResponse.data.data);
  //       }

  //       if (categoriesResponse.success) {
  //         setCategories(categoriesResponse.data);
  //       }
  //     } catch (error) {
  //       if (process.env.NODE_ENV !== "production")
  //         console.error("Failed to fetch data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchData();
  // }, []);

  // Use the custom hook for filters
  const {
    filters,
    sortOption,
    viewMode,
    filteredProducts,
    activeFilterCount,
    isFiltering,
    updateFilter,
    clearFilters,
    setSortOption,
    setViewMode,
    // saveFilterPreset,
    // loadFilterPreset,
    // getFilterPresets,
  } = useBrowseFilters(products);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of product grid
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  // Generate active filter pills for VendorStyleFilterBar
  const getActiveFilterPills = () => {
    const pills = [];

    // Categories
    filters.categories.forEach((categorySlug) => {
      const category = categories.find((c) => c.slug === categorySlug);
      if (category) {
        pills.push({
          type: "category",
          value: categorySlug,
          label: category.name,
        });
      }
    });

    // Conditions
    filters.conditions.forEach((condition) => {
      pills.push({
        type: "condition",
        value: condition,
        label: `Condition: ${condition}`,
      });
    });

    // Price range
    if (filters.priceRange.min > 0 || filters.priceRange.max < 10000) {
      pills.push({
        type: "price",
        value: "price",
        label: `$${filters.priceRange.min}-$${filters.priceRange.max}`,
      });
    }

    // In stock
    if (filters.inStock) {
      pills.push({
        type: "inStock",
        value: "true",
        label: "In Stock Only",
      });
    }

    // Tags
    filters.tags.forEach((tag: any) => {
      pills.push({
        type: "tag",
        value: tag,
        label: `Tag: ${tag}`,
      });
    });

    return pills;
  };

  // Handle filter removal from badges
  const handleRemoveFilter = (type: string, value: string) => {
    switch (type) {
      case "search":
        updateFilter("search", "");
        break;
      case "category":
        updateFilter(
          "categories",
          filters.categories.filter((c: any) => c !== value)
        );
        break;
      case "condition":
        updateFilter(
          "conditions",
          filters.conditions.filter((c: any) => c !== value)
        );
        break;
      case "price":
        updateFilter("priceRange", { min: 0, max: 10000 });
        break;
      case "inStock":
        updateFilter("inStock", false);
        break;
      case "tag":
        updateFilter(
          "tags",
          filters.tags.filter((t: any) => t !== value)
        );
        break;
    }
  };

  // Handle product actions
  // const handleAddToCart = (product: Product) => {
  //   const domainProduct = toDomainProduct(product);
  //   addToCart(domainProduct, 1);
  //   toast.success(`${product.name} added to cart`);
  // };

  // const handleAddToWishlist = (product: Product) => {
  //   const domainProduct = toDomainProduct(product);
  //   addToWishlist(domainProduct);
  //   toast.success(`${product.name} added to wishlist`);
  // };

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Clear filters with Escape
      if (e.key === "Escape" && activeFilterCount > 0) {
        e.preventDefault();
        clearFilters();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeFilterCount, clearFilters]);

  return (
    <PageLayout
      title="Browse Collectibles"
      description={
        isFiltering
          ? "Filtering..."
          : `${filteredProducts.length} items found${
              filteredProducts.length > itemsPerPage
                ? ` • Page ${currentPage} of ${totalPages}`
                : ""
            }`
      }
      breadcrumbs={[{ label: "Browse Collectibles" }]}
    >
      {/* Mobile Filter Button */}
      <div className="flex justify-end mb-8 lg:hidden">
        <MobileFilterSheet
          filters={filters}
          onUpdateFilter={updateFilter}
          onClearFilters={clearFilters}
          categories={categories}
          products={products}
        >
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </MobileFilterSheet>
      </div>

      {/* Search and Controls */}
      <div className="mb-6">
        <VendorStyleFilterBar
          search={filters.search}
          onSearchChange={(value: any) => updateFilter("search", value)}
          sortOption={sortOption}
          onSortChange={setSortOption}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          activeFilterCount={activeFilterCount}
          activeFilters={getActiveFilterPills()}
          onRemoveFilter={handleRemoveFilter}
          onClearAllFilters={clearFilters}
          advancedFilterContent={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Categories Filter */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Categories
                </Label>
                <Select
                  value={
                    filters.categories.length > 0
                      ? filters.categories[0]
                      : "all"
                  }
                  onValueChange={(value) => {
                    if (value && value !== "all") {
                      updateFilter("categories", [value]);
                    } else {
                      updateFilter("categories", []);
                    }
                  }}
                >
                  <SelectTrigger className={cn(productStyles.forms.select.md)}>
                    <SelectValue placeholder="Select categories..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Price Range
                </Label>
                <div className="h-9 flex items-center gap-2">
                  <Input
                    type="number"
                    value={filters.priceRange.min}
                    onChange={(e) => {
                      const min = Number(e.target.value) || 0;
                      updateFilter("priceRange", {
                        ...filters.priceRange,
                        min,
                      });
                    }}
                    className="h-9 flex-1"
                    placeholder="Min"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    value={filters.priceRange.max}
                    onChange={(e) => {
                      const max = Number(e.target.value) || 10000;
                      updateFilter("priceRange", {
                        ...filters.priceRange,
                        max,
                      });
                    }}
                    className="h-9 flex-1"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Condition Filter */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Condition
                </Label>
                <Select
                  value={
                    filters.conditions.length > 0
                      ? filters.conditions[0]
                      : "all"
                  }
                  onValueChange={(value) => {
                    if (value && value !== "all") {
                      updateFilter("conditions", [value]);
                    } else {
                      updateFilter("conditions", []);
                    }
                  }}
                >
                  <SelectTrigger className={cn(productStyles.forms.select.md)}>
                    <SelectValue placeholder="Select condition..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conditions</SelectItem>
                    {CONDITIONS.map((condition: any) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              condition.color
                            )}
                          />
                          {condition.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          }
        />
      </div>

      {/* Product Grid */}
      <div className="mb-8">
        <ProductGrid
          products={paginatedProducts}
          viewMode={viewMode}
          isLoading={isFiltering}
          onQuickView={(product: Product) => setQuickViewProduct(product)}
          // onAddToCart={handleAddToCart}
          // onAddToWishlist={handleAddToWishlist}
          onBuyNow={handleBuyNow}
          onShare={handleShare}
        />
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}
      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
        // onAddToCart={handleAddToCart}
        // onAddToWishlist={handleAddToWishlist}
      />
    </PageLayout>
  );
}

export default function BrowsePage() {
  return (
    <Suspense>
      <BrowsePageContent />
    </Suspense>
  );
}
