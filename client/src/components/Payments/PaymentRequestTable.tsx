"use client";

import {
  Calendar,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  MoreHorizontal,
  User,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
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
import SinglePlaymentDetailsDialogBox from "./SinglePaymentDetailsDialogBox";

interface PaymentRequest {
  _id: string;
  seller: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  phoneNumber: string;
  withdrawalAmount: number;
  status: string;
  requestDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PaymentRequestTableProps {
  paymentRequests: PaymentRequest[];
  onViewDetails?: (request: PaymentRequest) => void;
  showVendorColumn?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    onPageChange: (page: number) => void;
  };
}

// Helper functions
const formatCurrency = (amount: number) => {
  return `AED ${amount?.toFixed(2) || "0.00"}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getTimeSinceRequest = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return `${Math.ceil(diffDays / 30)} months ago`;
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "paid":
    case "approved":
      return {
        variant: "default" as const,
        className: "bg-green-100 text-green-800",
      };
    case "pending":
      return {
        variant: "secondary" as const,
        className: "bg-yellow-100 text-yellow-800",
      };
    case "rejected":
      return {
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800",
      };
    default:
      return { variant: "outline" as const, className: "" };
  }
};

const getStatusDisplayText = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "approved":
      return "Approved";
    case "paid":
      return "Paid";
    case "rejected":
      return "Rejected";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

export default function PaymentRequestTable({
  paymentRequests,
  onViewDetails,
  showVendorColumn = false,
}: PaymentRequestTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(
    null
  );
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const handleViewDetails = (request: PaymentRequest) => {
    if (onViewDetails) {
      onViewDetails(request);
    } else {
      setSelectedRequest(request);
      setShowDetailsDialog(true);
    }
  };

  console.log("Payment Requests:", paymentRequests);

  if (!paymentRequests || paymentRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto bg-muted rounded-full flex items-center justify-center mb-6 w-24 h-24">
          <DollarSign className="text-muted-foreground h-12 w-12" />
        </div>
        <h3 className="font-semibold mb-2 text-xl">
          No payment requests found
        </h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {showVendorColumn
            ? "No payment requests have been submitted yet."
            : "You haven't submitted any payment requests yet. Create one to get started."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              {showVendorColumn && <TableHead>Vendor</TableHead>}
              <TableHead>Bank Details</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Account Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentRequests.map((request) => {
              const { variant, className } = getStatusBadgeVariant(
                request.status
              );

              return (
                <TableRow key={request._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request._id}</p>
                      <p className="text-sm text-muted-foreground">
                        {getTimeSinceRequest(request.requestDate)}
                      </p>
                    </div>
                  </TableCell>

                  {showVendorColumn && (
                    <TableCell>
                      <div>
                        <p className="font-medium">Vendor ID</p>
                        <p className="text-sm text-muted-foreground">
                          {request.seller}
                        </p>
                      </div>
                    </TableCell>
                  )}

                  <TableCell>
                    <div>
                      <p className="font-medium">{request.bankName}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.accountNumber}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <p className="font-medium text-green-600">
                      {formatCurrency(request.withdrawalAmount)}
                    </p>
                  </TableCell>

                  <TableCell>
                    <p className="font-medium capitalize">
                      {request.accountType}
                    </p>
                  </TableCell>

                  <TableCell>
                    <Badge variant={variant} className={className}>
                      {getStatusDisplayText(request.status)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">
                      <p>{formatDate(request.requestDate)}</p>
                      <p className="text-muted-foreground">
                        {getTimeSinceRequest(request.requestDate)}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(request)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <SinglePlaymentDetailsDialogBox
        setShowDetailsDialog={setShowDetailsDialog}
        showDetailsDialog={showDetailsDialog}
        requestId={selectedRequest?._id}
      />
    </>
  );
}
