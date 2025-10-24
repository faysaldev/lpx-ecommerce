/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle,
  FileText,
  User,
  XCircle,
  Building,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { formatCurrency, formatDate } from "@/lib/utils/helpers";
import { Label } from "../UI/label";
import { Input } from "../UI/input";
import { Badge } from "../UI/badge";
import {
  getStatusBadgeVariant,
  getStatusDisplayText,
} from "@/lib/utils/helpers";
import { useAdminPayRequestInVoiceUploadMutation } from "@/redux/features/admin/adminPaymentrequest";

interface PaymentApprovalDialogProps {
  paymentRequest: any | null;
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
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [transactionNumber, setTransactionNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updateInvoiceDetails] = useAdminPayRequestInVoiceUploadMutation();

  const handleClose = () => {
    setAction(null);
    setTransactionNumber("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!paymentRequest || !action) return;

    // Validate transaction number for approve action
    if (action === "approve" && !transactionNumber.trim()) {
      toast.error("Please enter transaction number");
      return;
    }

    setIsSubmitting(true);

    try {
      const status = action === "approve" ? "paid" : "rejected";
      const data = {
        status: status,
        note: action === "approve" ? transactionNumber.trim() : "",
      };
      await updateInvoiceDetails({
        paymentId: paymentRequest?._id,
        data: data,
      }).unwrap();
      const actionText =
        action === "approve" ? "approved and marked as paid" : "rejected";

      toast.success(`Payment request ${actionText}`, {
        description: `Request #${paymentRequest._id} has been ${actionText}`,
      });

      onUpdate();
      handleClose();
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error("Failed to update payment request", {
        description: error?.data?.message || "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!paymentRequest) return null;

  const getActionTitle = () => {
    switch (action) {
      case "approve":
        return "Approve & Mark as Paid";
      case "reject":
        return "Reject Payment Request";
      default:
        return "Payment Request Details";
    }
  };

  const getActionDescription = () => {
    switch (action) {
      case "approve":
        return `Approve and mark payment request #${
          paymentRequest._id
        } as paid (${formatCurrency(paymentRequest.withdrawalAmount)})`;
      case "reject":
        return `Reject payment request #${paymentRequest._id} and notify vendor`;
      default:
        return `Manage payment request #${paymentRequest._id}`;
    }
  };

  const getActionIcon = () => {
    switch (action) {
      case "approve":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "reject":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAvailableActions = () => {
    switch (paymentRequest.status) {
      case "pending":
        return ["approve", "reject"];
      case "approved":
        return ["approve", "reject"];
      case "paid":
        return [];
      case "rejected":
        return ["approve"];
      default:
        return [];
    }
  };
  const availableActions = getAvailableActions();
  const { variant, className } = getStatusBadgeVariant(paymentRequest.status);
  console.log(paymentRequest, "single payment request");
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
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Payment Request # {paymentRequest._id}
                  </h3>
                  <Badge variant={variant} className={className}>
                    {getStatusDisplayText(paymentRequest.status)}
                  </Badge>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(paymentRequest.withdrawalAmount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Withdrawal Amount
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bank Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Bank Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank Name:</span>
                      <span className="font-medium">
                        {paymentRequest?.bankDetails?.bankName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        IBAN Number:
                      </span>
                      <span className="font-medium">
                        {paymentRequest?.bankDetails?.IBAN}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SWIFT :</span>
                      <span className="font-medium capitalize">
                        {paymentRequest?.bankDetails?.SWIFT}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Contact Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">
                        {paymentRequest?.bankDetails?.phoneNumber}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vendor</span>
                    <span className="font-medium text-xs break-all">
                      {paymentRequest?.vendor?.storeName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Currency
                    </span>
                    <span className="font-medium text-xs break-all">
                      {paymentRequest?.bankDetails?.Currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Request Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(paymentRequest.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Updated At</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(paymentRequest.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Selection */}
          {!action && availableActions.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4">Manage Payment Request</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableActions.includes("approve") && (
                    <Button
                      variant="outline"
                      onClick={() => setAction("approve")}
                      className="h-auto p-4 flex flex-col items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <CheckCircle className="h-6 w-6" />
                      <span className="font-medium">Approve & Mark Paid</span>
                      <span className="text-xs text-muted-foreground text-center">
                        Approve and mark as paid
                      </span>
                    </Button>
                  )}

                  {availableActions.includes("reject") && (
                    <Button
                      variant="outline"
                      onClick={() => setAction("reject")}
                      className="h-auto p-4 flex flex-col items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="h-6 w-6" />
                      <span className="font-medium">Reject</span>
                      <span className="text-xs text-muted-foreground text-center">
                        Decline this request
                      </span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Actions Available */}
          {!action && availableActions.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-4">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium">No actions available</p>
                  <p className="text-sm text-muted-foreground">
                    This payment request is already {paymentRequest.status} and
                    cannot be modified.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Forms */}
          {action === "approve" && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Transaction Number */}
                  <div>
                    <Label
                      htmlFor="transaction-number"
                      className="text-base font-semibold"
                    >
                      Transaction Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="transaction-number"
                      placeholder="Enter transaction number..."
                      value={transactionNumber}
                      onChange={(e) => setTransactionNumber(e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>

                  {/* Action Confirmation */}
                  <div className="flex items-start gap-3 p-4 rounded-lg border bg-green-50 border-green-200">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <div className="text-sm">
                      <p className="font-medium text-green-800">
                        Approval & Payment Confirmation
                      </p>
                      <p className="mt-1 text-green-700">
                        This will mark the payment request as {`"paid"`} and
                        notify the vendor. Please ensure payment has been
                        processed before confirming.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={action ? () => setAction(null) : handleClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {action ? "Back" : "Close"}
          </Button>
          {action && (
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                (action === "approve" && !transactionNumber.trim())
              }
              className={`w-full sm:w-auto ${
                action === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isSubmitting
                ? "Processing..."
                : action === "approve"
                ? "Approve & Mark as Paid"
                : "Reject Request"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
