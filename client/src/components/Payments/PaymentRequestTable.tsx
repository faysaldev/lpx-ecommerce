"use client";

import { DollarSign, Eye } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import SinglePlaymentDetailsDialogBox from "./SinglePaymentDetailsDialogBox";

interface Vendor {
  _id: string;
  storeName: string;
}

export interface PaymentRequest {
  _id: string;
  seller: string;
  vendor: Vendor;
  bankDetails?: BankDetails;
  withdrawalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  phoneNumber: string;
  accountType: string;
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
    setSelectedRequest(request);
    if (onViewDetails) {
      onViewDetails(request);
    } else {
      setSelectedRequest(request);
      setShowDetailsDialog(true);
    }
  };

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
                      <p
                        className="font-medium truncate w-24 overflow-hidden
                      whitespace-nowrap"
                      >
                        {request._id}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getTimeSinceRequest(request?.createdAt.toString())}
                      </p>
                    </div>
                  </TableCell>

                  {showVendorColumn && (
                    <TableCell>
                      <div>
                        <p className="font-medium">Vendor</p>
                        <p
                          className="text-sm text-muted-foreground font-medium truncate w-20 md:w-28 overflow-hidden
                      whitespace-nowrap"
                        >
                          {request.vendor?.storeName}
                        </p>
                      </div>
                    </TableCell>
                  )}

                  <TableCell>
                    <div>
                      <p
                        className="font-medium truncate w-24 overflow-hidden
                      whitespace-nowrap"
                      >
                        {request?.bankDetails?.bankName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request?.bankDetails?.accountNumber}
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
                      {request?.bankDetails?.accountType}
                    </p>
                  </TableCell>

                  <TableCell>
                    <Badge variant={variant} className={className}>
                      {getStatusDisplayText(request.status)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">
                      <p
                        className="text-sm font-medium truncate w-18 md:w-24 overflow-hidden
                      whitespace-nowrap"
                      >
                        {formatDate(request.createdAt.toString())}
                      </p>
                      <p className="text-muted-foreground">
                        {getTimeSinceRequest(request.createdAt.toString())}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button onClick={() => handleViewDetails(request)}>
                      <Eye className="" />
                    </Button>
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
        seletedRequest={selectedRequest}
        requestId={selectedRequest?._id}
      />
    </>
  );
}
