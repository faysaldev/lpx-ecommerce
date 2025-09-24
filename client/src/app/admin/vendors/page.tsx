"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Mail,
  MapPin,
  MoreHorizontal,
  Package,
  Search,
  Star,
  Store,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import adminMockService, { type AdminVendor } from "@/lib/admin-mock";

export default function VendorsManagement() {
  const [vendors, setVendors] = useState<AdminVendor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<AdminVendor | null>(
    null,
  );
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(
    null,
  );
  const [reviewNotes, setReviewNotes] = useState("");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "verified" | "suspended"
  >("all");
  const [selectedVendors, setSelectedVendors] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    // Load vendors from admin mock service
    const allVendors = adminMockService.getAllVendors();
    setVendors(allVendors);
  }, []);

  // Calculate statistics from actual vendors
  const stats = {
    totalVendors: vendors.length,
    activeVendors: vendors.filter((v) => v.status === "verified").length,
    pendingApproval: vendors.filter((v) => v.status === "pending").length,
    totalRevenue: vendors.reduce((sum, vendor) => sum + vendor.revenue, 0),
  };

  // Filter vendors based on search query and status
  const filteredVendors = vendors.filter((vendor) => {
    // Status filter
    if (statusFilter !== "all" && vendor.status !== statusFilter) {
      return false;
    }

    // Search filter
    if (!searchQuery) return true;
    return (
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.location.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      verified: "default",
      pending: "secondary",
      suspended: "destructive",
    };

    const colors: Record<string, string> = {
      verified: "text-green-600",
      pending: "text-yellow-600",
      suspended: "text-red-600",
    };

    return (
      <Badge variant={variants[status] || "outline"} className={colors[status]}>
        {status === "verified" && <CheckCircle className="h-3 w-3 mr-1" />}
        {status === "pending" && <AlertCircle className="h-3 w-3 mr-1" />}
        {status === "suspended" && <XCircle className="h-3 w-3 mr-1" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleVendorAction = (
    vendor: AdminVendor,
    action: "approve" | "reject",
  ) => {
    setSelectedVendor(vendor);
    setReviewAction(action);
    setReviewNotes("");
    setIsReviewDialogOpen(true);
  };

  const handleReviewSubmit = () => {
    if (!selectedVendor || !reviewAction) return;

    const updatedVendors = vendors.map((vendor) => {
      if (vendor.id === selectedVendor.id) {
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

    setVendors(updatedVendors);
    setIsReviewDialogOpen(false);
    setSelectedVendor(null);
    setReviewAction(null);
    setReviewNotes("");

    const actionText = reviewAction === "approve" ? "approved" : "rejected";
    toast.success(`Vendor ${selectedVendor.name} has been ${actionText}`, {
      description:
        reviewNotes || `The vendor application has been ${actionText}.`,
    });
  };

  const handleViewVendorDetails = (vendor: AdminVendor) => {
    toast.info("Vendor Details", {
      description: `Opening detailed view for ${vendor.name}`,
    });
  };

  const handleSendMessage = (vendor: AdminVendor) => {
    toast.info("Send Message", {
      description: `Opening message composer for ${vendor.name}`,
    });
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
        .map((v) => v.id);
      setSelectedVendors(new Set(pendingVendors));
    } else {
      setSelectedVendors(new Set());
    }
  };

  const handleBulkAction = (action: "approve" | "reject") => {
    const selectedVendorsList = Array.from(selectedVendors);
    if (selectedVendorsList.length === 0) return;

    const updatedVendors = vendors.map((vendor) => {
      if (selectedVendorsList.includes(vendor.id)) {
        return {
          ...vendor,
          status:
            action === "approve"
              ? ("verified" as const)
              : ("suspended" as const),
        };
      }
      return vendor;
    });

    setVendors(updatedVendors);
    setSelectedVendors(new Set());

    const actionText = action === "approve" ? "approved" : "rejected";
    toast.success(`${selectedVendorsList.length} vendor(s) ${actionText}`, {
      description: `Bulk action completed successfully.`,
    });
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
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Vendors
        </Button>
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
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Platform revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Filter Tabs */}
      <Tabs
        value={statusFilter}
        onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="relative">
            All Vendors
            <Badge variant="secondary" className="ml-2">
              {vendors.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            <Clock className="h-4 w-4 mr-1" />
            Pending Review
            <Badge variant="secondary" className="ml-2">
              {vendors.filter((v) => v.status === "pending").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="verified" className="relative">
            <CheckCircle className="h-4 w-4 mr-1" />
            Verified
            <Badge variant="secondary" className="ml-2">
              {vendors.filter((v) => v.status === "verified").length}
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
              {statusFilter === "verified" && "Verified Vendors"}
              {statusFilter === "suspended" && "Suspended Vendors"}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredVendors.length} total)
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
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                <TableHead>Revenue</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.length === 0 ? (
                <TableRow>
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
                  <TableRow key={vendor.id}>
                    {statusFilter === "pending" &&
                      vendor.status === "pending" && (
                        <TableCell>
                          <Checkbox
                            checked={selectedVendors.has(vendor.id)}
                            onCheckedChange={(checked) =>
                              handleSelectVendor(vendor.id, checked as boolean)
                            }
                          />
                        </TableCell>
                      )}
                    {statusFilter === "pending" &&
                      vendor.status !== "pending" && <TableCell></TableCell>}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={vendor.avatar} />
                          <AvatarFallback>
                            {vendor.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{vendor.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {vendor.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{vendor.owner}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {vendor.location.city}, {vendor.location.country}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{vendor.products}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{vendor.sales}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        ${vendor.revenue.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      {vendor.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-medium">
                            {vendor.rating}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No ratings
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(vendor.status)}
                      {vendor.status === "pending" && (
                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleVendorAction(vendor, "approve")
                            }
                            className="h-6 px-2 text-xs text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVendorAction(vendor, "reject")}
                            className="h-6 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDate(vendor.joined)}
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
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Store className="mr-2 h-4 w-4" />
                            View Products
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSendMessage(vendor)}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Send Message
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
                          {vendor.status === "verified" && (
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

      {/* Vendor Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {reviewAction === "approve" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              {reviewAction === "approve"
                ? "Approve Vendor"
                : "Reject Application"}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === "approve"
                ? `You are about to approve ${selectedVendor?.name}'s vendor application. This will allow them to start selling on the platform.`
                : `You are about to reject ${selectedVendor?.name}'s vendor application. Please provide a reason for the rejection.`}
            </DialogDescription>
          </DialogHeader>

          {selectedVendor && (
            <div className="grid gap-4 py-4">
              {/* Vendor Info */}
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedVendor.avatar} />
                    <AvatarFallback>
                      {selectedVendor.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedVendor.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Owner: {selectedVendor.owner}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedVendor.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {selectedVendor.location.city},{" "}
                      {selectedVendor.location.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Applied {formatDate(selectedVendor.joined)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedVendor.products} products ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedVendor.rating} rating</span>
                  </div>
                </div>
              </div>

              {/* Review Notes */}
              <div className="grid gap-2">
                <Label htmlFor="review-notes">
                  {reviewAction === "approve"
                    ? "Approval Notes (Optional)"
                    : "Rejection Reason"}
                  {reviewAction === "reject" && (
                    <span className="text-red-500"> *</span>
                  )}
                </Label>
                <Textarea
                  id="review-notes"
                  placeholder={
                    reviewAction === "approve"
                      ? "Add any notes for the vendor or internal records..."
                      : "Please explain why this application is being rejected..."
                  }
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {reviewAction === "approve" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-green-800">
                        Approval Effects
                      </p>
                      <ul className="mt-1 text-green-700 list-disc list-inside space-y-1">
                        <li>Vendor can start listing products</li>
                        <li>Profile becomes visible to customers</li>
                        <li>Can receive and process orders</li>
                        <li>Gets access to vendor dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {reviewAction === "reject" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-red-800">
                        Rejection Effects
                      </p>
                      <ul className="mt-1 text-red-700 list-disc list-inside space-y-1">
                        <li>Application will be marked as rejected</li>
                        <li>Vendor will be notified via email</li>
                        <li>They can reapply after addressing issues</li>
                        <li>Account remains inactive</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReviewSubmit}
              disabled={reviewAction === "reject" && !reviewNotes.trim()}
              className={
                reviewAction === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {reviewAction === "approve"
                ? "Approve Vendor"
                : "Reject Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
