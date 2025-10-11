"use client";

import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Grid3x3,
  LayoutList,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/UI/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/UI/popover";
import { productStyles } from "@/components/UI/product.variants";
import {
  type SortOption,
  type ViewMode,
} from "@/lib/browse-utils";
import { cn } from "@/lib/utils";

interface FilterPill {
  type: string;
  value: string;
  label: string;
}

interface VendorStyleFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  activeFilterCount: number;
  activeFilters?: FilterPill[];
  onRemoveFilter?: (type: string, value: string) => void;
  onClearAllFilters?: () => void;
  className?: string;
  // Filter-related props for desktop
  showDesktopFilters?: boolean;
  filterContent?: React.ReactNode;
  advancedFilterContent?: React.ReactNode;
  onOpenFilters?: () => void;
  isVendorPage?:boolean;
}

export function VendorStyleFilterBar({
  search,
  onSearchChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  activeFilterCount,
  activeFilters = [],
  onRemoveFilter,
  onClearAllFilters,
  className,
  showDesktopFilters = false,
  filterContent,
  advancedFilterContent,
}: // onOpenFilters,
VendorStyleFilterBarProps) {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const SORT_OPTIONS = [
  { value: "newest", label: "Newest First", icon: "clock" },
  { value: "lowToHigh", label: "Price: Low to High", icon: "arrow-up" },
  { value: "highToLow", label: "Price: High to Low", icon: "arrow-down" },
  { value: "byRatings", label: "Rating: By Ratings", icon: "arrow-down" },
  {
    value: "productsCount",
    label: "Product: Products Count",
    icon: "arrow-down",
  },
];

  const sortOptions = SORT_OPTIONS;

  return (
    <div className={cn("mb-6", className)}>
      {/* Filter Toggle & Quick Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* View Mode */}
          <div className="flex items-center border border-input rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
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
              onClick={() => onViewModeChange("list")}
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
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Quick search..."
              className={cn(
                productStyles.forms.input.md,
                "pl-10 w-64 border border-input bg-background",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              )}
            />
          </div>

          {/* Active Filter Pills */}
          {!isFilterExpanded && activeFilters.length > 0 && (
            <div className="flex items-center gap-2">
              {activeFilters.map((filter) => (
                <span
                  key={`filter-${filter.type}-${filter.value}`}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                >
                  {filter.label}
                  {onRemoveFilter && (
                    <button
                      type="button"
                      onClick={() => onRemoveFilter(filter.type, filter.value)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}

          {/* Search Filter Pill */}
          {!isFilterExpanded && search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
              Search: {search}
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Filters Button */}
          {showDesktopFilters && filterContent ? (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    productStyles.forms.button.md,
                    "flex items-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                  )}
                >
                  <SlidersHorizontal className={productStyles.forms.icon.md} />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="h-5 px-1.5">
                      {activeFilterCount}
                    </Badge>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                {filterContent}
              </PopoverContent>
            </Popover>
          ) : (
            <button
              type="button"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className={cn(
                productStyles.forms.button.md,
                "flex items-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              )}
            >
              <SlidersHorizontal className={productStyles.forms.icon.md} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5">
                  {activeFilterCount}
                </Badge>
              )}
              {isFilterExpanded ? (
                <ChevronUp className={productStyles.forms.icon.md} />
              ) : (
                <ChevronDown className={productStyles.forms.icon.md} />
              )}
            </button>
          )}

          {/* Sort */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
              className={cn(
                productStyles.forms.select.md,
                "flex items-center justify-between gap-2 border border-input bg-background hover:bg-accent transition-colors"
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
                  {sortOptions.find((o) => o.value === sortOption)?.label}
                </span>
              </span>
            </button>
            {isSortOpen && (
              <div className="absolute top-full mt-1 right-0 z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                {sortOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value as SortOption);
                      setIsSortOpen(false);
                    }}
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                      sortOption === option.value &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Filter Content */}
      {isFilterExpanded && !showDesktopFilters && (
        <div className="border-t border-border animate-slide-up py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search products..."
                  className={cn(
                    productStyles.forms.input.md,
                    "pl-10 w-full border border-input bg-background",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  )}
                />
              </div>
            </div>

            {/* Additional filter content can be added here */}
            {filterContent && (
              <div className="col-span-full">{filterContent}</div>
            )}

            {/* Advanced filter content for rich filters like FilterSidebar */}
            {advancedFilterContent && (
              <div className="col-span-full">{advancedFilterContent}</div>
            )}
          </div>

          {/* Clear Filters */}
          {(activeFilterCount > 0 || search) && onClearAllFilters && (
            <div className="mt-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClearAllFilters}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
