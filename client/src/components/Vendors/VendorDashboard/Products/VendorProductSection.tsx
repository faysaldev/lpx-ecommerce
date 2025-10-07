/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { ProductTable } from "./ProductTable";
import { useRouter } from "next/navigation";
import { mockVendorProducts } from "@/lib/mockdata";
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
import { SORT_OPTIONS, type SortOption } from "@/lib/browse-utils";
import { TabsContent } from "@/components/UI/tabs";
import Link from "next/link";

type ProductStatus = "all" | "active" | "draft" | "sold" | "out_of_stock";

function VendorProductSection({}: any) {
  const router = useRouter();
  const [products, setProducts] = useState(mockVendorProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  const handleEdit = (productId: string) => {
    router.push(`/vendor/products/${productId}/edit`);
  };

  const handleView = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleDuplicate = (productId: string) => {
    const product = products.find((p: any) => p.id === productId);
    if (product) {
      const duplicated = {
        ...product,
        id: `${productId}-copy-${Date.now()}`,
        name: `${product.name} (Copy)`,
        status: "draft" as const,
        views: 0,
        wishlistCount: 0,
        dateCreated: new Date().toISOString().split("T")[0],
        lastUpdated: new Date().toISOString().split("T")[0],
      };
      setProducts([duplicated, ...products]);
      toast.success("Product duplicated successfully");
    }
  };

  const handleDelete = (productId: string) => {
    setProducts(products.filter((p: any) => p.id !== productId));
    toast.success("Product deleted successfully");
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
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-10"
              />
            </div>

            {/* Sort and Status Filter */}
            <div className="flex items-center gap-3">
              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="min-w-[120px] justify-start"
                  >
                    {statusFilter === "all"
                      ? "All Products"
                      : statusFilter === "out_of_stock"
                      ? "Out of Stock"
                      : statusFilter.charAt(0).toUpperCase() +
                        statusFilter.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    All Products
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                    Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("sold")}>
                    Sold
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("out_of_stock")}
                  >
                    Out of Stock
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="min-w-[140px] justify-start"
                  >
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    {SORT_OPTIONS.find((o) => o.value === sortOption)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {SORT_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSortOption(option.value as SortOption)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || statusFilter !== "all") && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchQuery}
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="hover:text-red-500 transition-colors ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status:{" "}
                  {statusFilter === "out_of_stock"
                    ? "Out of Stock"
                    : statusFilter}
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className="hover:text-red-500 transition-colors ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
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
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default VendorProductSection;
