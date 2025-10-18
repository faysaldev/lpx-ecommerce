/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Calendar, User, Loader2 } from "lucide-react";

import { Badge } from "@/components/UI/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { useGetSinglePaymentdetailsQuery } from "@/redux/features/vendors/paymentRequest";
import { formatCurrency, formatDate } from "@/lib/utils/helpers";
import { getImageUrl } from "@/lib/getImageURL";
import { SinglePaymentRequest } from "@/lib/types";

// Helper functions

interface Vendor {
  _id: string;
  storeName: string;
}

export interface PaymentRequest {
  _id: string;
  seller: string;
  vendor: Vendor;
  bankDetails: BankDetails;
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

function SinglePlaymentDetailsDialogBox({
  requestId,
  showDetailsDialog,
  setShowDetailsDialog,
  seletedRequest,
}: {
  requestId?: string;
  setShowDetailsDialog: any;
  showDetailsDialog: any;
  seletedRequest: any;
}) {
  const { data: singlePaymentDetails, isLoading } =
    useGetSinglePaymentdetailsQuery(requestId, {
      skip: !requestId || !showDetailsDialog,
    });

  // Extract the payment request data
  const paymentRequest: SinglePaymentRequest =
    singlePaymentDetails?.data?.attributes;
  console.log(seletedRequest?.bankDetails?.bankName, "payment request data");

  return (
    <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment Request Details</DialogTitle>
          <DialogDescription>
            Request ID: {seletedRequest?.seletedRequestId}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg">Loading payment details...</span>
          </div>
        ) : seletedRequest ? (
          <div className="space-y-6">
            {/* Status and Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    variant={
                      getStatusBadgeVariant(seletedRequest.status).variant
                    }
                    className={
                      getStatusBadgeVariant(seletedRequest.status).className
                    }
                  >
                    {getStatusDisplayText(seletedRequest.status)}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Requested Date
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {formatDate(seletedRequest.createdAt.toString())}
                    </span>
                  </div>
                </div>

                {/* Seller Information */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Seller Information
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {seletedRequest?.seller?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {seletedRequest?.seller?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {seletedRequest?.seller?.image && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Seller Image
                    </p>
                    <img
                      src={getImageUrl(seletedRequest?.seller?.image)}
                      alt={seletedRequest?.seller?.name}
                      className="w-16 h-16 rounded-full object-cover border"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Withdrawal Amount
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(seletedRequest?.withdrawalAmount)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Bank Name
                  </p>
                  <p className="text-lg font-semibold">
                    {seletedRequest?.bankDetails?.bankName}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Account Number
                  </p>
                  <p className="text-lg font-semibold">
                    {seletedRequest?.bankDetails?.accountNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Bank Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Account Type
                  </p>
                  <p className="font-medium capitalize">
                    {seletedRequest?.bankDetails?.accountType}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </p>
                  <p className="font-medium">
                    {seletedRequest?.bankDetails?.phoneNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Bank Name
                  </p>
                  <p className="font-medium">
                    {seletedRequest?.bankDetails?.bankName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Account Number
                  </p>
                  <p className="font-medium">
                    {seletedRequest?.bankDetails?.accountNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Payment Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Withdrawal Amount
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(seletedRequest?.withdrawalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    variant={
                      getStatusBadgeVariant(seletedRequest?.status).variant
                    }
                    className={
                      getStatusBadgeVariant(seletedRequest?.status).className
                    }
                  >
                    {getStatusDisplayText(seletedRequest?.status)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Request Timeline</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Request Submitted</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(seletedRequest?.createdAt.toString())}
                    </p>
                  </div>
                </div>

                {seletedRequest?.status === "approved" && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-600 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Approved</p>
                      <p className="text-sm text-muted-foreground">
                        Request has been approved and is being processed
                      </p>
                    </div>
                  </div>
                )}

                {seletedRequest?.status === "paid" && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-600 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment Processed</p>
                      <p className="text-sm text-muted-foreground">
                        Payment has been successfully transferred
                      </p>
                    </div>
                  </div>
                )}

                {seletedRequest?.status === "rejected" && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-600 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Rejected</p>
                      <p className="text-sm text-muted-foreground">
                        Request has been rejected
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No payment details found.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default SinglePlaymentDetailsDialogBox;
