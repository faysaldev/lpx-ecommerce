/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  AlertTriangle,
  CheckCircle,
  Edit,
  Eye,
  MoreHorizontal,
  Package,
  Trash2,
  XCircle,
  Search,
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
import { Input } from "@/components/UI/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import {
  useAdminProductsStatsQuery,
  useSearchAdminProductsQuery,
} from "@/redux/features/admin/AdminProducts";
import { selectCategories } from "@/redux/features/Common/CommonSlice";
import { useAppSelector } from "@/redux/hooks";

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
  const categoriesData = useAppSelector(selectCategories);

  // --- Filters ---
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  // ✅ Toggle filter section visibility
  const [showFilters, setShowFilters] = useState(false);

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
  } = useSearchAdminProductsQuery({
    query: searchQuery,
    category,
    minPrice,
    maxPrice,
    condition,
    sortBy: sortOption,
    page: 1,
    limit: 20,
  });

  const {
    data: productsStats,
    isLoading: productsStatsLoading,
    error: productsStatsError,
  } = useAdminProductsStatsQuery({});

  // Sync data
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

  // Auto-refetch on filter change
  useEffect(() => {
    const timeout = setTimeout(() => {
      refetchProducts();
    }, 400); // debounce for smoother typing
    return () => clearTimeout(timeout);
  }, [searchQuery, category, condition, minPrice, maxPrice, sortOption]);

  // Handlers
  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        refetchProducts();
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const handleViewProduct = (id: string) => router.push(`/product/${id}`);
  const handleEditProduct = (id: string) =>
    router.push(`/vendor/products/${id}/edite`);

  const getStatusBadge = (product: AdminProduct) => {
    let status: "active" | "pending" | "flagged" | "inactive" = "active";
    if (product.stockQuantity === 0) status = "inactive";

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
        <p>Loading products...</p>
      </div>
    );
  }

  if (productsError || productsStatsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error loading products</p>
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
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent>
            <div className="text-xl font-semibold py-10 flex justify-center items-center">
              Total: {stats.totalProducts}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-xl font-semibold text-green-600 py-10 flex justify-center items-center">
              Active: {stats.activeProducts}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-xl font-semibold text-yellow-600 py-10 flex justify-center items-center">
              Pending: {stats.pendingReview}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-xl font-semibold text-red-600 py-10 flex justify-center items-center">
              Flagged: {stats.flaggedProducts}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Products Table */}
      <Card>
        <div className="bg-[#3c485f6c]">
          <CardHeader>
            <CardTitle>All Products</CardTitle>
            <div className="flex justify-between items-center">
              <div>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, vendor, or category"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-[310px]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-5">
                {/* ✅ Toggle Filter Section */}
                <Button onClick={() => setShowFilters(!showFilters)}>
                  {showFilters ? "Hide Filters" : "Filtering"}
                </Button>

                {/* Sort */}
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">
                      Price (Low → High)
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price (High → Low)
                    </SelectItem>
                    <SelectItem value="name-asc">Name (A–Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z–A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          {/* ✅ Filter Section (Hidden by Default) */}
          {showFilters && (
            <CardContent className="grid md:grid-cols-5 gap-4">
              {/* Category */}
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesData?.map((cat: any) => (
                    <SelectItem key={cat._id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Condition */}
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mint">Mint</SelectItem>
                  <SelectItem value="Near Mint">Near Mint</SelectItem>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                  <SelectItem value="CGC Graded">CGC Graded</SelectItem>
                  <SelectItem value="PSA Graded">PSA Graded</SelectItem>
                  <SelectItem value="BGS Graded">BGS Graded</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Range */}
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </CardContent>
          )}
        </div>

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
              {products?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No products found</p>
                  </TableCell>
                </TableRow>
              ) : (
                products?.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">
                      {product.productName}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.vendor.storeName}</TableCell>
                    <TableCell>AED {product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.stockQuantity}</TableCell>
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
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleViewProduct(product._id)}
                          >
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditProduct(product._id)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
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
