/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  MapPin,
  MoreHorizontal,
  Search,
  Star,
  Store,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Checkbox } from "@/components/UI/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { Input } from "@/components/UI/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/UI/tabs";
import { type AdminVendor } from "@/lib/types/admin-mock";
import {
  useSearchVendorMutation,
  useUpdateVendorStatusMutation,
} from "@/redux/features/admin/AdminVendor";
import VendorReviewDialog from "@/components/Admin/VendorReviewDialog";
import { getStatusBadge } from "@/components/Vendors/Admin/getStatus";
import { useRouter, useSearchParams } from "next/navigation";

export default function VendorsManagement() {
  const [vendors, setVendors] = useState<AdminVendor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<AdminVendor | null>(
    null
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fetchAgain, setFetchAgain] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(
    null
  );
  const [reviewNotes, setReviewNotes] = useState("");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "suspended"
  >("all");
  const [selectedVendors, setSelectedVendors] = useState<Set<string>>(
    new Set()
  );

  const [vendorStatus, setVendorStatus] = useState("");

  // Initialize from URL params
  useEffect(() => {
    const page = searchParams.get("page");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    if (page) setCurrentPage(parseInt(page));
    if (
      status &&
      ["all", "pending", "approved", "suspended"].includes(status)
    ) {
      setStatusFilter(status as typeof statusFilter);
    }
    if (search) setSearchQuery(search);
  }, [searchParams]);

  const stats = {
    totalVendors: totalCount, // Use totalCount from API instead of vendors.length
    activeVendors: vendors.filter((v) => v.status === "approved").length,
    pendingApproval: vendors.filter((v) => v.status === "pending").length,
    totalRevenue: vendors.reduce((sum, vendor) => sum + 300, 0),
  };

  // Update URL with current filters and pagination
  const updateURL = (page: number, status: string, search: string) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (status !== "all") params.set("status", status);
    if (search) params.set("search", search);

    const queryString = params.toString();
    const newUrl = queryString
      ? `/admin/vendors?${queryString}`
      : "/admin/vendors";
    router.push(newUrl, { scroll: false });
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateURL(newPage, statusFilter, searchQuery);
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as typeof statusFilter);
    setCurrentPage(1); // Reset to first page when filter changes
    updateURL(1, value, searchQuery);
  };

  // Handle search query change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when search changes
    updateURL(1, statusFilter, value);
  };

  // Filter vendors based on search query and status (client-side filtering for display only)
  const filteredVendors = vendors.filter((vendor) => {
    // Status filter
    if (statusFilter !== "all" && vendor.status !== statusFilter) {
      return false;
    }

    // Search filter
    if (!searchQuery) return true;
    return (
      vendor.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.seller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.storeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleVendorAction = async (
    vendor: AdminVendor,
    action: "approve" | "reject"
  ) => {
    setSelectedVendor(vendor);
    setReviewAction(action);

    setReviewNotes("");
    setIsReviewDialogOpen(true);
  };

  const handleReviewSubmit = async () => {
    if (!selectedVendor || !reviewAction) return;

    const updatedVendors = vendors.map((vendor) => {
      if (vendor._id === selectedVendor._id) {
        return {
          ...vendor,
          status:
            reviewAction === "approve"
              ? ("verified" as const)
              : ("suspended" as const),
        };
      }
      return vendor;
    });

    const data = {
      id: selectedVendor?._id,
      status: reviewAction === "approve" ? "approved" : "suspended",
      notes: reviewNotes,
      seller: selectedVendor?.seller,
    };
    const res = await updateVendor(data);
    setIsReviewDialogOpen(false);
    setSelectedVendor(null);
    setReviewAction(null);
    setReviewNotes("");
    setFetchAgain((e) => !e);

    const actionText = reviewAction === "approve" ? "approved" : "rejected";
    toast.success(`Vendor ${selectedVendor.storeName} has been ${actionText}`, {
      description:
        reviewNotes || `The vendor application has been ${actionText}.`,
    });
  };

  const handleViewVendorDetails = (vendor: AdminVendor) => {
    router.push(`/vendor/${vendor._id}`);
  };

  const handleSelectVendor = (vendorId: string, checked: boolean) => {
    setSelectedVendors((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(vendorId);
      } else {
        newSet.delete(vendorId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pendingVendors = filteredVendors
        .filter((v) => v.status === "pending")
        .map((v) => v._id);
      setSelectedVendors(new Set(pendingVendors));
    } else {
      setSelectedVendors(new Set());
    }
  };

  const handleBulkAction = async (action: "approve" | "reject") => {
    const selectedVendorsList = Array.from(selectedVendors);
    if (selectedVendorsList.length === 0) return;

    // const data = { id, status: action, notes: reviewNotes };
    // const res = await updateVendor();

    const actionText = action === "approve" ? "approved" : "rejected";
    toast.success(`${selectedVendorsList.length} vendor(s) ${actionText}`, {
      description: `Bulk action completed successfully.`,
    });
  };

  const [searchVendor, { data: vendorDatas, error, isLoading }] =
    useSearchVendorMutation();

  const [updateVendor, { data: updatedvendorDatas }] =
    useUpdateVendorStatusMutation();

  // Effect to trigger the API call when vendorStatus, searchQuery, or currentPage changes
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await searchVendor({
          status: vendorStatus,
          search: searchQuery,
          page: currentPage, // Add current page to API call
        }).unwrap();

        setVendors(response?.data?.attributes.vendors || []);
        setTotalPages(response?.data?.attributes.totalPages || 1);
        setTotalCount(response?.data?.attributes.totalCount || 0);
      } catch (err) {
        console.error("Error fetching vendors", err);
      }
    };
    fetchVendors();
  }, [vendorStatus, searchQuery, currentPage, searchVendor, fetchAgain]);

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );

    // First page
    if (startPage > 1) {
      buttons.push(
        <Button
          key={1}
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(1)}
        >
          1
        </Button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-2">
            ...
          </span>
        );
      }
      buttons.push(
        <Button
          key={totalPages}
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    // Next button
    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );

    return buttons;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Vendor Management
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor all marketplace vendors and stores
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVendors}</div>
            <p className="text-xs text-muted-foreground">Registered stores</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.activeVendors}
            </div>
            <p className="text-xs text-muted-foreground">Active vendors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingApproval}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              AED {stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Platform revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Filter Tabs */}
      <Tabs value={statusFilter} onValueChange={handleStatusFilterChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="relative">
            All Vendors
            <Badge variant="secondary" className="ml-2">
              {totalCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            <Clock className="h-4 w-4 mr-1" />
            Pending Review
            <Badge variant="secondary" className="ml-2">
              {vendors.filter((v) => v.status === "pending").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="relative">
            <CheckCircle className="h-4 w-4 mr-1" />
            Verified
            <Badge variant="secondary" className="ml-2">
              {vendors.filter((v) => v.status === "approved").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="suspended" className="relative">
            <XCircle className="h-4 w-4 mr-1" />
            Suspended
            <Badge variant="secondary" className="ml-2">
              {vendors.filter((v) => v.status === "suspended").length}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {statusFilter === "all" && "All Vendors"}
              {statusFilter === "pending" && "Pending Applications"}
              {statusFilter === "approved" && "Verified Vendors"}
              {statusFilter === "suspended" && "Suspended Vendors"}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredVendors.length} showing of {totalCount} total)
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* Bulk Actions for Pending Reviews */}
              {statusFilter === "pending" && selectedVendors.size > 0 && (
                <div className="flex items-center gap-2 mr-4">
                  <Button
                    size="sm"
                    onClick={() => handleBulkAction("approve")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve {selectedVendors.size}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleBulkAction("reject")}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject {selectedVendors.size}
                  </Button>
                </div>
              )}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendors..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {statusFilter === "pending" && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedVendors.size ===
                          filteredVendors.filter((v) => v.status === "pending")
                            .length &&
                        filteredVendors.filter((v) => v.status === "pending")
                          .length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                <TableHead>Vendor</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.length === 0 ? (
                <TableRow key={"1"}>
                  <TableCell
                    colSpan={statusFilter === "pending" ? 11 : 10}
                    className="text-center py-8"
                  >
                    <div className="text-muted-foreground">
                      <Store className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No vendors found</p>
                      <p className="text-sm">
                        {searchQuery
                          ? "Try adjusting your search"
                          : "Vendors will appear here once they register"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredVendors.map((vendor) => (
                  <TableRow key={vendor._id}>
                    {statusFilter === "pending" &&
                      vendor.status === "pending" && (
                        <TableCell>
                          <Checkbox
                            checked={selectedVendors.has(vendor._id)}
                            onCheckedChange={(checked) =>
                              handleSelectVendor(vendor._id, checked as boolean)
                            }
                          />
                        </TableCell>
                      )}
                    {statusFilter === "pending" &&
                      vendor.status !== "pending" && <TableCell></TableCell>}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}${
                              vendor?.storePhoto || vendor.storeName.slice(0, 2)
                            }`}
                          />
                          <AvatarFallback>
                            {vendor.storeName.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{vendor.storeName}</p>
                          <p className="text-xs text-muted-foreground">
                            {vendor.seller.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{vendor.ownerName}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm truncate w-24 overflow-hidden whitespace-nowrap">
                          {vendor?.location}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{vendor.productCount}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{vendor.totalSales}</span>
                    </TableCell>
                    <TableCell>
                      {Number(vendor.averageRating) > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-medium">
                            {vendor.averageRating}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          N/A
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm truncate w-16 overflow-hidden whitespace-nowrap">
                          {formatDate(vendor.createdAt)}
                        </span>
                      </div>
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
                            onClick={() => handleViewVendorDetails(vendor)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Vendor
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {vendor.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleVendorAction(vendor, "approve")
                                }
                                className="text-green-600"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve Vendor
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleVendorAction(vendor, "reject")
                                }
                                className="text-destructive"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject Application
                              </DropdownMenuItem>
                            </>
                          )}
                          {vendor.status === "approved" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleVendorAction(vendor, "reject")
                              }
                              className="text-destructive"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Suspend Vendor
                            </DropdownMenuItem>
                          )}

                          {vendor.status === "suspended" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleVendorAction(vendor, "approve")
                              }
                              className="text-destructive"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Approve Vendor
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing page {currentPage} of {totalPages} • {totalCount} total
                vendors
              </div>
              <div className="flex items-center space-x-2">
                {renderPaginationButtons()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vendor Review Dialog */}
      <VendorReviewDialog
        setIsReviewDialogOpen={setIsReviewDialogOpen}
        isReviewDialogOpen={isReviewDialogOpen}
        reviewAction={reviewAction}
        selectedVendor={selectedVendor}
        setReviewNotes={setReviewNotes}
        reviewNotes={reviewNotes}
        handleReviewSubmit={handleReviewSubmit}
        formatDate={formatDate}
      />
    </div>
  );
}
