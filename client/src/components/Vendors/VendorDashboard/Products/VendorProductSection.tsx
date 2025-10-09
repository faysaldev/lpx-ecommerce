/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { ProductTable } from "./ProductTable";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { Input } from "@/components/UI/input";
import { ArrowUpDown, Plus, Search, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import { TabsContent } from "@/components/UI/tabs";
import Link from "next/link";
import { useSearchVendorDashboardProductsQuery } from "@/redux/features/vendors/VendorDashboard";
import { Pagination } from "antd";

// ✅ Types
type ProductStatus = "all" | "active" | "draft" | "out_of_stock" | "sold";
type SortOption = {
  label: string;
  value: string;
};

const SORT_OPTIONS: SortOption[] = [
  { label: "Newest First", value: "newestFirst" },
  { label: "Price: High to Low", value: "highToLow" },
  { label: "Price: Low to High", value: "lowToHigh" },
];

const VendorProductSection = () => {
  const router = useRouter();

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductStatus>("all");
  const [sortBy, setSortBy] = useState<string>("");

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);

  // API Call
  const { data } = useSearchVendorDashboardProductsQuery({
    search,
    status,
    sortBy,
    page,
    limit,
  });
  
  const products = data?.data?.attributes?.products;
  // console.log("data?.data?.attributes?.products",products)
  const total = data?.data?.total || 0;

  // Event Handlers
  const handleEdit = (productId: string) => router.push(`/vendor/products/${productId}/edit`);
  const handleView = (productId: string) => router.push(`/product/${productId}`);
  const handleDuplicate = () => toast.success("Product duplicated successfully");
  const handleDelete = () => toast.success("Product deleted successfully");

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setSortBy("");
    setPage(1);
  };

  return (
    <TabsContent value="products" className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Manage your inventory</CardDescription>
            </div>
            <Button asChild>
              <Link href="/vendor/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search products..."
                className="pl-10"
              />
            </div>

            {/* Status + Sort */}
            <div className="flex items-center gap-3">
              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[120px] justify-start">
                    {status === "all"
                      ? "All Products"
                      : status === "out_of_stock"
                      ? "Out of Stock"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {["all", "active", "draft", "sold", "out_of_stock"].map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => {
                        setStatus(s as ProductStatus);
                        setPage(1);
                      }}
                    >
                      {s === "out_of_stock"
                        ? "Out of Stock"
                        : s === "all"
                        ? "All Products"
                        : s.charAt(0).toUpperCase() + s.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[140px] justify-start">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    {SORT_OPTIONS.find((o) => o.value === sortBy)?.label ||
                      "Sort Options"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {SORT_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setPage(1);
                      }}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Active Filters */}
          {(search || status !== "all") && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Filters:</span>

              {search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {search}
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="hover:text-red-500 transition-colors ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {status !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status:{" "}
                  {status === "out_of_stock"
                    ? "Out of Stock"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                  <button
                    type="button"
                    onClick={() => setStatus("all")}
                    className="hover:text-red-500 transition-colors ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                Clear All
              </Button>
            </div>
          )}

          {/* Product Table */}
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onView={handleView}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          <div className="flex justify-end mt-6">
            <Pagination
              current={page}
              pageSize={limit}
              onChange={(p, size) => {
                setPage(p);
                setLimit(size || 5);
              }}
              className="bg-white rounded-2xl "
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default VendorProductSection;
