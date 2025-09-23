"use client";

import { Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { type BrowseFilters, formatFilterLabel } from "@/lib/browse-utils";
import { cn } from "@/lib/utils";

interface FilterBadgesProps {
  filters: BrowseFilters;
  onRemoveFilter: (type: string, value: string) => void;
  onClearAll: () => void;
  className?: string;
}

export function FilterBadges({
  filters,
  onRemoveFilter,
  onClearAll,
  className,
}: FilterBadgesProps) {
  const activeBadges: { type: string; value: string; label: string }[] = [];

  // Collect all active filters
  if (filters.search) {
    activeBadges.push({
      type: "search",
      value: filters.search,
      label: `Search: "${filters.search}"`,
    });
  }

  filters.categories.forEach((category) => {
    activeBadges.push({
      type: "category",
      value: category,
      label: formatFilterLabel("category", category),
    });
  });

  filters.conditions.forEach((condition) => {
    activeBadges.push({
      type: "condition",
      value: condition,
      label: formatFilterLabel("condition", condition),
    });
  });

  if (filters.priceRange.min > 0 || filters.priceRange.max < 10000) {
    activeBadges.push({
      type: "price",
      value: "range",
      label: `$${filters.priceRange.min} - $${filters.priceRange.max}`,
    });
  }

  filters.vendors.forEach((vendor) => {
    activeBadges.push({
      type: "vendor",
      value: vendor,
      label: `Vendor: ${vendor}`,
    });
  });

  if (filters.inStock) {
    activeBadges.push({
      type: "inStock",
      value: "true",
      label: "In Stock",
    });
  }

  filters.tags.forEach((tag) => {
    activeBadges.push({
      type: "tag",
      value: tag,
      label: `Tag: ${tag}`,
    });
  });

  if (activeBadges.length === 0) return null;

  return (
    <div className={cn("bg-muted/30 rounded-lg border p-4", className)}>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="text-sm text-muted-foreground flex-shrink-0">
          Active filters:
        </span>

        <ScrollArea className="flex-1">
          <div className="flex items-center gap-2">
            {activeBadges.map((badge, index) => (
              <Badge
                key={`${badge.type}-${badge.value}-${index}`}
                variant="secondary"
                className="group hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
                onClick={() => onRemoveFilter(badge.type, badge.value)}
              >
                {badge.label}
                <X className="ml-1 h-3 w-3 opacity-50 group-hover:opacity-100" />
              </Badge>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="flex-shrink-0 text-destructive hover:text-destructive"
        >
          Clear all
        </Button>
      </div>
    </div>
  );
}
