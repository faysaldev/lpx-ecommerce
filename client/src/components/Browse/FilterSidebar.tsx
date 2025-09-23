"use client";

import {
  DollarSign,
  Filter,
  Package,
  Save,
  Star,
  Store,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import type { Category, Product } from "@/lib/api/types";
import {
  type BrowseFilters,
  CONDITIONS,
  getActiveFilterCount,
  getPriceHistogram,
  getUniqueVendors,
} from "@/lib/browse-utils";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  filters: BrowseFilters;
  onUpdateFilter: <K extends keyof BrowseFilters>(
    key: K,
    value: BrowseFilters[K],
  ) => void;
  onClearFilters: () => void;
  categories: Category[];
  products: Product[];
  className?: string;
}

const MAX_VENDORS_TO_SHOW = 10;

export function FilterSidebar({
  filters,
  onUpdateFilter,
  onClearFilters,
  categories,
  products,
  className,
}: FilterSidebarProps) {
  const [priceInputs, setPriceInputs] = useState({
    min: filters.priceRange.min.toString(),
    max: filters.priceRange.max.toString(),
  });
  const [priceHistogram, setPriceHistogram] = useState<
    { range: string; count: number }[]
  >([]);

  const vendors = getUniqueVendors(products);

  // Calculate histogram only on client side to avoid hydration mismatch
  useEffect(() => {
    setPriceHistogram(getPriceHistogram(products));
  }, [products]);

  const activeFilterCount = getActiveFilterCount(filters);

  const handlePriceChange = (type: "min" | "max", value: string) => {
    setPriceInputs((prev) => ({ ...prev, [type]: value }));

    const numValue = Number(value) || 0;
    onUpdateFilter("priceRange", {
      ...filters.priceRange,
      [type]: numValue,
    });
  };

  const handleCategoryToggle = (categorySlug: string) => {
    const newCategories = filters.categories.includes(categorySlug)
      ? filters.categories.filter((c) => c !== categorySlug)
      : [...filters.categories, categorySlug];
    onUpdateFilter("categories", newCategories);
  };

  const handleConditionToggle = (condition: string) => {
    const newConditions = filters.conditions.includes(condition)
      ? filters.conditions.filter((c) => c !== condition)
      : [...filters.conditions, condition];
    onUpdateFilter("conditions", newConditions);
  };

  const handleVendorToggle = (vendorId: string) => {
    const newVendors = filters.vendors.includes(vendorId)
      ? filters.vendors.filter((v) => v !== vendorId)
      : [...filters.vendors, vendorId];
    onUpdateFilter("vendors", newVendors);
  };

  return (
    <div className={cn("h-full flex-col hidden md:flex", className)}>
      {/* Header */}
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

      {/* Filters */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <Accordion type="multiple" defaultValue={[]} className="w-full">
            {/* Categories */}
            <AccordionItem value="categories">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>Categories</span>
                  {filters.categories.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {filters.categories.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={category.slug}
                        checked={filters.categories.includes(category.slug)}
                        onCheckedChange={() =>
                          handleCategoryToggle(category.slug)
                        }
                      />
                      <Label
                        htmlFor={category.slug}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {category.name}
                        <span className="text-muted-foreground ml-2">
                          ({category.productCount})
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Price Range */}
            <AccordionItem value="price">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Price Range</span>
                  {(filters.priceRange.min > 0 ||
                    filters.priceRange.max < 10000) && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      ${filters.priceRange.min}-${filters.priceRange.max}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label htmlFor="min-price" className="text-xs">
                        Min
                      </Label>
                      <Input
                        id="min-price"
                        type="number"
                        value={priceInputs.min}
                        onChange={(e) =>
                          handlePriceChange("min", e.target.value)
                        }
                        className="h-8"
                      />
                    </div>
                    <span className="text-muted-foreground mt-5">-</span>
                    <div className="flex-1">
                      <Label htmlFor="max-price" className="text-xs">
                        Max
                      </Label>
                      <Input
                        id="max-price"
                        type="number"
                        value={priceInputs.max}
                        onChange={(e) =>
                          handlePriceChange("max", e.target.value)
                        }
                        className="h-8"
                      />
                    </div>
                  </div>

                  {/* Price Histogram */}
                  {priceHistogram.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Price distribution
                      </p>
                      <ResponsiveContainer width="100%" height={100}>
                        <BarChart data={priceHistogram}>
                          <XAxis dataKey="range" />
                          <YAxis />
                          <RechartsTooltip />
                          <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Condition */}
            <AccordionItem value="condition">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>Condition</span>
                  {filters.conditions.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                      {filters.conditions.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {CONDITIONS.map((condition) => (
                    <div
                      key={condition.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={condition.value}
                        checked={filters.conditions.includes(condition.value)}
                        onCheckedChange={() =>
                          handleConditionToggle(condition.value)
                        }
                      />
                      <Label
                        htmlFor={condition.value}
                        className="text-sm font-normal cursor-pointer flex-1 flex items-center gap-2"
                      >
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            condition.color,
                          )}
                        />
                        {condition.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Vendors */}
            {vendors.length > 0 && (
              <AccordionItem value="vendors">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    <span>Vendors</span>
                    {filters.vendors.length > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                        {filters.vendors.length}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {vendors.slice(0, MAX_VENDORS_TO_SHOW).map((vendor) => (
                      <div
                        key={vendor.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={vendor.id}
                          checked={filters.vendors.includes(vendor.id)}
                          onCheckedChange={() => handleVendorToggle(vendor.id)}
                        />
                        <Label
                          htmlFor={vendor.id}
                          className="text-sm font-normal cursor-pointer flex-1"
                        >
                          {vendor.name}
                          <span className="text-muted-foreground ml-2">
                            ({vendor.count})
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>

          {/* Additional Filters */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="in-stock"
                  className="text-sm font-normal cursor-pointer flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  In Stock Only
                </Label>
                <Switch
                  id="in-stock"
                  checked={filters.inStock}
                  onCheckedChange={(checked) =>
                    onUpdateFilter("inStock", checked)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            // TODO: Implement save preset functionality
            if (process.env.NODE_ENV !== "production")
              console.log("Save filter preset");
          }}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Filter Preset
        </Button>
      </div>
    </div>
  );
}

// Mobile filter sheet
export function MobileFilterSheet({
  filters,
  onUpdateFilter,
  onClearFilters,
  categories,
  products,
  children,
}: Omit<FilterSidebarProps, "className"> & {
  children: React.ReactNode;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <FilterSidebar
          filters={filters}
          onUpdateFilter={onUpdateFilter}
          onClearFilters={onClearFilters}
          categories={categories}
          products={products}
        />
      </SheetContent>
    </Sheet>
  );
}
