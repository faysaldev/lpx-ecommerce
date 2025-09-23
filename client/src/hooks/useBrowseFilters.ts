import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import {
  type BrowseFilters,
  defaultFilters,
  filterProducts,
  getActiveFilterCount,
  type SortOption,
  sortProducts,
  type ViewMode,
} from "@/lib/browse-utils";

interface UseBrowseFiltersReturn {
  filters: BrowseFilters;
  sortOption: SortOption;
  viewMode: ViewMode;
  filteredProducts: Product[];
  activeFilterCount: number;
  isFiltering: boolean;

  // Filter actions
  updateFilter: <K extends keyof BrowseFilters>(
    key: K,
    value: BrowseFilters[K]
  ) => void;
  clearFilters: () => void;
  clearFilter: (key: keyof BrowseFilters) => void;

  // Sort and view actions
  setSortOption: (option: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;

  // Utility actions
  saveFilterPreset: (name: string) => void;
  loadFilterPreset: (name: string) => void;
  getFilterPresets: () => { name: string; filters: BrowseFilters }[];
}

export function useBrowseFilters(products: Product[]): UseBrowseFiltersReturn {
  const _router = useRouter();
  const searchParams: ReadonlyURLSearchParams | null = useSearchParams();

  // Initialize filters from URL params
  const [filters, setFilters] = useState<BrowseFilters>(() => {
    const initial = { ...defaultFilters };

    // Parse URL params
    const search = searchParams?.get("q");
    if (search) initial.search = search;

    // Handle both 'categories' (multiple) and 'category' (single) params
    const categories = searchParams?.get("categories");
    const category = searchParams?.get("category");
    if (categories) {
      initial.categories = categories.split(",");
    } else if (category) {
      initial.categories = [category];
    }

    const conditions = searchParams?.get("conditions");
    if (conditions) initial.conditions = conditions.split(",");

    const minPrice = searchParams?.get("min_price");
    const maxPrice = searchParams?.get("max_price");
    if (minPrice) initial.priceRange.min = Number(minPrice);
    if (maxPrice) initial.priceRange.max = Number(maxPrice);

    const vendors = searchParams?.get("vendors");
    if (vendors) initial.vendors = vendors.split(",");

    const inStock = searchParams?.get("in_stock");
    if (inStock === "true") initial.inStock = true;

    const tags = searchParams?.get("tags");
    if (tags) initial.tags = tags.split(",");

    return initial;
  });

  const [sortOption, setSortOption] = useState<SortOption>(() => {
    const sort = searchParams?.get("sort") as SortOption;
    return sort || "newest";
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const view = searchParams?.get("view") as ViewMode;
    return view || "grid";
  });

  const [isFiltering, setIsFiltering] = useState(false);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set("q", filters.search);
    if (filters.categories.length === 1) {
      params.set("category", filters.categories[0]);
    } else if (filters.categories.length > 1) {
      params.set("categories", filters.categories.join(","));
    }
    if (filters.conditions.length > 0)
      params.set("conditions", filters.conditions.join(","));
    if (filters.priceRange.min > 0)
      params.set("min_price", filters.priceRange.min.toString());
    if (filters.priceRange.max < 10000)
      params.set("max_price", filters.priceRange.max.toString());
    if (filters.vendors.length > 0)
      params.set("vendors", filters.vendors.join(","));
    if (filters.inStock) params.set("in_stock", "true");
    if (filters.tags.length > 0) params.set("tags", filters.tags.join(","));
    if (sortOption !== "newest") params.set("sort", sortOption);
    if (viewMode !== "grid") params.set("view", viewMode);

    const queryString = params.toString();
    const url = queryString ? `/browse?${queryString}` : "/browse";

    // Update URL without navigation
    window.history.replaceState({}, "", url);
  }, [filters, sortOption, viewMode]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    setIsFiltering(true);
    const filtered = filterProducts(products, filters);
    const sorted = sortProducts(filtered, sortOption);
    setIsFiltering(false);
    return sorted;
  }, [products, filters, sortOption]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    return getActiveFilterCount(filters);
  }, [filters]);

  // Update a specific filter
  const updateFilter = useCallback(
    <K extends keyof BrowseFilters>(key: K, value: BrowseFilters[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Clear a specific filter
  const clearFilter = useCallback((key: keyof BrowseFilters) => {
    setFilters((prev) => ({
      ...prev,
      [key]: defaultFilters[key],
    }));
  }, []);

  // Save filter preset to localStorage
  const saveFilterPreset = useCallback(
    (name: string) => {
      const presets = JSON.parse(
        localStorage.getItem("browseFilterPresets") || "{}"
      );
      presets[name] = filters;
      localStorage.setItem("browseFilterPresets", JSON.stringify(presets));
    },
    [filters]
  );

  // Load filter preset from localStorage
  const loadFilterPreset = useCallback((name: string) => {
    const presets = JSON.parse(
      localStorage.getItem("browseFilterPresets") || "{}"
    );
    if (presets[name]) {
      setFilters(presets[name]);
    }
  }, []);

  // Get all filter presets
  const getFilterPresets = useCallback(() => {
    const presets = JSON.parse(
      localStorage.getItem("browseFilterPresets") || "{}"
    );
    return Object.entries(presets).map(([name, filters]) => ({
      name,
      filters: filters as BrowseFilters,
    }));
  }, []);

  return {
    filters,
    sortOption,
    viewMode,
    filteredProducts,
    activeFilterCount,
    isFiltering,
    updateFilter,
    clearFilters,
    clearFilter,
    setSortOption,
    setViewMode,
    saveFilterPreset,
    loadFilterPreset,
    getFilterPresets,
  };
}
