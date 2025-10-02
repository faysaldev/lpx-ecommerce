/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Award, Filter, Package, Shield, Star, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/UI/accordion";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Checkbox } from "@/components/UI/checkbox";
import { Label } from "@/components/UI/label";
import { RadioGroup, RadioGroupItem } from "@/components/UI/radio-group";
import { ScrollArea } from "@/components/UI/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { Separator } from "@/components/UI/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/UI/sheet";
import { Slider } from "@/components/UI/slider";
import { Switch } from "@/components/UI/switch";

import type { Vendor } from "@/lib/types";
import type { SortOption, ViewMode } from "@/lib/browse-utils";
import { cn } from "@/lib/utils";
import { VendorStyleFilterBar } from "@/components/Browse/VendorStyleFilterBar";
import { useSearchVendorCollectionQuery } from "@/redux/features/vendors/vendor";
import VendorCard from "@/components/Vendors/VendorFront/VendrodCard";
import VendorPagination from "@/components/Vendors/VendorFront/VendorPagination";

const specialtyOptions = [
  "Trading Cards",
  "Comics",
  "Pokémon",
  "Magic: The Gathering",
  "Sports Cards",
  "Gaming Cards",
  "Yu-Gi-Oh!",
  "Marvel",
  "DC Comics",
  "Manga",
  "Graphic Novels",
  "Vintage Comics",
  "First Editions",
  "Rare Comics",
  "Collectible Cards",
  "PSA Graded",
  "CGC Graded",
  "Mint Condition",
  "Near Mint",
  "Excellent Condition",
  "Vintage Items",
  "Rare Items",
  "Limited Editions",
  "Special Editions",
  "Holographic Cards",
  "Foil Cards",
  "Promo Cards",
  "Tournament Cards",
  "Japanese Cards",
  "English Cards",
  "Arabic Comics",
  "International Comics",
  "Collectibles",
  "Memorabilia",
  "Authenticated Items",
  "Certified Items",
  "Investment Grade",
  "High Value Items",
  "Popular Characters",
  "Superhero Comics",
  "Anime Cards",
  "Sports Memorabilia",
  "Rookie Cards",
  "Hall of Fame",
  "Championship Cards",
  "General Merchandise",
];

interface VendorFilters {
  search: string;
  specialties: string[];
  rating: number;
  featured: boolean;
  minProducts: number;
  location: string;
}

