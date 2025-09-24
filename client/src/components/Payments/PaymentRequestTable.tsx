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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
} from "@/components/UI/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import {
  formatCurrency,
  formatDate,
  getStatusBadgeVariant,
  getStatusDisplayText,
  getTimeSinceRequest,
} from "@/lib/utils/helpers";
import type { PaymentRequest } from "@/lib/payment-request";

interface PaymentRequestTableProps {
  paymentRequests: PaymentRequest[];
  onViewDetails?: (request: PaymentRequest) => void;
  showVendorColumn?: boolean;
}

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

  const handleDownloadInvoice = (request: PaymentRequest) => {
    if (request.invoiceUrl) {
      // In a real app, this would trigger a download
      window.open(request.invoiceUrl, "_blank");
    }
  };

  const handleDownloadPaymentProof = (request: PaymentRequest) => {
    if (request.paymentProofUrl) {
      // In a real app, this would trigger a download
      window.open(request.paymentProofUrl, "_blank");
    }
  };

  if (paymentRequests.length === 0) {
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
              <TableHead>Amount</TableHead>
              <TableHead>Net Amount</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentRequests.map((request) => {
              const { variant, className } = getStatusBadgeVariant(
                request.status
              );

              return (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {getTimeSinceRequest(request.requestDate)}
                      </p>
                    </div>
                  </TableCell>

                  {showVendorColumn && (
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.vendorName}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.vendorEmail}
                        </p>
                      </div>
                    </TableCell>
                  )}

                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {formatCurrency(request.totalAmount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Fee: {formatCurrency(request.commission)}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <p className="font-medium text-green-600">
                      {formatCurrency(request.netAmount)}
                    </p>
                  </TableCell>

                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {request.items.length} order(s)
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request.items[0]?.orderNumber}
                        {request.items.length > 1 &&
                          ` +${request.items.length - 1} more`}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={variant} className={className}>
                      {getStatusDisplayText(request.status)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">
                      <p>
                        {formatDate(request.requestDate, {
                          hour: undefined,
                          minute: undefined,
                        })}
                      </p>
                      {request.status === "approved" &&
                        request.approvedDate && (
                          <p className="text-green-600">
                            Approved{" "}
                            {formatDate(request.approvedDate, {
                              year: undefined,
                              hour: undefined,
                              minute: undefined,
                            })}
                          </p>
                        )}
                      {request.status === "paid" && request.paidDate && (
                        <p className="text-blue-600">
                          Paid{" "}
                          {formatDate(request.paidDate, {
                            year: undefined,
                            hour: undefined,
                            minute: undefined,
                          })}
                        </p>
                      )}
                      {request.status === "rejected" &&
                        request.rejectedDate && (
                          <p className="text-red-600">
                            Rejected{" "}
                            {formatDate(request.rejectedDate, {
                              year: undefined,
                              hour: undefined,
                              minute: undefined,
                            })}
                          </p>
                        )}
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(request)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {request.invoiceUrl && (
                          <DropdownMenuItem
                            onClick={() => handleDownloadInvoice(request)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Invoice
                          </DropdownMenuItem>
                        )}
                        {request.paymentProofUrl && (
                          <DropdownMenuItem
                            onClick={() => handleDownloadPaymentProof(request)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Payment Proof
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Request Details</DialogTitle>
            <DialogDescription>
              Request ID: {selectedRequest?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Status and Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Status
                    </p>
                    <Badge
                      variant={
                        getStatusBadgeVariant(selectedRequest.status).variant
                      }
                      className={
                        getStatusBadgeVariant(selectedRequest.status).className
                      }
                    >
                      {getStatusDisplayText(selectedRequest.status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Requested
                    </p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(selectedRequest.requestDate)}</span>
                    </div>
                  </div>
                  {showVendorColumn && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Vendor
                      </p>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedRequest.vendorName}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="text-lg font-bold">
                      {formatCurrency(selectedRequest.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Platform Fee
                    </p>
                    <p className="text-lg font-semibold text-red-600">
                      -{formatCurrency(selectedRequest.commission)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Net Amount
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(selectedRequest.netAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-semibold mb-3">Timeline</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Submitted on {formatDate(selectedRequest.requestDate)}
                    </span>
                  </div>
                  {selectedRequest.approvedDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span>
                        Approved on {formatDate(selectedRequest.approvedDate)}
                      </span>
                      {selectedRequest.approvedBy && (
                        <span className="text-muted-foreground">
                          by {selectedRequest.approvedBy}
                        </span>
                      )}
                    </div>
                  )}
                  {selectedRequest.paidDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>
                        Paid on {formatDate(selectedRequest.paidDate)}
                      </span>
                    </div>
                  )}
                  {selectedRequest.rejectedDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-red-600" />
                      <span>
                        Rejected on {formatDate(selectedRequest.rejectedDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Orders */}
              <div>
                <h4 className="font-semibold mb-3">
                  Included Orders ({selectedRequest.items.length})
                </h4>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Number</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRequest.items.map((item) => (
                        <TableRow key={item.orderId}>
                          <TableCell className="font-medium">
                            {item.orderNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {item.customer.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {item.customer.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {item.products.length} item(s)
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {item.products[0]?.name}
                                {item.products.length > 1 &&
                                  ` +${item.products.length - 1} more`}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(item.orderDate, {
                              hour: undefined,
                              minute: undefined,
                            })}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Notes */}
              {(selectedRequest.notes ||
                selectedRequest.adminNotes ||
                selectedRequest.rejectedReason) && (
                <div className="space-y-3">
                  {selectedRequest.notes && (
                    <div>
                      <h4 className="font-semibold mb-2">Vendor Notes</h4>
                      <p className="text-sm bg-muted p-3 rounded-lg">
                        {selectedRequest.notes}
                      </p>
                    </div>
                  )}
                  {selectedRequest.adminNotes && (
                    <div>
                      <h4 className="font-semibold mb-2">Admin Notes</h4>
                      <p className="text-sm bg-blue-50 border border-blue-200 p-3 rounded-lg">
                        {selectedRequest.adminNotes}
                      </p>
                    </div>
                  )}
                  {selectedRequest.rejectedReason && (
                    <div>
                      <h4 className="font-semibold mb-2">Rejection Reason</h4>
                      <p className="text-sm bg-red-50 border border-red-200 p-3 rounded-lg">
                        {selectedRequest.rejectedReason}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Files */}
              {(selectedRequest.invoiceUrl ||
                selectedRequest.paymentProofUrl) && (
                <div>
                  <h4 className="font-semibold mb-3">Attachments</h4>
                  <div className="space-y-2">
                    {selectedRequest.invoiceUrl && (
                      <div className="flex items-center gap-2 p-2 bg-muted rounded">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm flex-1">Invoice</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadInvoice(selectedRequest)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                    {selectedRequest.paymentProofUrl && (
                      <div className="flex items-center gap-2 p-2 bg-muted rounded">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm flex-1">Payment Proof</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDownloadPaymentProof(selectedRequest)
                          }
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
