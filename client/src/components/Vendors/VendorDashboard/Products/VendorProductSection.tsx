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
import { useRemoveSingleProductsMutation } from "@/redux/features/products/product";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/UI/pagination"; // Adjust import path as needed

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

  console.log(data?.data, "products data");

  const products = data?.data?.attributes?.products || [];
  const totalPages = data?.data?.attributes?.totalPages || 1;
  const currentPage = page;

  const [removeProduct] = useRemoveSingleProductsMutation();

  // Event Handlers
  const handleEdit = (productId: string) =>
    router.push(`/vendor/products/${productId}/edite`);
  const handleView = (productId: string) =>
    router.push(`/product/${productId}`);
  const handleDelete = async (productId: string) => {
    await removeProduct(productId);
    toast.success("Product deleted successfully");
  };

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setSortBy("");
    setPage(1);
  };

  // Generate page numbers with ellipsis
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're at the beginning
      if (currentPage <= 2) {
        end = 4;
      }

      // Adjust if we're at the end
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("ellipsis-end");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const pageNumbers = generatePageNumbers();

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
              {/* Active Filters */}
              {(search || status !== "all") && (
                <div className="flex items-center gap-2 flex-wrap">
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

              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="min-w-[120px] justify-start"
                  >
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
                  {["all", "active", "draft", "sold", "out_of_stock"].map(
                    (s) => (
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
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="min-w-[140px] justify-start"
                  >
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

          {/* Product Table */}
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {/* Page Numbers */}
                {pageNumbers.map((pageNum, index) => (
                  <PaginationItem key={index}>
                    {pageNum === "ellipsis-start" ||
                    pageNum === "ellipsis-end" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={currentPage === pageNum}
                        onClick={() => handlePageChange(pageNum as number)}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                {/* Next Button */}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default VendorProductSection;

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import React, { useState } from "react";
// import { ProductTable } from "./ProductTable";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/UI/card";
// import { Input } from "@/components/UI/input";
// import { ArrowUpDown, Plus, Search, X } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/UI/dropdown-menu";
// import { Button } from "@/components/UI/button";
// import { Badge } from "@/components/UI/badge";
// import { TabsContent } from "@/components/UI/tabs";
// import Link from "next/link";
// import { useSearchVendorDashboardProductsQuery } from "@/redux/features/vendors/VendorDashboard";
// import { useRemoveSingleProductsMutation } from "@/redux/features/products/product";

// // ✅ Types
// type ProductStatus = "all" | "active" | "draft" | "out_of_stock" | "sold";
// type SortOption = {
//   label: string;
//   value: string;
// };

// const SORT_OPTIONS: SortOption[] = [
//   { label: "Newest First", value: "newestFirst" },
//   { label: "Price: High to Low", value: "highToLow" },
//   { label: "Price: Low to High", value: "lowToHigh" },
// ];

// const VendorProductSection = () => {
//   const router = useRouter();

//   // Filters
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState<ProductStatus>("all");
//   const [sortBy, setSortBy] = useState<string>("");

//   // Pagination
//   const [page, setPage] = useState<number>(1);
//   const [limit, setLimit] = useState<number>(5);

//   // API Call
//   const { data } = useSearchVendorDashboardProductsQuery({
//     search,
//     status,
//     sortBy,
//     page,
//     limit,
//   });

//   console.log(data?.data, "products data");

//   const products = data?.data?.attributes?.products;

//   const [removeProduct] = useRemoveSingleProductsMutation();

//   // Event Handlers
//   const handleEdit = (productId: string) =>
//     router.push(`/vendor/products/${productId}/edite`);
//   const handleView = (productId: string) =>
//     router.push(`/product/${productId}`);
//   const handleDelete = async (productId: string) => {
//     await removeProduct(productId);
//     toast.success("Product deleted successfully");
//   };

//   // Clear filters
//   const clearFilters = () => {
//     setSearch("");
//     setStatus("all");
//     setSortBy("");
//     setPage(1);
//   };

//   return (
//     <TabsContent value="products" className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <div>
//               <CardTitle>Product Management</CardTitle>
//               <CardDescription>Manage your inventory</CardDescription>
//             </div>
//             <Button asChild>
//               <Link href="/vendor/products/new">
//                 <Plus className="mr-2 h-4 w-4" />
//                 Add Product
//               </Link>
//             </Button>
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           {/* Search + Filter */}
//           <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//             {/* Search */}
//             <div className="relative flex-1 max-w-sm">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 type="text"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//                 placeholder="Search products..."
//                 className="pl-10"
//               />
//             </div>

//             {/* Status + Sort */}
//             <div className="flex items-center gap-3">
//               {/* Status Filter */}
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="min-w-[120px] justify-start"
//                   >
//                     {status === "all"
//                       ? "All Products"
//                       : status === "out_of_stock"
//                       ? "Out of Stock"
//                       : status.charAt(0).toUpperCase() + status.slice(1)}
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   {["all", "active", "draft", "sold", "out_of_stock"].map(
//                     (s) => (
//                       <DropdownMenuItem
//                         key={s}
//                         onClick={() => {
//                           setStatus(s as ProductStatus);
//                           setPage(1);
//                         }}
//                       >
//                         {s === "out_of_stock"
//                           ? "Out of Stock"
//                           : s === "all"
//                           ? "All Products"
//                           : s.charAt(0).toUpperCase() + s.slice(1)}
//                       </DropdownMenuItem>
//                     )
//                   )}
//                 </DropdownMenuContent>
//               </DropdownMenu>

//               {/* Sort Filter */}
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="min-w-[140px] justify-start"
//                   >
//                     <ArrowUpDown className="mr-2 h-4 w-4" />
//                     {SORT_OPTIONS.find((o) => o.value === sortBy)?.label ||
//                       "Sort Options"}
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuLabel>Sort by</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   {SORT_OPTIONS.map((option) => (
//                     <DropdownMenuItem
//                       key={option.value}
//                       onClick={() => {
//                         setSortBy(option.value);
//                         setPage(1);
//                       }}
//                     >
//                       {option.label}
//                     </DropdownMenuItem>
//                   ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>

//           {/* Active Filters */}
//           {(search || status !== "all") && (
//             <div className="flex items-center gap-2 flex-wrap">
//               <span className="text-sm text-muted-foreground">Filters:</span>

//               {search && (
//                 <Badge variant="secondary" className="flex items-center gap-1">
//                   Search: {search}
//                   <button
//                     type="button"
//                     onClick={() => setSearch("")}
//                     className="hover:text-red-500 transition-colors ml-1"
//                   >
//                     <X className="h-3 w-3" />
//                   </button>
//                 </Badge>
//               )}

//               {status !== "all" && (
//                 <Badge variant="secondary" className="flex items-center gap-1">
//                   Status:{" "}
//                   {status === "out_of_stock"
//                     ? "Out of Stock"
//                     : status.charAt(0).toUpperCase() + status.slice(1)}
//                   <button
//                     type="button"
//                     onClick={() => setStatus("all")}
//                     className="hover:text-red-500 transition-colors ml-1"
//                   >
//                     <X className="h-3 w-3" />
//                   </button>
//                 </Badge>
//               )}

//               <Button
//                 size="sm"
//                 variant="ghost"
//                 onClick={clearFilters}
//                 className="text-muted-foreground"
//               >
//                 Clear All
//               </Button>
//             </div>
//           )}

//           {/* Product Table */}
//           <ProductTable
//             products={products}
//             onEdit={handleEdit}
//             onView={handleView}
//             onDelete={handleDelete}
//           />

//           {/* Pagination */}
//         </CardContent>
//       </Card>
//     </TabsContent>
//   );
// };

// export default VendorProductSection;
