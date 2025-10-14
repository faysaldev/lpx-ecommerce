/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Category, Product } from "@/lib/types";
import { useBrowseFilters } from "@/hooks/useBrowseFilters";
import PageLayout from "@/components/layout/PageLayout";
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
import { VendorStyleFilterBar } from "@/components/Browse/VendorStyleFilterBar";
import { ProductGrid } from "@/components/Browse/ProductGrid";
import { QuickView } from "@/components/Browse/QuickView";
import { productStyles } from "@/components/UI/product.variants";
import { Pagination } from "@/components/Browse/Pagination";
import {
  useAllCategoriesQuery,
  useAllProductsBrowseCollectiblesQuery,
} from "@/redux/features/BrowseCollectibles/BrowseCollectibles";

function BrowsePageContent() {
  const searchParams = useSearchParams();
  //   const params: Record<string, string | string[]> | null = useParams();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [categories, setCategories] = useState<Category[]>([]);

  const [products, setProducts] = useState<Product[]>([]);

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

  // Fetch categories from backend
  const { data: categoriesData, isLoading: categoriesLoading } =
    useAllCategoriesQuery({});
  // Fetch products with dynamic params
  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching: productsFetching,
  } = useAllProductsBrowseCollectiblesQuery({
    query: filters.search || searchParams.get("q") || "",
    minPrice:
      filters.priceRange.min > 0
        ? filters.priceRange.min.toString()
        : searchParams.get("min_price") || "",
    maxPrice:
      filters.priceRange.max < 10000
        ? filters.priceRange.max.toString()
        : searchParams.get("max_price") || "",
    condition:
      filters.conditions.length > 0
        ? filters.conditions[0]
        : searchParams.get("conditions") || "",
    sortBy: sortOption || searchParams.get("sort") || "",
    page: currentPage.toString(),
    limit: itemsPerPage.toString(),
    category:
      filters.categories.length > 0
        ? filters.categories[0]
        : searchParams.get("category") || "",
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
      // console.log('Transformed Categories:', transformedCategories);
    }
  }, [categoriesData]);

  // Process products data from backend
  useEffect(() => {
    if (productsData?.data) {
      setProducts(productsData.data);
      // console.log('Backend filtered products:', productsData);
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeFilterCount > 0) {
        e.preventDefault();
        clearFilters();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeFilterCount, clearFilters]);

  // Loading state
  const isLoading = productsLoading || categoriesLoading || productsFetching;

  return (
    <PageLayout
      title="Browse Collectibles"
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
      breadcrumbs={[{ label: "Browse Collectibles" }]}
    >
      {/* Search and Controls */}
      <div className="mb-6">
        <VendorStyleFilterBar
          isVendorPage={false}
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
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
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
          isLoading={isLoading}
          onQuickView={(product: Product) => setQuickViewProduct(product)}
          onShare={handleShare}
        />
      </div>

      {/* Pagination */}
      {backendFilteredProducts.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={backendFilteredProducts.length}
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
