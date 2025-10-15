"use client";

import {
  AlertTriangle,
  CheckCircle,
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Package,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import type { SortOption, ViewMode } from "@/lib/browse-utils";
import { VendorStyleFilterBar } from "@/components/Browse/VendorStyleFilterBar";
import {
  useAdminProductsStatsQuery,
  useSearchAdminProductsQuery,
  // useDeleteProductMutation,
} from "@/redux/features/admin/AdminProducts";
import { selectCategories } from "@/redux/features/Common/CommonSlice";
import { useSelector } from "react-redux";
import { useAppSelector } from "@/redux/hooks";

// Updated types based on API response
export interface AdminProduct {
  _id: string;
  productName: string;
  category: string;
  vendor: {
    _id: string;
    storeName: string;
  };
  price: number;
  stockQuantity: number;
  condition: string;
  sales: number;
  status?: "active" | "pending" | "flagged" | "inactive";
  listed?: string;
  flagReason?: string;
}

interface ProductsStats {
  totalProducts: number;
  activeProducts: number;
  pendingReview: number;
  flaggedProducts: number;
  canceledProducts: number;
}

interface StatusVariant {
  variant: "default" | "secondary" | "destructive" | "outline";
  icon: React.ElementType;
}

export default function ProductsManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [stats, setStats] = useState<ProductsStats>({
    totalProducts: 0,
    activeProducts: 0,
    pendingReview: 0,
    flaggedProducts: 0,
    canceledProducts: 0,
  });

  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching: productsFetching,
    error: productsError,
    refetch: refetchProducts,
  } = useSearchAdminProductsQuery({ query: searchQuery });

  const {
    data: productsStats,
    isLoading: productsStatsLoading,
    isFetching: productsStatsFetching,
    error: productsStatsError,
  } = useAdminProductsStatsQuery({});

  // const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

   const categoriesData = useAppSelector(selectCategories);
   console.log("categoriesData", categoriesData);

  useEffect(() => {
    if (productsData?.data?.attributes) {
      setProducts(productsData.data.attributes);
    }
  }, [productsData]);

  useEffect(() => {
    if (productsStats?.data?.attributes) {
      setStats(productsStats.data.attributes);
    }
  }, [productsStats]);

  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      try {
        // await deleteProduct(productId).unwrap();
        // Refresh the products list
        refetchProducts();
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  // Handle view product details
  const handleViewProduct = (productId: string) => {
    router.push(`/admin/products/${productId}`);
  };

  // Handle edit product
  const handleEditProduct = (productId: string) => {
    router.push(`/admin/products/${productId}/edit`);
  };

  // Filter products based on search query (client-side as backup)
  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.productName.toLowerCase().includes(query) ||
      product.vendor.storeName.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  // Sort products based on sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        // Assuming newer products have higher IDs or you might have a createdAt field
        return b._id.localeCompare(a._id);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.productName.localeCompare(b.productName);
      case "name-desc":
        return b.productName.localeCompare(a.productName);
      default:
        return 0;
    }
  });

  const getStatusBadge = (product: AdminProduct) => {
    // Determine status based on available data
    let status: "active" | "pending" | "flagged" | "inactive" = "active";
    if (product.stockQuantity === 0) status = "inactive";
    // You can add more logic here based on your business rules

    const variants: Record<string, StatusVariant> = {
      active: { variant: "default", icon: CheckCircle },
      pending: { variant: "secondary", icon: AlertTriangle },
      flagged: { variant: "destructive", icon: XCircle },
      inactive: { variant: "outline", icon: XCircle },
    };
    const config = variants[status] || variants.active;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  if (productsLoading || productsStatsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (productsError || productsStatsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Error loading products</h2>
          <p>Please try again later</p>
          <Button
            onClick={() => refetchProducts()}
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Product Management
          </h1>
          <p className="text-muted-foreground">
            Review and manage marketplace listings
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.activeProducts}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingReview}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Flagged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.flaggedProducts}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>All Products</CardTitle>
          </div>
          <VendorStyleFilterBar
            search={searchQuery}
            onSearchChange={setSearchQuery}
            sortOption={sortOption}
            onSortChange={setSortOption}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            activeFilterCount={searchQuery ? 1 : 0}
            activeFilters={
              searchQuery
                ? [
                    {
                      type: "search",
                      value: searchQuery,
                      label: `Search: ${searchQuery}`,
                    },
                  ]
                : []
            }
            onRemoveFilter={(type) => {
              if (type === "search") setSearchQuery("");
            }}
            onClearAllFilters={() => setSearchQuery("")}
            className="w-full"
          />
        </CardHeader>
        <CardContent>
          {productsFetching && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No products found</p>
                      <p className="text-sm">
                        {searchQuery
                          ? "Try adjusting your search query"
                          : "No products available yet"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedProducts?.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">
                      {product.productName}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.vendor.storeName}</TableCell>
                    <TableCell>AED {product.price.toLocaleString()}</TableCell>
                    <TableCell>
                      {product.stockQuantity.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(product)}</TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {product.condition}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            // disabled={isDeleting}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleViewProduct(product._id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditProduct(product._id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteProduct(product._id)}
                            // disabled={isDeleting}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {/* {isDeleting ? "Deleting..." : "Delete Product"} */}
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
