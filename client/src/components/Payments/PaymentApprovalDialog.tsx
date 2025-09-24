"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle,
  DollarSign,
  FileText,
  Upload,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/UI/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import { Textarea } from "@/components/UI/textarea";
// import { PaymentRequestMockAPI } from "@/lib/api/mock/payment-requests";
import { formatCurrency, formatDate } from "@/lib/utils/helpers";
import type { PaymentRequest } from "@/lib/types";

interface PaymentApprovalDialogProps {
  paymentRequest: PaymentRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function PaymentApprovalDialog({
  paymentRequest,
  isOpen,
  onClose,
  onUpdate,
}: PaymentApprovalDialogProps) {
  const [action, setAction] = useState<"approve" | "reject" | "pay" | null>(
    null
  );
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectedReason, setRejectedReason] = useState("");
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setAction(null);
    setAdminNotes("");
    setRejectedReason("");
    setPaymentProofFile(null);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.includes("pdf") && !file.type.includes("image")) {
        toast.error("Please upload a PDF or image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setPaymentProofFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!paymentRequest || !action) return;

    // Validation
    if (action === "reject" && !rejectedReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsSubmitting(true);

    try {
      // await PaymentRequestMockAPI.updatePaymentRequestStatus(
      //   paymentRequest.id,
      //   action === "pay"
      //     ? "paid"
      //     : action === "approve"
      //     ? "approved"
      //     : action === "reject"
      //     ? "rejected"
      //     : action,
      //   adminNotes.trim() || undefined,
      //   action === "reject" ? rejectedReason.trim() : undefined
      // );

      const actionText =
        action === "approve"
          ? "approved"
          : action === "reject"
          ? "rejected"
          : "marked as paid";

      toast.success(`Payment request ${actionText}`, {
        description: `Request ${paymentRequest.id} has been ${actionText}`,
      });

      onUpdate();
      handleClose();
    } catch (_error) {
      toast.error("Failed to update payment request", {
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!paymentRequest) return null;

  const getActionTitle = () => {
    switch (action) {
      case "approve":
        return "Approve Payment Request";
      case "reject":
        return "Reject Payment Request";
      case "pay":
        return "Mark Payment as Completed";
      default:
        return "Payment Request Actions";
    }
  };

  const getActionDescription = () => {
    switch (action) {
      case "approve":
        return `Approve payment request ${
          paymentRequest.id
        } for ${formatCurrency(paymentRequest.netAmount)}`;
      case "reject":
        return `Reject payment request ${paymentRequest.id} and notify vendor`;
      case "pay":
        return `Mark payment request ${paymentRequest.id} as paid and complete the process`;
      default:
        return `Manage payment request ${paymentRequest.id}`;
    }
  };

  const getActionIcon = () => {
    switch (action) {
      case "approve":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "reject":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "pay":
        return <DollarSign className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getActionIcon()}
            {getActionTitle()}
          </DialogTitle>
          <DialogDescription>{getActionDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Request Details */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Vendor</span>
                  </div>
                  <div>
                    <p className="font-semibold">{paymentRequest.vendorName}</p>
                    <p className="text-sm text-muted-foreground">
                      {paymentRequest.vendorEmail}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Requested</span>
                  </div>
                  <p className="font-medium">
                    {formatDate(paymentRequest.requestDate)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Amount</span>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      {formatCurrency(paymentRequest.netAmount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total: {formatCurrency(paymentRequest.totalAmount)}
                      (Fee: {formatCurrency(paymentRequest.commission)})
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <div>
            <h4 className="font-semibold mb-3">
              Included Orders ({paymentRequest.items.length})
            </h4>
            <div className="border rounded-lg max-h-64 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentRequest.items.map((item) => (
                    <TableRow key={item.orderId}>
                      <TableCell className="font-medium">
                        {item.orderNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.customer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.customer.email}
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

          {/* Vendor Notes */}
          {paymentRequest.notes && (
            <div>
              <h4 className="font-semibold mb-2">Vendor Notes</h4>
              <p className="text-sm bg-muted p-3 rounded-lg">
                {paymentRequest.notes}
              </p>
            </div>
          )}

          {/* Vendor Invoice */}
          {paymentRequest.invoiceUrl && (
            <div>
              <h4 className="font-semibold mb-2">Vendor Invoice</h4>
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <FileText className="h-4 w-4" />
                <span className="text-sm flex-1">Invoice Document</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(paymentRequest.invoiceUrl, "_blank")
                  }
                >
                  View
                </Button>
              </div>
            </div>
          )}

          {/* Action Selection */}
          {!action && (
            <div>
              <h4 className="font-semibold mb-3">Select Action</h4>
              <div className="grid grid-cols-3 gap-3">
                {paymentRequest.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setAction("approve")}
                      className="h-auto p-4 flex flex-col items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <CheckCircle className="h-6 w-6" />
                      <span className="font-medium">Approve</span>
                      <span className="text-xs text-muted-foreground">
                        Approve for payment
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setAction("reject")}
                      className="h-auto p-4 flex flex-col items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="h-6 w-6" />
                      <span className="font-medium">Reject</span>
                      <span className="text-xs text-muted-foreground">
                        Decline request
                      </span>
                    </Button>
                  </>
                )}

                {paymentRequest.status === "approved" && (
                  <Button
                    variant="outline"
                    onClick={() => setAction("pay")}
                    className="h-auto p-4 flex flex-col items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <DollarSign className="h-6 w-6" />
                    <span className="font-medium">Mark as Paid</span>
                    <span className="text-xs text-muted-foreground">
                      Payment completed
                    </span>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Action Forms */}
          {action && (
            <div className="space-y-4">
              {/* Admin Notes */}
              <div>
                <Label
                  htmlFor="admin-notes"
                  className="text-base font-semibold"
                >
                  Admin Notes {action === "reject" ? "" : "(Optional)"}
                </Label>
                <Textarea
                  id="admin-notes"
                  placeholder={
                    action === "approve"
                      ? "Add any notes for approval..."
                      : action === "reject"
                      ? "Add notes for internal records..."
                      : "Add notes about the payment..."
                  }
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Rejection Reason */}
              {action === "reject" && (
                <div>
                  <Label
                    htmlFor="rejection-reason"
                    className="text-base font-semibold"
                  >
                    Rejection Reason <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="Explain why this request is being rejected..."
                    value={rejectedReason}
                    onChange={(e) => setRejectedReason(e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
              )}

              {/* Payment Proof Upload */}
              {action === "pay" && (
                <div>
                  <Label className="text-base font-semibold mb-2 block">
                    Payment Proof (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                    <div className="text-center">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <Label htmlFor="payment-proof" className="cursor-pointer">
                        <span className="text-sm font-medium text-primary hover:underline">
                          Upload payment proof
                        </span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF or image files up to 5MB
                      </p>
                      <Input
                        id="payment-proof"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                    {paymentProofFile && (
                      <div className="mt-3 flex items-center gap-2 p-2 bg-muted rounded">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{paymentProofFile.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPaymentProofFile(null)}
                          className="ml-auto"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Confirmation */}
              <div
                className={`flex items-start gap-2 p-3 rounded-lg border ${
                  action === "approve"
                    ? "bg-green-50 border-green-200"
                    : action === "reject"
                    ? "bg-red-50 border-red-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <AlertCircle
                  className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                    action === "approve"
                      ? "text-green-600"
                      : action === "reject"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                />
                <div className="text-sm">
                  <p
                    className={`font-medium ${
                      action === "approve"
                        ? "text-green-800"
                        : action === "reject"
                        ? "text-red-800"
                        : "text-blue-800"
                    }`}
                  >
                    {action === "approve" && "Approval Confirmation"}
                    {action === "reject" && "Rejection Confirmation"}
                    {action === "pay" && "Payment Confirmation"}
                  </p>
                  <p
                    className={`mt-1 ${
                      action === "approve"
                        ? "text-green-700"
                        : action === "reject"
                        ? "text-red-700"
                        : "text-blue-700"
                    }`}
                  >
                    {action === "approve" &&
                      `This will approve the payment request and notify the vendor. The vendor will expect payment within 3-5 business days.`}
                    {action === "reject" &&
                      `This will reject the payment request and notify the vendor with the provided reason. They can resubmit after addressing the issues.`}
                    {action === "pay" &&
                      `This will mark the payment as completed and notify the vendor. This action cannot be undone.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={action ? () => setAction(null) : handleClose}
          >
            {action ? "Back" : "Cancel"}
          </Button>
          {action && (
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting || (action === "reject" && !rejectedReason.trim())
              }
              className={
                action === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : action === "reject"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            >
              {isSubmitting
                ? "Processing..."
                : action === "approve"
                ? "Approve Request"
                : action === "reject"
                ? "Reject Request"
                : "Mark as Paid"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