// Mobile Filter Sheet Component
function MobileFilterSheet({
  filters,
  onUpdateFilter,
  onClearFilters,
  vendors = [],
  children,
}: {
  filters: VendorFilters;
  onUpdateFilter: <K extends keyof VendorFilters>(
    key: K,
    value: VendorFilters[K]
  ) => void;
  onClearFilters: () => void;
  vendors?: Vendor[];
  children: React.ReactNode;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle>Filter Vendors</SheetTitle>
        </SheetHeader>
        <Separator />
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <FilterContent
            filters={filters}
            onUpdateFilter={onUpdateFilter}
            onClearFilters={onClearFilters}
            vendors={vendors}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// Filter Content Component (reusable for sidebar and mobile sheet)
function FilterContent({
  filters,
  onUpdateFilter,
  onClearFilters,
  vendors = [],
}: {
  filters: VendorFilters;
  onUpdateFilter: <K extends keyof VendorFilters>(
    key: K,
    value: VendorFilters[K]
  ) => void;
  onClearFilters: () => void;
  vendors?: Vendor[];
}) {
  const activeFilterCount =
    (filters.search ? 1 : 0) +
    filters.specialties.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.featured ? 1 : 0) +
    (filters.minProducts > 0 ? 1 : 0) +
    (filters.location ? 1 : 0);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 min-h-[61px] border-b">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-semibold">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-7 px-2 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <Accordion type="multiple" defaultValue={[]} className="w-full">
            <AccordionItem value="specialties">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Specialties</span>
                  {filters.specialties.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {filters.specialties.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {specialtyOptions.map((specialty) => (
                    <div
                      key={specialty}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={specialty}
                        checked={filters.specialties.includes(specialty)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onUpdateFilter("specialties", [
                              ...filters.specialties,
                              specialty,
                            ]);
                          } else {
                            onUpdateFilter(
                              "specialties",
                              filters.specialties.filter((s) => s !== specialty)
                            );
                          }
                        }}
                      />
                      <Label
                        htmlFor={specialty}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {specialty}
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {
                          vendors.filter((v) =>
                            v.specialties?.includes(specialty)
                          ).length
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rating">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>Minimum Rating</span>
                  {filters.rating > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {filters.rating}+
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <RadioGroup
                  value={filters.rating.toString()}
                  onValueChange={(value) =>
                    onUpdateFilter("rating", parseFloat(value))
                  }
                >
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="rating-all" />
                      <Label
                        htmlFor="rating-all"
                        className="font-normal cursor-pointer flex-1"
                      >
                        All Ratings
                      </Label>
                    </div>
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={rating.toString()}
                          id={`rating-${rating}`}
                        />
                        <Label
                          htmlFor={`rating-${rating}`}
                          className="font-normal cursor-pointer flex-1"
                        >
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{rating}+ stars</span>
                          </div>
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {vendors.filter((v) => v.rating >= rating).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="features">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Features</span>
                  {filters.featured && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      1
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="featured"
                      className="font-normal cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span>Featured Vendors</span>
                      </div>
                    </Label>
                    <Switch
                      id="featured"
                      checked={filters.featured}
                      onCheckedChange={(checked) =>
                        onUpdateFilter("featured", checked)
                      }
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="products">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Minimum Products</span>
                  {filters.minProducts > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {filters.minProducts}+
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{filters.minProducts}</span>
                    <span className="text-muted-foreground">products</span>
                  </div>
                  <Slider
                    value={[filters.minProducts]}
                    onValueChange={([value]) =>
                      onUpdateFilter("minProducts", value)
                    }
                    min={0}
                    max={500}
                    step={50}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Any</span>
                    <span>500+</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}

// Filter Badges Component
function FilterBadges({
  filters,
  onRemoveFilter,
  onClearAll,
}: {
  filters: VendorFilters;
  onRemoveFilter: (type: string, value?: string) => void;
  onClearAll: () => void;
}) {
  const badges = [];

  if (filters.search) {
    badges.push({
      type: "search",
      label: `Search: "${filters.search}"`,
      value: filters.search,
    });
  }

  filters.specialties.forEach((specialty) => {
    badges.push({ type: "specialty", label: specialty, value: specialty });
  });

  if (filters.rating > 0) {
    badges.push({ type: "rating", label: `${filters.rating}+ stars` });
  }

  if (filters.featured) {
    badges.push({ type: "featured", label: "Featured only" });
  }

  if (filters.minProducts > 0) {
    badges.push({
      type: "minProducts",
      label: `${filters.minProducts}+ products`,
    });
  }

  if (filters.location) {
    badges.push({
      type: "location",
      label: filters.location,
      value: filters.location,
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className="bg-muted/30 rounded-lg border p-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="text-sm text-muted-foreground flex-shrink-0">
          Active filters:
        </span>
        {badges.map((badge, index) => (
          <Badge
            key={`${badge.type}-${badge.value || index}`}
            variant="secondary"
            className="gap-1 pr-1"
          >
            {badge.label}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFilter(badge.type, badge.value)}
              className="h-4 w-4 p-0 hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-6 text-xs"
        >
          Clear all
        </Button>
      </div>
    </div>
  );
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

  // Transform sortBy to match API expected values
  const getApiSortBy = (sortOption: SortOption): string => {
    switch (sortOption) {
      case "newest":
        return "newest";
      case "highToLow":
        return "price-desc";
      case "lowToHigh":
        return "price-asc";
      case "A-Z":
        return "name-asc";
      case "Z-A":
        return "name-desc";
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

  // Handle vendor follow
  const handleFollow = (vendorId: string) => {
    // API call for following vendor would go here
  };

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
      {/* Page Header Actions - Mobile Filter Button */}
      <div className="flex justify-end mb-6 lg:hidden">
        <MobileFilterSheet
          filters={filters}
          onUpdateFilter={updateFilter}
          onClearFilters={clearFilters}
          vendors={vendors}
        >
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </MobileFilterSheet>
      </div>

      {/* Search and Controls */}
      <div className="mb-6">
        <VendorStyleFilterBar
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
                    {specialtyOptions.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
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

      {/* Filter Badges */}
      {activeFilterCount > 0 && (
        <div className="mb-6">
          <FilterBadges
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={clearFilters}
          />
        </div>
      )}

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
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                viewMode={viewMode}
                onFollow={handleFollow}
              />
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

// "use client";

// import { Award, Filter, Package, Shield, Star, X } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";

// import PageLayout from "@/components/layout/PageLayout";
// import { EmptyStates } from "@/components/shared/EmptyState";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/UI/accordion";
// import { Badge } from "@/components/UI/badge";
// import { Button } from "@/components/UI/button";
// import { Checkbox } from "@/components/UI/checkbox";

// import { Label } from "@/components/UI/label";
// import { RadioGroup, RadioGroupItem } from "@/components/UI/radio-group";
// import { ScrollArea } from "@/components/UI/scroll-area";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/UI/select";
// import { Separator } from "@/components/UI/separator";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/UI/sheet";
// import { Slider } from "@/components/UI/slider";
// import { Switch } from "@/components/UI/switch";

// // import { getVendorAPI } from "@/lib/api/client";
// import type { Vendor } from "@/lib/types";
// import type { SortOption, ViewMode } from "@/lib/browse-utils";
// import { cn } from "@/lib/utils";
// import { VendorStyleFilterBar } from "@/components/Browse/VendorStyleFilterBar";
// import {
//   useSearchVendorCollectionQuery,
//   useVendorGetsQuery,
// } from "@/redux/features/vendors/vendor";
// import VendorCard from "@/components/Vendors/VendorFront/VendrodCard";
// import VendorPagination from "@/components/Vendors/VendorFront/VendorPagination";

// const specialtyOptions = [
//   "Trading Cards",
//   "Comics",
//   "Pokémon",
//   "Magic: The Gathering",
//   "Sports Cards",
//   "Gaming Cards",
//   "Yu-Gi-Oh!",
//   "Marvel",
//   "DC Comics",
//   "Manga",
//   "Graphic Novels",
//   "Vintage Comics",
//   "First Editions",
//   "Rare Comics",
//   "Collectible Cards",
//   "PSA Graded",
//   "CGC Graded",
//   "Mint Condition",
//   "Near Mint",
//   "Excellent Condition",
//   "Vintage Items",
//   "Rare Items",
//   "Limited Editions",
//   "Special Editions",
//   "Holographic Cards",
//   "Foil Cards",
//   "Promo Cards",
//   "Tournament Cards",
//   "Japanese Cards",
//   "English Cards",
//   "Arabic Comics",
//   "International Comics",
//   "Collectibles",
//   "Memorabilia",
//   "Authenticated Items",
//   "Certified Items",
//   "Investment Grade",
//   "High Value Items",
//   "Popular Characters",
//   "Superhero Comics",
//   "Anime Cards",
//   "Sports Memorabilia",
//   "Rookie Cards",
//   "Hall of Fame",
//   "Championship Cards",
//   "General Merchandise",
// ];

// interface VendorFilters {
//   search: string;
//   specialties: string[];
//   rating: number;
//   featured: boolean;
//   minProducts: number;
//   location: string;
// }

// // Mobile Filter Sheet Component
// function MobileFilterSheet({
//   filters,
//   onUpdateFilter,
//   onClearFilters,
//   vendors = [],
//   children,
// }: {
//   filters: VendorFilters;
//   onUpdateFilter: <K extends keyof VendorFilters>(
//     key: K,
//     value: VendorFilters[K]
//   ) => void;
//   onClearFilters: () => void;
//   vendors?: Vendor[];
//   children: React.ReactNode;
// }) {
//   return (
//     <Sheet>
//       <SheetTrigger asChild>{children}</SheetTrigger>
//       <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0">
//         <SheetHeader className="p-6 pb-4">
//           <SheetTitle>Filter Vendors</SheetTitle>
//         </SheetHeader>
//         <Separator />
//         <ScrollArea className="h-[calc(100vh-8rem)]">
//           <FilterContent
//             filters={filters}
//             onUpdateFilter={onUpdateFilter}
//             onClearFilters={onClearFilters}
//             vendors={vendors}
//           />
//         </ScrollArea>
//       </SheetContent>
//     </Sheet>
//   );
// }

// // Filter Content Component (reusable for sidebar and mobile sheet)
// function FilterContent({
//   filters,
//   onUpdateFilter,
//   onClearFilters,
//   vendors = [],
// }: {
//   filters: VendorFilters;
//   onUpdateFilter: <K extends keyof VendorFilters>(
//     key: K,
//     value: VendorFilters[K]
//   ) => void;
//   onClearFilters: () => void;
//   vendors?: Vendor[];
// }) {
//   const activeFilterCount =
//     (filters.search ? 1 : 0) +
//     filters.specialties.length +
//     (filters.rating > 0 ? 1 : 0) +
//     (filters.featured ? 1 : 0) +
//     (filters.minProducts > 0 ? 1 : 0) +
//     (filters.location ? 1 : 0);

//   return (
//     <div className="h-full flex flex-col">
//       {/* Header */}
//       <div className="flex items-center justify-between px-4 py-3 min-h-[61px] border-b">
//         <div className="flex items-center gap-2">
//           <Filter className="h-4 w-4" />
//           <span className="font-semibold">Filters</span>
//           {activeFilterCount > 0 && (
//             <Badge variant="secondary" className="ml-2">
//               {activeFilterCount}
//             </Badge>
//           )}
//         </div>
//         {activeFilterCount > 0 && (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onClearFilters}
//             className="h-7 px-2 text-xs"
//           >
//             Clear all
//           </Button>
//         )}
//       </div>

//       {/* Filters */}
//       <ScrollArea className="flex-1">
//         <div className="p-4 space-y-6">
//           <Accordion type="multiple" defaultValue={[]} className="w-full">
//             {/* Specialties */}
//             <AccordionItem value="specialties">
//               <AccordionTrigger className="hover:no-underline">
//                 <div className="flex items-center gap-2">
//                   <Package className="h-4 w-4" />
//                   <span>Specialties</span>
//                   {filters.specialties.length > 0 && (
//                     <Badge variant="secondary" className="ml-2 h-5 px-1.5">
//                       {filters.specialties.length}
//                     </Badge>
//                   )}
//                 </div>
//               </AccordionTrigger>
//               <AccordionContent>
//                 <div className="space-y-2 pt-2">
//                   {specialtyOptions.map((specialty) => (
//                     <div
//                       key={specialty}
//                       className="flex items-center space-x-2"
//                     >
//                       <Checkbox
//                         id={specialty}
//                         checked={filters.specialties.includes(specialty)}
//                         onCheckedChange={(checked) => {
//                           if (checked) {
//                             onUpdateFilter("specialties", [
//                               ...filters.specialties,
//                               specialty,
//                             ]);
//                           } else {
//                             onUpdateFilter(
//                               "specialties",
//                               filters.specialties.filter((s) => s !== specialty)
//                             );
//                           }
//                         }}
//                       />
//                       <Label
//                         htmlFor={specialty}
//                         className="text-sm font-normal cursor-pointer flex-1"
//                       >
//                         {specialty}
//                       </Label>
//                       <span className="text-xs text-muted-foreground">
//                         {
//                           vendors.filter((v) =>
//                             v.specialties?.includes(specialty)
//                           ).length
//                         }
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </AccordionContent>
//             </AccordionItem>

//             {/* Rating */}
//             <AccordionItem value="rating">
//               <AccordionTrigger className="hover:no-underline">
//                 <div className="flex items-center gap-2">
//                   <Star className="h-4 w-4" />
//                   <span>Minimum Rating</span>
//                   {filters.rating > 0 && (
//                     <Badge variant="secondary" className="ml-2 h-5 px-1.5">
//                       {filters.rating}+
//                     </Badge>
//                   )}
//                 </div>
//               </AccordionTrigger>
//               <AccordionContent>
//                 <RadioGroup
//                   value={filters.rating.toString()}
//                   onValueChange={(value) =>
//                     onUpdateFilter("rating", parseFloat(value))
//                   }
//                 >
//                   <div className="space-y-2 pt-2">
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="0" id="rating-all" />
//                       <Label
//                         htmlFor="rating-all"
//                         className="font-normal cursor-pointer flex-1"
//                       >
//                         All Ratings
//                       </Label>
//                     </div>
//                     {[4.5, 4.0, 3.5, 3.0].map((rating) => (
//                       <div key={rating} className="flex items-center space-x-2">
//                         <RadioGroupItem
//                           value={rating.toString()}
//                           id={`rating-${rating}`}
//                         />
//                         <Label
//                           htmlFor={`rating-${rating}`}
//                           className="font-normal cursor-pointer flex-1"
//                         >
//                           <div className="flex items-center gap-1">
//                             <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                             <span>{rating}+ stars</span>
//                           </div>
//                         </Label>
//                         <span className="text-xs text-muted-foreground">
//                           {vendors.filter((v) => v.rating >= rating).length}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </RadioGroup>
//               </AccordionContent>
//             </AccordionItem>

//             {/* Features */}
//             <AccordionItem value="features">
//               <AccordionTrigger className="hover:no-underline">
//                 <div className="flex items-center gap-2">
//                   <Shield className="h-4 w-4" />
//                   <span>Features</span>
//                   {filters.featured && (
//                     <Badge variant="secondary" className="ml-2 h-5 px-1.5">
//                       1
//                     </Badge>
//                   )}
//                 </div>
//               </AccordionTrigger>
//               <AccordionContent>
//                 <div className="space-y-3 pt-2">
//                   <div className="flex items-center justify-between">
//                     <Label
//                       htmlFor="featured"
//                       className="font-normal cursor-pointer"
//                     >
//                       <div className="flex items-center gap-2">
//                         <Award className="h-4 w-4 text-yellow-500" />
//                         <span>Featured Vendors</span>
//                       </div>
//                     </Label>
//                     <Switch
//                       id="featured"
//                       checked={filters.featured}
//                       onCheckedChange={(checked) =>
//                         onUpdateFilter("featured", checked)
//                       }
//                     />
//                   </div>
//                 </div>
//               </AccordionContent>
//             </AccordionItem>

//             {/* Product Count */}
//             <AccordionItem value="products">
//               <AccordionTrigger className="hover:no-underline">
//                 <div className="flex items-center gap-2">
//                   <Package className="h-4 w-4" />
//                   <span>Minimum Products</span>
//                   {filters.minProducts > 0 && (
//                     <Badge variant="secondary" className="ml-2 h-5 px-1.5">
//                       {filters.minProducts}+
//                     </Badge>
//                   )}
//                 </div>
//               </AccordionTrigger>
//               <AccordionContent>
//                 <div className="space-y-3 pt-2">
//                   <div className="flex items-center justify-between text-sm">
//                     <span>{filters.minProducts}</span>
//                     <span className="text-muted-foreground">products</span>
//                   </div>
//                   <Slider
//                     value={[filters.minProducts]}
//                     onValueChange={([value]) =>
//                       onUpdateFilter("minProducts", value)
//                     }
//                     min={0}
//                     max={500}
//                     step={50}
//                     className="py-4"
//                   />
//                   <div className="flex justify-between text-xs text-muted-foreground">
//                     <span>Any</span>
//                     <span>500+</span>
//                   </div>
//                 </div>
//               </AccordionContent>
//             </AccordionItem>
//           </Accordion>
//         </div>
//       </ScrollArea>
//     </div>
//   );
// }

// // Filter Badges Component
// function FilterBadges({
//   filters,
//   onRemoveFilter,
//   onClearAll,
// }: {
//   filters: VendorFilters;
//   onRemoveFilter: (type: string, value?: string) => void;
//   onClearAll: () => void;
// }) {
//   const badges = [];

//   if (filters.search) {
//     badges.push({
//       type: "search",
//       label: `Search: "${filters.search}"`,
//       value: filters.search,
//     });
//   }

//   filters.specialties.forEach((specialty) => {
//     badges.push({ type: "specialty", label: specialty, value: specialty });
//   });

//   if (filters.rating > 0) {
//     badges.push({ type: "rating", label: `${filters.rating}+ stars` });
//   }

//   if (filters.featured) {
//     badges.push({ type: "featured", label: "Featured only" });
//   }

//   if (filters.minProducts > 0) {
//     badges.push({
//       type: "minProducts",
//       label: `${filters.minProducts}+ products`,
//     });
//   }

//   if (filters.location) {
//     badges.push({
//       type: "location",
//       label: filters.location,
//       value: filters.location,
//     });
//   }

//   if (badges.length === 0) return null;

//   return (
//     <div className="bg-muted/30 rounded-lg border p-4">
//       <div className="flex items-center gap-2 flex-wrap">
//         <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
//         <span className="text-sm text-muted-foreground flex-shrink-0">
//           Active filters:
//         </span>
//         {badges.map((badge, index) => (
//           <Badge
//             key={`${badge.type}-${badge.value || index}`}
//             variant="secondary"
//             className="gap-1 pr-1"
//           >
//             {badge.label}
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => onRemoveFilter(badge.type, badge.value)}
//               className="h-4 w-4 p-0 hover:bg-transparent"
//             >
//               <X className="h-3 w-3" />
//             </Button>
//           </Badge>
//         ))}
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={onClearAll}
//           className="h-6 text-xs"
//         >
//           Clear all
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default function VendorsPage() {
//   if (process.env.NODE_ENV !== "production")
//     console.log("🚀 VendorsPage component mounting/rendering");
//   const [vendors, setVendors] = useState<Vendor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState<VendorFilters>({
//     search: "",
//     specialties: [],
//     rating: 0,
//     featured: false,
//     minProducts: 0,
//     location: "",
//   });

//   console.log(filters, "vendor filters");

//   const [sortBy, setSortBy] = useState<SortOption>("newest");
//   const [viewMode, setViewMode] = useState<ViewMode>("grid");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(24);

//   const { data, error, isLoading } = useSearchVendorCollectionQuery({
//     // search,
//     // page,
//     // limit,
//     // category,
//     // sortBy,
//     // ratingFilter,
//   });
//   console.log(data?.data?.attributes, "vendor data");

//   if (process.env.NODE_ENV !== "production")
//     console.log("📊 Current state:", {
//       vendorsCount: vendors?.length,
//       loading,
//       filters,
//       sortBy,
//       viewMode,
//       currentPage,
//       itemsPerPage,
//     });

//   // Update filter
//   const updateFilter = <K extends keyof VendorFilters>(
//     key: K,
//     value: VendorFilters[K]
//   ) => {
//     if (process.env.NODE_ENV !== "production")
//       console.log("🔄 Filter update:", key, "=", value);
//     setFilters((prev) => {
//       const newFilters = { ...prev, [key]: value };
//       if (process.env.NODE_ENV !== "production")
//         console.log("📝 New filters state:", newFilters);
//       return newFilters;
//     });
//     setCurrentPage(1); // Reset to first page when filters change
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setFilters({
//       search: "",
//       specialties: [],
//       rating: 0,
//       featured: false,
//       minProducts: 0,
//       location: "",
//     });
//     setCurrentPage(1);
//   };

//   // Handle filter removal from badges
//   const handleRemoveFilter = (type: string, value?: string) => {
//     switch (type) {
//       case "search":
//         updateFilter("search", "");
//         break;
//       case "specialty":
//         updateFilter(
//           "specialties",
//           filters.specialties.filter((s) => s !== value)
//         );
//         break;
//       case "rating":
//         updateFilter("rating", 0);
//         break;
//       case "featured":
//         updateFilter("featured", false);
//         break;
//       case "minProducts":
//         updateFilter("minProducts", 0);
//         break;
//       case "location":
//         updateFilter("location", "");
//         break;
//     }
//   };

//   // Calculate active filter count
//   const activeFilterCount =
//     (filters.search ? 1 : 0) +
//     filters.specialties.length +
//     (filters.rating > 0 ? 1 : 0) +
//     (filters.featured ? 1 : 0) +
//     (filters.minProducts > 0 ? 1 : 0) +
//     (filters.location ? 1 : 0);

//   useEffect(() => {
//     if (process.env.NODE_ENV !== "production")
//       console.log(
//         "🔥 useEffect triggered - starting vendor fetch at:",
//         new Date().toISOString()
//       );
//     if (process.env.NODE_ENV !== "production")
//       console.log("💡 Calling fetchVendors() function...");
//     // fetchVendors();
//     if (process.env.NODE_ENV !== "production")
//       console.log("📩 fetchVendors() call completed (async)");
//   }, []);

//   // Filter and sort vendors
//   const filteredVendors = useMemo(() => {
//     if (process.env.NODE_ENV !== "production")
//       console.log(
//         "🧮 filteredVendors useMemo triggered - input vendors:",
//         vendors?.length
//       );
//     if (process.env.NODE_ENV !== "production")
//       console.log("🧮 Filtering with:", { filters, sortBy });
//     let filtered = [...vendors];

//     // Apply filters
//     if (filters.search) {
//       const searchLower = filters.search.toLowerCase();
//       filtered = filtered.filter(
//         (v) =>
//           v.name.toLowerCase().includes(searchLower) ||
//           v.description.toLowerCase().includes(searchLower) ||
//           (typeof v.location === "string"
//             ? v.location.toLowerCase().includes(searchLower)
//             : false) ||
//           v.specialties?.some((s: string) =>
//             s.toLowerCase().includes(searchLower)
//           )
//       );
//     }

//     if (filters.specialties.length > 0) {
//       filtered = filtered.filter((v) =>
//         v.specialties?.some((s: string) => filters.specialties.includes(s))
//       );
//     }

//     if (filters.rating > 0) {
//       filtered = filtered.filter((v) => v.rating >= filters.rating);
//     }

//     if (filters.featured) {
//       filtered = filtered.filter((v) => v.featured);
//     }

//     if (filters.minProducts > 0) {
//       filtered = filtered.filter(
//         (v) => (v.totalProducts ?? 0) >= filters.minProducts
//       );
//     }

//     if (filters.location) {
//       filtered = filtered.filter((v) =>
//         typeof v.location === "string"
//           ? v.location.toLowerCase().includes(filters.location.toLowerCase())
//           : false
//       );
//     }

//     // Sort
//     switch (sortBy) {
//       case "newest":
//         filtered.sort(
//           (a, b) =>
//             new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
//         );
//         break;
//       case "name-asc":
//         filtered.sort((a, b) => a.name.localeCompare(b.name));
//         break;
//       case "name-desc":
//         filtered.sort((a, b) => b.name.localeCompare(a.name));
//         break;
//       case "price-asc":
//         // For vendors, we might sort by average product price or another metric
//         filtered.sort((a, b) => a.rating - b.rating);
//         break;
//       case "price-desc":
//         filtered.sort((a, b) => b.rating - a.rating);
//         break;
//       default:
//         filtered.sort((a, b) => b.rating - a.rating);
//     }

//     if (process.env.NODE_ENV !== "production")
//       console.log(
//         "🎯 filteredVendors result:",
//         filtered?.length,
//         "vendors after filtering and sorting"
//       );
//     if (process.env.NODE_ENV !== "production")
//       console.log("🎯 Final filtered vendors:", filtered);
//     return filtered;
//   }, [vendors, filters, sortBy]);

//   // Calculate pagination
//   const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
//   const paginatedVendors = useMemo(() => {
//     if (process.env.NODE_ENV !== "production")
//       console.log("📄 paginatedVendors useMemo triggered");
//     if (process.env.NODE_ENV !== "production")
//       console.log("📄 Pagination params:", {
//         filteredVendorsCount: filteredVendors?.length,
//         currentPage,
//         itemsPerPage,
//         totalPages,
//       });
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const result = filteredVendors.slice(startIndex, startIndex + itemsPerPage);
//     if (process.env.NODE_ENV !== "production")
//       console.log(
//         "📄 paginatedVendors result:",
//         result?.length,
//         "vendors for page",
//         currentPage
//       );
//     if (process.env.NODE_ENV !== "production")
//       console.log("📄 Final paginated vendors:", result);
//     return result;
//   }, [filteredVendors, currentPage, itemsPerPage, totalPages]);

//   // Handle vendor follow
//   const handleFollow = (vendorId: string) => {
//     // In a real app, this would make an API call
//     if (process.env.NODE_ENV !== "production")
//       console.log("👤 Following vendor:", vendorId);
//   };

//   // Log render decisions
//   if (process.env.NODE_ENV !== "production")
//     console.log("🎨 Render decision:", {
//       loading,
//       paginatedVendorsCount: paginatedVendors?.length,
//       filteredVendorsCount: filteredVendors?.length,
//       willShowEmptyState: paginatedVendors.length === 0,
//       willShowVendors: paginatedVendors.length > 0,
//     });

//   const { data: vendorsData } = useVendorGetsQuery({});

//   console.log(vendorsData, "taking vendor data");

//   return (
//     <PageLayout
//       title="Browse Vendors"
//       description={`${filteredVendors.length} vendors found${
//         filteredVendors.length > itemsPerPage
//           ? ` • Page ${currentPage} of ${totalPages}`
//           : ""
//       }`}
//       breadcrumbs={[{ label: "Browse Vendors" }]}
//     >
//       {/* Page Header Actions - Mobile Filter Button */}
//       <div className="flex justify-end mb-6 lg:hidden">
//         <MobileFilterSheet
//           filters={filters}
//           onUpdateFilter={updateFilter}
//           onClearFilters={clearFilters}
//           vendors={vendors}
//         >
//           <Button variant="outline">
//             <Filter className="h-4 w-4 mr-2" />
//             Filters
//             {activeFilterCount > 0 && (
//               <Badge variant="secondary" className="ml-2">
//                 {activeFilterCount}
//               </Badge>
//             )}
//           </Button>
//         </MobileFilterSheet>
//       </div>

//       {/* Search and Controls */}
//       <div className="mb-6">
//         <VendorStyleFilterBar
//           search={filters.search}
//           onSearchChange={(value) => updateFilter("search", value)}
//           sortOption={sortBy}
//           onSortChange={setSortBy}
//           viewMode={viewMode}
//           onViewModeChange={setViewMode}
//           activeFilterCount={activeFilterCount}
//           onRemoveFilter={handleRemoveFilter}
//           onClearAllFilters={clearFilters}
//           advancedFilterContent={
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               {/* Specialties Filter */}
//               <div>
//                 <Label className="text-sm font-medium text-muted-foreground mb-2 block">
//                   Specialties
//                 </Label>
//                 <Select
//                   value={
//                     filters.specialties.length > 0
//                       ? filters.specialties[0]
//                       : "all"
//                   }
//                   onValueChange={(value) => {
//                     if (value && value !== "all") {
//                       updateFilter("specialties", [value]);
//                     } else {
//                       updateFilter("specialties", []);
//                     }
//                   }}
//                 >
//                   <SelectTrigger className="h-9">
//                     <SelectValue placeholder="Select specialties..." />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Specialties</SelectItem>
//                     {specialtyOptions.map((specialty) => (
//                       <SelectItem key={specialty} value={specialty}>
//                         {specialty}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Rating Filter */}
//               <div>
//                 <Label className="text-sm font-medium text-muted-foreground mb-2 block">
//                   Minimum Rating
//                 </Label>
//                 <Select
//                   value={filters.rating.toString()}
//                   onValueChange={(value) =>
//                     updateFilter("rating", parseFloat(value))
//                   }
//                 >
//                   <SelectTrigger className="h-9">
//                     <SelectValue placeholder="Select rating..." />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="0">All Ratings</SelectItem>
//                     <SelectItem value="4.5">4.5+ stars</SelectItem>
//                     <SelectItem value="4.0">4.0+ stars</SelectItem>
//                     <SelectItem value="3.5">3.5+ stars</SelectItem>
//                     <SelectItem value="3.0">3.0+ stars</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           }
//         />
//       </div>

//       {/* Filter Badges */}
//       {activeFilterCount > 0 && (
//         <div className="mb-6">
//           <FilterBadges
//             filters={filters}
//             onRemoveFilter={handleRemoveFilter}
//             onClearAll={clearFilters}
//           />
//         </div>
//       )}

//       {/* Vendor Grid/List */}
//       <div className="mb-8">
//         {(() => {
//           if (loading) {
//             if (process.env.NODE_ENV !== "production")
//               console.log("⏳ Rendering loading state");
//             return <div>Loading vendors...</div>;
//           }

//           if (paginatedVendors.length > 0) {
//             if (process.env.NODE_ENV !== "production")
//               console.log(
//                 "✅ Rendering",
//                 paginatedVendors.length,
//                 "vendor cards"
//               );
//             return (
//               <div
//                 className={cn(
//                   viewMode === "grid"
//                     ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//                     : "space-y-4"
//                 )}
//               >
//                 {paginatedVendors.map((vendor) => {
//                   if (process.env.NODE_ENV !== "production")
//                     console.log(
//                       "🏢 Rendering vendor card for:",
//                       vendor.id,
//                       vendor.name || vendor.name
//                     );
//                   return (
//                     <VendorCard
//                       key={vendor.id}
//                       vendor={vendor}
//                       viewMode={viewMode}
//                       onFollow={handleFollow}
//                     />
//                   );
//                 })}
//               </div>
//             );
//           } else {
//             if (process.env.NODE_ENV !== "production")
//               console.log("🚫 Rendering empty state - no vendors to show");
//             return <EmptyStates.NoVendors />;
//           }
//         })()}
//       </div>

//       {/* Pagination */}
//       {filteredVendors.length > itemsPerPage && (
//         <div className="mt-8 pt-6 border-t border-border">
//           <VendorPagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             totalItems={filteredVendors.length}
//             itemsPerPage={itemsPerPage}
//             onPageChange={setCurrentPage}
//             onItemsPerPageChange={(items) => {
//               setItemsPerPage(items);
//               setCurrentPage(1);
//             }}
//           />
//         </div>
//       )}
//     </PageLayout>
//   );
// }

// Helper function to extend vendor data while preserving our organized data
// const generateExtendedVendors = (vendors: Vendor[]) => {
//   if (process.env.NODE_ENV !== "production")
//     console.log(
//       "🔄 generateExtendedVendors called with:",
//       vendors?.length,
//       "vendors",
//       vendors
//     );
//   const result = vendors.map((vendor) => ({
//     ...vendor,
//     storeName: vendor.name,
//     // Keep existing data and only add missing fields
//     totalSales: vendor.totalSales || Math.floor(Math.random() * 5000) + 500,
//     totalProducts: vendor.totalProducts || vendor.productCount || 0,
//     // Keep vendor specialties if they exist, otherwise use fallback
//     specialties:
//       vendor.specialties && vendor.specialties.length > 0
//         ? vendor.specialties
//         : ["General Merchandise"],
//     // Convert location object to string if needed
//     location:
//       typeof vendor.location === "string"
//         ? vendor.location
//         : vendor.location?.city
//         ? `${vendor.location.city}, ${vendor.location.state || ""} ${
//             vendor.location.country || ""
//           }`.trim()
//         : "Location not specified",
//     // Add computed fields that don't exist in mock data
//     badges: vendor.verified
//       ? ["Verified Vendor", ...(vendor.featured ? ["Featured"] : [])]
//       : [],
//     stats: {
//       positiveReviews: Math.floor((vendor.rating || 4.0) * 20),
//       shipOnTime: 85 + Math.floor((vendor.rating || 4.0) * 3),
//       responseRate: 90 + Math.floor((vendor.rating || 4.0) * 2),
//       repeatCustomers: 40 + Math.floor((vendor.rating || 4.0) * 10),
//     },
//     joinedDate: vendor.joinedDate
//       ? vendor.joinedDate
//       : new Date().toISOString(),
//     followers:
//       Math.floor((vendor.totalSales || 1000) / 5) +
//       Math.floor((vendor.rating || 4.0) * 200),
//   }));
//   if (process.env.NODE_ENV !== "production")
//     console.log(
//       "✅ generateExtendedVendors result:",
//       result?.length,
//       "extended vendors",
//       result
//     );
//   return result;
// };
