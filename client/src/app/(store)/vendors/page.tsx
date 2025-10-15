/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Filter, X } from "lucide-react";
import { useMemo, useState } from "react";

import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";

import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Label } from "@/components/UI/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";

import type { SortOption, ViewMode } from "@/lib/browse-utils";
import { cn } from "@/lib/utils";
import { VendorStyleFilterBar } from "@/components/Browse/VendorStyleFilterBar";
import { useSearchVendorCollectionQuery } from "@/redux/features/vendors/vendor";
import VendorCard from "@/components/Vendors/VendorFront/VendrodCard";
import VendorPagination from "@/components/Vendors/VendorFront/VendorPagination";
import { useAppSelector } from "@/redux/hooks";
import { selectCategories } from "@/redux/features/Common/CommonSlice";

interface VendorFilters {
  search: string;
  specialties: string[];
  rating: number;
  featured: boolean;
  minProducts: number;
  location: string;
}

export default function VendorsPage() {
  const [filters, setFilters] = useState<VendorFilters>({
    search: "",
    specialties: [],
    rating: 0,
    featured: false,
    minProducts: 0,
    location: "",
  });
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  const categoriesData = useAppSelector(selectCategories);
  console.log("categoriesData", categoriesData);

  // Transform sortBy to match API expected values
  const getApiSortBy = (sortOption: SortOption): string => {
    switch (sortOption) {
      case "newest":
        return "newest";
      case "highToLow":
        return "price-desc";
      case "lowToHigh":
        return "price-asc";
      case "productsCount":
        return "products-count";
      case "byRatings":
        return "by-ratings";
      default:
        return "newest";
    }
  };

  // Prepare API parameters
  const apiParams = {
    search: filters.search || undefined,
    page: currentPage,
    limit: itemsPerPage,
    category:
      filters.specialties.length > 0 ? filters.specialties[0] : undefined,
    sortBy: getApiSortBy(sortBy),
    ratingFilter: filters.rating > 0 ? filters.rating : undefined,
  };

  const { data: vendorsData, isLoading } =
    useSearchVendorCollectionQuery(apiParams);

  // Transform API data to Vendor format
  const vendors = useMemo(() => {
    if (!vendorsData?.data?.attributes?.vendors) return [];

    return vendorsData.data.attributes.vendors.map((vendor: any) => ({
      id: vendor._id,
      name: vendor.storeName,
      description: vendor.description,
      location: vendor.location,
      rating: vendor.averageRating || 0,
      featured: vendor.verified || false,
      totalProducts: vendor.productsCount || 0,
      specialties: vendor.category ? [vendor.category] : [],
      joinedDate: vendor.createdAt,
      storePhoto: vendor.storePhoto,
      ownerName: vendor.ownerName,
      email: vendor.email,
      website: vendor.website,
      socialLinks: vendor.socialLinks,
      status: vendor.status,
      phoneNumber: vendor.phoneNumber,
    }));
  }, [vendorsData]);

  // Update filter
  const updateFilter = <K extends keyof VendorFilters>(
    key: K,
    value: VendorFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      specialties: [],
      rating: 0,
      featured: false,
      minProducts: 0,
      location: "",
    });
    setCurrentPage(1);
  };

  // Handle filter removal from badges
  const handleRemoveFilter = (type: string, value?: string) => {
    switch (type) {
      case "search":
        updateFilter("search", "");
        break;
      case "specialty":
        updateFilter(
          "specialties",
          filters.specialties.filter((s) => s !== value)
        );
        break;
      case "rating":
        updateFilter("rating", 0);
        break;
      case "featured":
        updateFilter("featured", false);
        break;
      case "minProducts":
        updateFilter("minProducts", 0);
        break;
      case "location":
        updateFilter("location", "");
        break;
    }
  };

  // Calculate active filter count
  const activeFilterCount =
    (filters.search ? 1 : 0) +
    filters.specialties.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.featured ? 1 : 0) +
    (filters.minProducts > 0 ? 1 : 0) +
    (filters.location ? 1 : 0);

  const paginationData = vendorsData?.data?.attributes;
  const totalVendors = paginationData?.totalVendors || 0;
  const totalPages = paginationData?.totalPages || 1;

  return (
    <PageLayout
      title="Browse Vendors"
      description={`${totalVendors} vendors found${
        totalVendors > itemsPerPage
          ? ` • Page ${currentPage} of ${totalPages}`
          : ""
      }`}
      breadcrumbs={[{ label: "Browse Vendors" }]}
    >
      {/* Search and Controls */}
      <div className="mb-6">
        <VendorStyleFilterBar
          isVendorPage={true}
          search={filters.search}
          onSearchChange={(value) => updateFilter("search", value)}
          sortOption={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          activeFilterCount={activeFilterCount}
          onRemoveFilter={handleRemoveFilter}
          onClearAllFilters={clearFilters}
          advancedFilterContent={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Specialties Filter */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Specialties
                </Label>
                <Select
                  value={
                    filters.specialties.length > 0
                      ? filters.specialties[0]
                      : "all"
                  }
                  onValueChange={(value) => {
                    if (value && value !== "all") {
                      updateFilter("specialties", [value]);
                    } else {
                      updateFilter("specialties", []);
                    }
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select specialties..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {categoriesData?.map((specialty: any) => (
                      <SelectItem key={specialty?._id} value={specialty?.name}>
                        {specialty?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Minimum Rating
                </Label>
                <Select
                  value={filters.rating.toString()}
                  onValueChange={(value) =>
                    updateFilter("rating", parseFloat(value))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select rating..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Ratings</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                    <SelectItem value="4.0">4.0+ stars</SelectItem>
                    <SelectItem value="3.5">3.5+ stars</SelectItem>
                    <SelectItem value="3.0">3.0+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          }
        />
      </div>

      {/* Vendor Grid/List */}
      <div className="mb-8">
        {isLoading ? (
          <div>Loading vendors...</div>
        ) : vendors.length > 0 ? (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            )}
          >
            {vendors.map((vendor: any) => (
              <VendorCard key={vendor.id} vendor={vendor} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <EmptyStates.NoVendors />
        )}
      </div>

      {/* Pagination */}
      {totalVendors > itemsPerPage && (
        <div className="mt-8 pt-6 border-t border-border">
          <VendorPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalVendors}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={() => {}} // Remove this if not needed since itemsPerPage is fixed
          />
        </div>
      )}
    </PageLayout>
  );
}



