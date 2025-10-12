"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Filter,
  Grid3x3,
  LayoutList,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/UI/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { Input } from "@/components/UI/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/UI/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/UI/toggle-group";
import {
  SORT_OPTIONS,
  type SortOption,
  type ViewMode,
} from "@/lib/browse-utils";
import { cn } from "@/lib/utils";
import { Button } from "../UI/button";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  activeFilterCount: number;
  onOpenFilters?: () => void;
  className?: string;
  // Filter-related props for desktop
  showDesktopFilters?: boolean;
  filterContent?: React.ReactNode;
}

export function SearchBar({
  search,
  onSearchChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  activeFilterCount,
  onOpenFilters,
  className,
  showDesktopFilters = false,
  filterContent,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(search);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with external search prop
  useEffect(() => {
    setInputValue(search);
  }, [search]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== search) {
        onSearchChange(inputValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, search, onSearchChange]);

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInputValue("");
    onSearchChange("");
    inputRef.current?.focus();
  };

  const getSortIcon = (option: SortOption) => {
    if (option.includes("asc")) return <ArrowUp className="h-3 w-3" />;
    if (option.includes("desc")) return <ArrowDown className="h-3 w-3" />;
    return <ArrowUpDown className="h-3 w-3" />;
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search collectibles..."
          className="pl-9 pr-9 h-9"
        />
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Desktop Filter Button */}
      {showDesktopFilters && filterContent && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="default" className="hidden lg:flex">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            {filterContent}
          </PopoverContent>
        </Popover>
      )}

      {/* Mobile Filter Button */}
      {onOpenFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenFilters}
          className="lg:hidden"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      )}

      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="default">
            {getSortIcon(sortOption)}
            <span className="ml-2 hidden sm:inline">
              {SORT_OPTIONS.find((opt) => opt.value === sortOption)?.label ||
                "Sort"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value as SortOption)}
              className={cn(
                "flex items-center justify-between",
                sortOption === option.value && "bg-accent"
              )}
            >
              <span>{option.label}</span>
              {getSortIcon(option.value as SortOption)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Mode Toggle */}
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={(value) => value && onViewModeChange(value as ViewMode)}
        className="hidden md:flex"
      >
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <Grid3x3 className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List view">
          <LayoutList className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
