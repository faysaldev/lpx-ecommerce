/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ArrowUpDown,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  Search,
  XCircle,
} from "lucide-react";
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
import { Input } from "@/components/UI/input";
import { TabsContent } from "@/components/UI/tabs";
import PaymentRequestTable from "@/components/Payments/PaymentRequestTable";
import { getStatusDisplayText } from "@/lib/utils/helpers";
import { PaymentRequestStatus } from "@/lib/payment-request";
import { useState } from "react";

function AdminPaymentRequest({
  handleViewRequest,
}: {
  handleViewRequest: any;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    PaymentRequestStatus | "all"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "vendor">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleToggleSort = (newSortBy: "date" | "amount" | "vendor") => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  return (
    <TabsContent value="requests" className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Payment Requests 5{/* ({filteredAndSortedRequests.length}) */}
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px]"
                />
              </div>

              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {statusFilter === "all"
                      ? "All Status"
                      : getStatusDisplayText(statusFilter)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                    <Clock className="mr-2 h-4 w-4" />
                    Pending Review
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("approved")}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("paid")}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Paid
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Rejected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleToggleSort("date")}>
                    Date {sortBy === "date" && `(${sortOrder})`}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleToggleSort("amount")}>
                    Amount {sortBy === "amount" && `(${sortOrder})`}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleToggleSort("vendor")}>
                    Vendor {sortBy === "vendor" && `(${sortOrder})`}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PaymentRequestTable
            paymentRequests={[]}
            onViewDetails={handleViewRequest}
            showVendorColumn={true}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default AdminPaymentRequest;
