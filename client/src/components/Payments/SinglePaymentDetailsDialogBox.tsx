/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Calendar, User, Loader2, Download, FileImage } from "lucide-react";

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
import { Button } from "@/components/UI/button";

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
  invoiceImage: string;
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

// Function to download invoice image
const downloadInvoiceImage = (imageUrl: string, fileName: string) => {
  fetch(imageUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName || "invoice.jpg";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    })
    .catch((error) => {
      console.error("Error downloading invoice:", error);
      // Fallback: open in new tab if download fails
      window.open(imageUrl, "_blank");
    });
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

  // Check if invoice image is available and status is paid
  const hasInvoiceImage = seletedRequest?.invoiceImage;
  const isPaidStatus = seletedRequest?.status === "paid";
  const canDownloadInvoice = hasInvoiceImage && isPaidStatus;

  // Get full invoice image URL
  const invoiceImageUrl = hasInvoiceImage
    ? getImageUrl(seletedRequest.invoiceImage)
    : "";

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
              </div>
            </div>

            {/* Invoice Image Section */}
            {hasInvoiceImage && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <FileImage className="h-5 w-5" />
                    Invoice Image
                  </h4>
                  {canDownloadInvoice && (
                    <Button
                      onClick={() =>
                        downloadInvoiceImage(
                          invoiceImageUrl,
                          `invoice-${
                            seletedRequest._id ||
                            seletedRequest.seletedRequestId
                          }.jpg`
                        )
                      }
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Invoice
                    </Button>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg border p-4">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-full max-w-md aspect-video border rounded-lg overflow-hidden bg-white">
                      <img
                        src={invoiceImageUrl}
                        alt="Payment Invoice"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {!isPaidStatus && (
                      <div className="text-center">
                        <Badge variant="secondary" className="mb-2">
                          Invoice Preview
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          Download available after payment is processed
                        </p>
                      </div>
                    )}

                    {isPaidStatus && (
                      <div className="text-center">
                        <Badge
                          variant="default"
                          className="mb-2 bg-green-100 text-green-800"
                        >
                          Paid Invoice
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          This invoice has been paid and processed
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bank Details */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Bank Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    IBAN
                  </p>
                  <p className="font-medium capitalize">
                    {seletedRequest?.bankDetails?.IBAN}
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
                {hasInvoiceImage && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Invoice Available
                    </p>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
                      Yes
                    </Badge>
                  </div>
                )}
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
