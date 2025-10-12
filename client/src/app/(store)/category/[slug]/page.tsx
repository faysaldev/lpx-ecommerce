/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Filter } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/index";
import { Category, Product } from "@/lib/types";
import { useBrowseFilters } from "@/hooks/useBrowseFilters";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import { MobileFilterSheet } from "@/components/Browse/FilterSidebar";
import { VendorStyleFilterBar } from "@/components/Browse/VendorStyleFilterBar";
import { ProductGrid } from "@/components/Browse/ProductGrid";
import { CONDITIONS } from "@/lib/browse-utils";
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
import { productStyles } from "@/components/UI/product.variants";
import {
  useAllCategoriesQuery,
  useAllProductsBrowseCollectiblesQuery,
} from "@/redux/features/BrowseCollectibles/BrowseCollectibles";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params?.slug ? decodeURIComponent(params.slug as string) : null;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);

  const {
    filters,
    sortOption,
    viewMode,
    activeFilterCount,
    isFiltering,
    updateFilter,
    clearFilters,
    setSortOption,
    setViewMode,
  } = useBrowseFilters(products);

  // Fetch categories for filter dropdown
  const { data: categoriesData, isLoading: categoriesLoading } =
    useAllCategoriesQuery({});

  // Fetch products with dynamic params
  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching: productsFetching,
  } = useAllProductsBrowseCollectiblesQuery({
    query: filters.search || "",
    minPrice:
      filters.priceRange.min > 0
        ? filters.priceRange.min.toString()
        : "0",
    maxPrice:
      filters.priceRange.max < 10000
        ? filters.priceRange.max.toString()
        : "10000",
    condition: filters.conditions.length > 0 ? filters.conditions[0] : "",
    sortBy: sortOption,
    page: currentPage.toString(),
    limit: itemsPerPage.toString(),
    category: categorySlug || "", // Use categorySlug from URL params
  });

  // Process categories data from backend
  useEffect(() => {
    if (categoriesData?.data?.attributes) {
      const backendCategories = categoriesData.data.attributes;

      // Transform backend categories to match your Category type
      const transformedCategories: Category[] = backendCategories.map(
        (cat: any) => ({
          id: cat._id,
          name: cat.name,
          slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-"),
          description: cat.description,
          image: cat.image || "",
          productCount: cat.productCount || 0,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
        })
      );

      setCategories(transformedCategories);
    }
  }, [categoriesData]);

  // Process products data from backend
  useEffect(() => {
    if (productsData?.data) {
      setProducts(productsData.data);
    }
  }, [productsData]);

  // Use backend filtered results directly
  const backendFilteredProducts = productsData?.data || [];

  // Calculate pagination using backend filtered results
  const totalPages = Math.ceil(backendFilteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return backendFilteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [backendFilteredProducts, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  // Generate active filter pills
  const getActiveFilterPills = () => {
    const pills = [];

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
        label: `${filters.priceRange.min}-${filters.priceRange.max}`,
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

  // Handle filter removal
  const handleRemoveFilter = (type: string, value: string) => {
    switch (type) {
      case "search":
        updateFilter("search", "");
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
  const handleAddToCart = (product: Product) => {
    toast.success(`${product.name} added to cart`);
  };

  const handleAddToWishlist = (product: Product) => {
    toast.success(`${product.name} added to wishlist`);
  };

  const handleBuyNow = (product: Product) => {
    if (process.env.NODE_ENV !== "production")
      console.log("Buy now clicked for:", product.id);
    toast.info("Buy now functionality coming soon!");
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

  if (productsLoading) {
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

  // if (!categorySlug) {
  //   return (
  //     <PageLayout>
  //       <EmptyStates.Error
  //         onRetry={() => window.location.reload()}
  //         title="Category Not Found"
  //         description="The category you're looking for doesn't exist or has been removed."
  //         actionLabel="Browse All Products"
  //         actionHref="/browse"
  //       />
  //     </PageLayout>
  //   );
  // }

  // Loading state
  const isLoading = productsLoading || categoriesLoading || productsFetching;

  return (
    <PageLayout
      title={categorySlug || "Unknown Category"}
      description={
        isLoading
          ? "Loading..."
          : isFiltering
          ? "Filtering..."
          : `${backendFilteredProducts.length} items found${
              backendFilteredProducts.length > itemsPerPage
                ? ` • Page ${currentPage} of ${totalPages}`
                : ""
            }`
      }
      breadcrumbs={[
        { label: "Category", href:  `/category/${categorySlug || ""}` },
        { label: categorySlug || "Loading...", href: `/category/${categorySlug || ""}` },
      ]}
    >
      {/* Mobile Filter Button */}
      <div className="flex justify-end mb-8 lg:hidden">
        <MobileFilterSheet
          filters={filters}
          onUpdateFilter={updateFilter}
          onClearFilters={clearFilters}
          products={products}
          categories={categories}
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

      {/* Controls */}
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
              {/* Categories Filter - Only show other categories, not the current one as selectable */}
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
                  disabled={categoriesLoading}
                >
                  <SelectTrigger className={cn(productStyles.forms.select.md)}>
                    <SelectValue
                      placeholder={
                        categoriesLoading
                          ? "Loading..."
                          : "Select categories..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="all" value="all">
                      All Categories
                    </SelectItem>
                    {categoriesData?.data?.attributes?.map((category: any) => {
                      // Don't show the current category in the dropdown since we're already in that category page
                      if (category.name.toLowerCase().replace(/\s+/g, "-") === categorySlug) {
                        return null;
                      }
                      return (
                        <SelectItem key={category._id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      );
                    })}
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

      {/* Products Grid/List */}
      <ProductGrid
        products={paginatedProducts}
        viewMode={viewMode}
        isLoading={isLoading}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        onBuyNow={handleBuyNow}
        onShare={handleShare}
      />

      {/* Pagination */}
      {backendFilteredProducts.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, backendFilteredProducts.length)}-
              {Math.min(currentPage * itemsPerPage, backendFilteredProducts.length)} of {backendFilteredProducts.length} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="border rounded-md px-2 py-1 text-sm"
              >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
                <option value="96">96</option>
              </select>
            </div>
          </div>
        </div>
      )}

   <ProductGrid
          products={productsData?.data || []}
          viewMode={viewMode}
          isLoading={productsLoading}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onBuyNow={handleBuyNow}
          onShare={handleShare}
        />
    </PageLayout>
  );
}
