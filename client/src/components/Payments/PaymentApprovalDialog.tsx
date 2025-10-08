/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Textarea } from "@/components/UI/textarea";
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
  const [action, setAction] = useState<"approve" | "reject" | "pending" | null>(
    null
  );
  const [adminNotes, setAdminNotes] = useState("");
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updateInvoiceDetails] = useAdminPayRequestInVoiceUploadMutation();

  const handleClose = () => {
    setAction(null);
    setAdminNotes("");
    setPaymentProofFile(null);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.includes("image")) {
        toast.error("Please upload an image file (JPG, PNG)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setPaymentProofFile(file);
      toast.success("File selected successfully");
    }
  };

  const handleSubmit = async () => {
    if (!paymentRequest || !action) return;

    if (action === "pending" && !paymentProofFile) {
      toast.error("Please upload payment proof image");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create form data for API call
      const formData = new FormData();

      console.log(action);

      // Append the image file if action is 'approve' and paymentProofFile exists
      if (action === "approve" && paymentProofFile) {
        formData.append("image", paymentProofFile);
      }

      const status = action == "approve" ? "paid" : "rejected";

      // Append admin notes
      if (adminNotes.trim()) {
        formData.append("note", adminNotes.trim());
        formData.append("status", status);
      }

      // Call the mutation for pay action
      if (action === "approve" || action === "reject") {
        const response = await updateInvoiceDetails({
          paymentId: paymentRequest._id,
          data: formData,
        }).unwrap();

        console.log("API Response:", response);
      }

      const actionText =
        action === "approve"
          ? "approved"
          : action === "reject"
          ? "rejected"
          : "marked as paid";

      toast.success(`Payment request ${actionText}`, {
        description: `Request ${paymentRequest._id} has been ${actionText}`,
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
        return "Approve Payment Request";
      case "reject":
        return "Reject Payment Request";
      case "pending":
        return "Mark Payment as Completed";
      default:
        return "Payment Request Details";
    }
  };

  const getActionDescription = () => {
    switch (action) {
      case "approve":
        return `Approve payment request ${
          paymentRequest._id
        } for ${formatCurrency(paymentRequest.withdrawalAmount)}`;
      case "reject":
        return `Reject payment request ${paymentRequest._id} and notify vendor`;
      case "pending":
        return `Mark payment request ${paymentRequest._id} as paid and complete the process`;
      default:
        return `Manage payment request ${paymentRequest._id}`;
    }
  };

  const getActionIcon = () => {
    switch (action) {
      case "approve":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "reject":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "pending":
        return <DollarSign className="h-5 w-5 text-blue-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAvailableActions = () => {
    switch (paymentRequest.status) {
      case "pending":
        return ["approve", "reject"];
      case "approved":
        return ["pay", "reject"];
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
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Payment Request #{paymentRequest._id}
                  </h3>
                  <Badge variant={variant} className={className}>
                    {getStatusDisplayText(paymentRequest.status)}
                  </Badge>
                </div>
                <div className="text-right">
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
                        {paymentRequest.bankName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Account Number:
                      </span>
                      <span className="font-medium">
                        {paymentRequest.accountNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Account Type:
                      </span>
                      <span className="font-medium capitalize">
                        {paymentRequest.accountType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Contact Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">
                        {paymentRequest.phoneNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Seller ID:</span>
                      <span className="font-medium text-xs">
                        {paymentRequest.seller}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Request Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(paymentRequest.requestDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Created At</p>
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
                <div className="grid grid-cols-2 gap-4">
                  {availableActions.includes("approve") && (
                    <Button
                      variant="outline"
                      onClick={() => setAction("approve")}
                      className="h-auto p-4 flex flex-col items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <CheckCircle className="h-6 w-6" />
                      <span className="font-medium">Approve</span>
                      <span className="text-xs text-muted-foreground">
                        Approve for payment processing
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
                      <span className="text-xs text-muted-foreground">
                        Decline this request
                      </span>
                    </Button>
                  )}

                  {availableActions.includes("pending") && (
                    <Button
                      variant="outline"
                      onClick={() => setAction("pending")}
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
          {action && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Admin Notes */}
                  <div>
                    <Label
                      htmlFor="admin-notes"
                      className="text-base font-semibold"
                    >
                      Admin Notes (Optional)
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

                  {/* Payment Proof Upload - Only for approve action */}
                  {action === "approve" && (
                    <div>
                      <Label className="text-base font-semibold mb-2 block">
                        Payment Proof (Invoice){" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                          <Label
                            htmlFor="payment-proof"
                            className="cursor-pointer"
                          >
                            <span className="text-sm font-medium text-primary hover:underline">
                              Upload payment proof image
                            </span>
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            JPG or PNG files up to 5MB
                          </p>
                          <Input
                            id="payment-proof"
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>
                        {paymentProofFile && (
                          <div className="mt-4 flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <FileText className="h-5 w-5 text-green-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-green-800">
                                {paymentProofFile.name}
                              </p>
                              <p className="text-xs text-green-600">
                                {(paymentProofFile.size / 1024 / 1024).toFixed(
                                  2
                                )}{" "}
                                MB
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setPaymentProofFile(null)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                    className={`flex items-start gap-3 p-4 rounded-lg border ${
                      action === "approve"
                        ? "bg-green-50 border-green-200"
                        : action === "reject"
                        ? "bg-red-50 border-red-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <AlertCircle
                      className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
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
                        {action === "pending" && "Payment Confirmation"}
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
                          `This will reject the payment request and notify the vendor. They can resubmit after addressing the issues.`}
                        {action === "pending" &&
                          `This will mark the payment as completed and notify the vendor. This action cannot be undone.`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={action ? () => setAction(null) : handleClose}
            disabled={isSubmitting}
          >
            {action ? "Back" : "Close"}
          </Button>
          {action && (
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting || (action === "pending" && !paymentProofFile)
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

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import {
//   AlertCircle,
//   Calendar,
//   CheckCircle,
//   DollarSign,
//   FileText,
//   Upload,
//   User,
//   XCircle,
//   Building,
// } from "lucide-react";
// import { useState } from "react";
// import { toast } from "sonner";
// import { Button } from "@/components/UI/button";
// import { Card, CardContent } from "@/components/UI/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/UI/dialog";
// import { Textarea } from "@/components/UI/textarea";
// import { formatCurrency, formatDate } from "@/lib/utils/helpers";
// import { Label } from "../UI/label";
// import { Input } from "../UI/input";
// import { Badge } from "../UI/badge";
// import {
//   getStatusBadgeVariant,
//   getStatusDisplayText,
// } from "@/lib/utils/helpers";
// import { useAdminPayRequestInVoiceUploadMutation } from "@/redux/features/admin/adminPaymentrequest";

// interface PaymentApprovalDialogProps {
//   paymentRequest: any | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onUpdate: () => void;
// }

// export default function PaymentApprovalDialog({
//   paymentRequest,
//   isOpen,
//   onClose,
//   onUpdate,
// }: PaymentApprovalDialogProps) {
//   const [action, setAction] = useState<"approve" | "reject" | "pending" | null>(
//     null
//   );
//   const [adminNotes, setAdminNotes] = useState("");
//   const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [updateInvoiceDetails] = useAdminPayRequestInVoiceUploadMutation();

//   const handleClose = () => {
//     setAction(null);
//     setAdminNotes("");
//     setPaymentProofFile(null);
//     onClose();
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       if (!file.type.includes("image")) {
//         toast.error("Please upload an image file (JPG, PNG)");
//         return;
//       }

//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("File size must be less than 5MB");
//         return;
//       }

//       setPaymentProofFile(file);
//       toast.success("File selected successfully");
//     }
//   };

//   const handleSubmit = async () => {
//     if (!paymentRequest || !action) return;

//     if (action === "pending" && !paymentProofFile) {
//       toast.error("Please upload payment proof image");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Create form data for API call
//       const formData = new FormData();

//       console.log(action);

//       // Append the image file if exists
//       if (paymentProofFile) {
//         formData.append("invoiceImage", paymentProofFile);
//       }

//       // Append admin notes
//       if (adminNotes.trim()) {
//         formData.append("note", adminNotes.trim());
//       }
//       // Call the mutation for pay action
//       if (action === "approve") {
//         const response = await updateInvoiceDetails({
//           paymentId: paymentRequest._id,
//           data: formData,
//         }).unwrap();

//         console.log("API Response:", response);
//       }

//       const actionText =
//         action === "approve"
//           ? "approved"
//           : action === "reject"
//           ? "rejected"
//           : "marked as paid";

//       toast.success(`Payment request ${actionText}`, {
//         description: `Request ${paymentRequest._id} has been ${actionText}`,
//       });

//       onUpdate();
//       handleClose();
//     } catch (error: any) {
//       console.error("API Error:", error);
//       toast.error("Failed to update payment request", {
//         description: error?.data?.message || "Please try again later",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!paymentRequest) return null;

//   const getActionTitle = () => {
//     switch (action) {
//       case "approve":
//         return "Approve Payment Request";
//       case "reject":
//         return "Reject Payment Request";
//       case "pending":
//         return "Mark Payment as Completed";
//       default:
//         return "Payment Request Details";
//     }
//   };

//   const getActionDescription = () => {
//     switch (action) {
//       case "approve":
//         return `Approve payment request ${
//           paymentRequest._id
//         } for ${formatCurrency(paymentRequest.withdrawalAmount)}`;
//       case "reject":
//         return `Reject payment request ${paymentRequest._id} and notify vendor`;
//       case "pending":
//         return `Mark payment request ${paymentRequest._id} as paid and complete the process`;
//       default:
//         return `Manage payment request ${paymentRequest._id}`;
//     }
//   };

//   const getActionIcon = () => {
//     switch (action) {
//       case "approve":
//         return <CheckCircle className="h-5 w-5 text-green-600" />;
//       case "reject":
//         return <XCircle className="h-5 w-5 text-red-600" />;
//       case "pending":
//         return <DollarSign className="h-5 w-5 text-blue-600" />;
//       default:
//         return <FileText className="h-5 w-5 text-gray-600" />;
//     }
//   };

//   const getAvailableActions = () => {
//     switch (paymentRequest.status) {
//       case "pending":
//         return ["approve", "reject"];
//       case "approved":
//         return ["pay", "reject"];
//       case "paid":
//         return [];
//       case "rejected":
//         return ["approve"];
//       default:
//         return [];
//     }
//   };

//   const availableActions = getAvailableActions();
//   const { variant, className } = getStatusBadgeVariant(paymentRequest.status);

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             {getActionIcon()}
//             {getActionTitle()}
//           </DialogTitle>
//           <DialogDescription>{getActionDescription()}</DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Payment Request Details */}
//           <Card>
//             <CardContent className="pt-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-lg font-semibold">
//                     Payment Request #{paymentRequest._id}
//                   </h3>
//                   <Badge variant={variant} className={className}>
//                     {getStatusDisplayText(paymentRequest.status)}
//                   </Badge>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-2xl font-bold text-green-600">
//                     {formatCurrency(paymentRequest.withdrawalAmount)}
//                   </p>
//                   <p className="text-sm text-muted-foreground">
//                     Withdrawal Amount
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Bank Information */}
//                 <div className="space-y-4">
//                   <h4 className="font-semibold flex items-center gap-2">
//                     <Building className="h-4 w-4" />
//                     Bank Information
//                   </h4>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Bank Name:</span>
//                       <span className="font-medium">
//                         {paymentRequest.bankName}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">
//                         Account Number:
//                       </span>
//                       <span className="font-medium">
//                         {paymentRequest.accountNumber}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">
//                         Account Type:
//                       </span>
//                       <span className="font-medium capitalize">
//                         {paymentRequest.accountType}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Contact Information */}
//                 <div className="space-y-4">
//                   <h4 className="font-semibold flex items-center gap-2">
//                     <User className="h-4 w-4" />
//                     Contact Information
//                   </h4>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Phone:</span>
//                       <span className="font-medium">
//                         {paymentRequest.phoneNumber}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Seller ID:</span>
//                       <span className="font-medium text-xs">
//                         {paymentRequest.seller}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Dates Information */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="h-4 w-4 text-muted-foreground" />
//                   <div>
//                     <p className="text-sm font-medium">Request Date</p>
//                     <p className="text-sm text-muted-foreground">
//                       {formatDate(paymentRequest.requestDate)}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Calendar className="h-4 w-4 text-muted-foreground" />
//                   <div>
//                     <p className="text-sm font-medium">Created At</p>
//                     <p className="text-sm text-muted-foreground">
//                       {formatDate(paymentRequest.createdAt)}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Calendar className="h-4 w-4 text-muted-foreground" />
//                   <div>
//                     <p className="text-sm font-medium">Updated At</p>
//                     <p className="text-sm text-muted-foreground">
//                       {formatDate(paymentRequest.updatedAt)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Action Selection */}
//           {!action && availableActions.length > 0 && (
//             <Card>
//               <CardContent className="pt-6">
//                 <h4 className="font-semibold mb-4">Manage Payment Request</h4>
//                 <div className="grid grid-cols-2 gap-4">
//                   {availableActions.includes("approve") && (
//                     <Button
//                       variant="outline"
//                       onClick={() => setAction("approve")}
//                       className="h-auto p-4 flex flex-col items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
//                     >
//                       <CheckCircle className="h-6 w-6" />
//                       <span className="font-medium">Approve</span>
//                       <span className="text-xs text-muted-foreground">
//                         Approve for payment processing
//                       </span>
//                     </Button>
//                   )}

//                   {availableActions.includes("reject") && (
//                     <Button
//                       variant="outline"
//                       onClick={() => setAction("reject")}
//                       className="h-auto p-4 flex flex-col items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
//                     >
//                       <XCircle className="h-6 w-6" />
//                       <span className="font-medium">Reject</span>
//                       <span className="text-xs text-muted-foreground">
//                         Decline this request
//                       </span>
//                     </Button>
//                   )}

//                   {availableActions.includes("pending") && (
//                     <Button
//                       variant="outline"
//                       onClick={() => setAction("pending")}
//                       className="h-auto p-4 flex flex-col items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
//                     >
//                       <DollarSign className="h-6 w-6" />
//                       <span className="font-medium">Mark as Paid</span>
//                       <span className="text-xs text-muted-foreground">
//                         Payment completed
//                       </span>
//                     </Button>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* No Actions Available */}
//           {!action && availableActions.length === 0 && (
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="text-center py-4">
//                   <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
//                   <p className="font-medium">No actions available</p>
//                   <p className="text-sm text-muted-foreground">
//                     This payment request is already {paymentRequest.status} and
//                     cannot be modified.
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Action Forms */}
//           {action && (
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="space-y-4">
//                   {/* Admin Notes */}
//                   <div>
//                     <Label
//                       htmlFor="admin-notes"
//                       className="text-base font-semibold"
//                     >
//                       Admin Notes (Optional)
//                     </Label>
//                     <Textarea
//                       id="admin-notes"
//                       placeholder={
//                         action === "approve"
//                           ? "Add any notes for approval..."
//                           : action === "reject"
//                           ? "Add notes for internal records..."
//                           : "Add notes about the payment..."
//                       }
//                       value={adminNotes}
//                       onChange={(e) => setAdminNotes(e.target.value)}
//                       className="mt-2"
//                     />
//                   </div>

//                   {/* Payment Proof Upload - Only for pay action */}
//                   {action === "approve" && (
//                     <div>
//                       <Label className="text-base font-semibold mb-2 block">
//                         Payment Proof (Invoice){" "}
//                         <span className="text-red-500">*</span>
//                       </Label>
//                       <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
//                         <div className="text-center">
//                           <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
//                           <Label
//                             htmlFor="payment-proof"
//                             className="cursor-pointer"
//                           >
//                             <span className="text-sm font-medium text-primary hover:underline">
//                               Upload payment proof image
//                             </span>
//                           </Label>
//                           <p className="text-xs text-muted-foreground mt-1">
//                             JPG or PNG files up to 5MB
//                           </p>
//                           <Input
//                             id="payment-proof"
//                             type="file"
//                             accept=".jpg,.jpeg,.png"
//                             onChange={handleFileChange}
//                             className="hidden"
//                           />
//                         </div>
//                         {paymentProofFile && (
//                           <div className="mt-4 flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
//                             <FileText className="h-5 w-5 text-green-600" />
//                             <div className="flex-1">
//                               <p className="text-sm font-medium text-green-800">
//                                 {paymentProofFile.name}
//                               </p>
//                               <p className="text-xs text-green-600">
//                                 {(paymentProofFile.size / 1024 / 1024).toFixed(
//                                   2
//                                 )}{" "}
//                                 MB
//                               </p>
//                             </div>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => setPaymentProofFile(null)}
//                               className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                             >
//                               Remove
//                             </Button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Action Confirmation */}
//                   <div
//                     className={`flex items-start gap-3 p-4 rounded-lg border ${
//                       action === "approve"
//                         ? "bg-green-50 border-green-200"
//                         : action === "reject"
//                         ? "bg-red-50 border-red-200"
//                         : "bg-blue-50 border-blue-200"
//                     }`}
//                   >
//                     <AlertCircle
//                       className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
//                         action === "approve"
//                           ? "text-green-600"
//                           : action === "reject"
//                           ? "text-red-600"
//                           : "text-blue-600"
//                       }`}
//                     />
//                     <div className="text-sm">
//                       <p
//                         className={`font-medium ${
//                           action === "approve"
//                             ? "text-green-800"
//                             : action === "reject"
//                             ? "text-red-800"
//                             : "text-blue-800"
//                         }`}
//                       >
//                         {action === "approve" && "Approval Confirmation"}
//                         {action === "reject" && "Rejection Confirmation"}
//                         {action === "pending" && "Payment Confirmation"}
//                       </p>
//                       <p
//                         className={`mt-1 ${
//                           action === "approve"
//                             ? "text-green-700"
//                             : action === "reject"
//                             ? "text-red-700"
//                             : "text-blue-700"
//                         }`}
//                       >
//                         {action === "approve" &&
//                           `This will approve the payment request and notify the vendor. The vendor will expect payment within 3-5 business days.`}
//                         {action === "reject" &&
//                           `This will reject the payment request and notify the vendor. They can resubmit after addressing the issues.`}
//                         {action === "pending" &&
//                           `This will mark the payment as completed and notify the vendor. This action cannot be undone.`}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         <DialogFooter>
//           <Button
//             variant="outline"
//             onClick={action ? () => setAction(null) : handleClose}
//             disabled={isSubmitting}
//           >
//             {action ? "Back" : "Close"}
//           </Button>
//           {action && (
//             <Button
//               onClick={handleSubmit}
//               disabled={
//                 isSubmitting || (action === "pending" && !paymentProofFile)
//               }
//               className={
//                 action === "approve"
//                   ? "bg-green-600 hover:bg-green-700"
//                   : action === "reject"
//                   ? "bg-red-600 hover:bg-red-700"
//                   : "bg-blue-600 hover:bg-blue-700"
//               }
//             >
//               {isSubmitting
//                 ? "Processing..."
//                 : action === "approve"
//                 ? "Approve Request"
//                 : action === "reject"
//                 ? "Reject Request"
//                 : "Mark as Paid"}
//             </Button>
//           )}
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import {
//   AlertCircle,
//   Calendar,
//   CheckCircle,
//   DollarSign,
//   FileText,
//   Upload,
//   User,
//   XCircle,
//   Building,
// } from "lucide-react";
// import { useState } from "react";
// import { toast } from "sonner";
// import { Button } from "@/components/UI/button";
// import { Card, CardContent } from "@/components/UI/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/UI/dialog";
// import { Textarea } from "@/components/UI/textarea";
// import { formatCurrency, formatDate } from "@/lib/utils/helpers";

// import { Label } from "../UI/label";
// import { Input } from "../UI/input";
// import { Badge } from "../UI/badge";
// import {
//   getStatusBadgeVariant,
//   getStatusDisplayText,
// } from "@/lib/utils/helpers";
// import { useAdminPayRequestInVoiceUploadMutation } from "@/redux/features/admin/adminPaymentrequest";

// interface PaymentApprovalDialogProps {
//   paymentRequest: any | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onUpdate: () => void;
// }

// export default function PaymentApprovalDialog({
//   paymentRequest,
//   isOpen,
//   onClose,
//   onUpdate,
// }: PaymentApprovalDialogProps) {
//   const [action, setAction] = useState<"approve" | "reject" | "pay" | null>(
//     null
//   );
//   const [adminNotes, setAdminNotes] = useState("");
//   const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [updateInvoiceDetails] = useAdminPayRequestInVoiceUploadMutation();
//   const handleClose = () => {
//     setAction(null);
//     setAdminNotes("");
//     setPaymentProofFile(null);
//     onClose();
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       // Validate file type - only images
//       if (!file.type.includes("image")) {
//         toast.error("Please upload an image file (JPG, PNG)");
//         return;
//       }

//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("File size must be less than 5MB");
//         return;
//       }

//       setPaymentProofFile(file);
//       toast.success("File selected successfully");
//     }
//   };

//   const handleSubmit = async () => {
//     if (!paymentRequest || !action) return;

//     if (action === "pay" && !paymentProofFile) {
//       toast.error("Please upload payment proof image");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Create form data for submission
//       const formData = new FormData();

//       // Add basic data
//       formData.append("paymentRequestId", paymentRequest._id);
//       formData.append("action", action);
//       formData.append(
//         "status",
//         action === "pay"
//           ? "paid"
//           : action === "approve"
//           ? "approved"
//           : "rejected"
//       );

//       const res = await updateInvoiceDetails({
//         paymentId: paymentRequest._id,
//         data: "",
//       });
//       console.log();

//       // Add notes if provided
//       if (adminNotes.trim()) {
//         formData.append("adminNotes", adminNotes.trim());
//       }

//       // Add payment proof file if exists
//       if (action === "pay" && paymentProofFile) {
//         formData.append("paymentProof", paymentProofFile);
//       }

//       // Log form data (as requested)
//       console.log("Form Data:", {
//         paymentRequestId: paymentRequest._id,
//         action: action,
//         status:
//           action === "pay"
//             ? "paid"
//             : action === "approve"
//             ? "approved"
//             : "rejected",
//         adminNotes: adminNotes.trim(),
//         paymentProof: action === "pay" ? paymentProofFile?.name : undefined,
//       });

//       // Here you would typically send the formData to your API
//       // For now, we'll simulate an API call
//       // await yourAPI.updatePaymentRequest(formData);

//       // Simulate API delay
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       const actionText =
//         action === "approve"
//           ? "approved"
//           : action === "reject"
//           ? "rejected"
//           : "marked as paid";

//       toast.success(`Payment request ${actionText}`, {
//         description: `Request ${paymentRequest._id} has been ${actionText}`,
//       });

//       onUpdate();
//       handleClose();
//     } catch (_error) {
//       toast.error("Failed to update payment request", {
//         description: "Please try again later",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!paymentRequest) return null;

//   const getActionTitle = () => {
//     switch (action) {
//       case "approve":
//         return "Approve Payment Request";
//       case "reject":
//         return "Reject Payment Request";
//       case "pay":
//         return "Mark Payment as Completed";
//       default:
//         return "Payment Request Details";
//     }
//   };

//   const getActionDescription = () => {
//     switch (action) {
//       case "approve":
//         return `Approve payment request ${
//           paymentRequest._id
//         } for ${formatCurrency(paymentRequest.withdrawalAmount)}`;
//       case "reject":
//         return `Reject payment request ${paymentRequest._id} and notify vendor`;
//       case "pay":
//         return `Mark payment request ${paymentRequest._id} as paid and complete the process`;
//       default:
//         return `Manage payment request ${paymentRequest._id}`;
//     }
//   };

//   const getActionIcon = () => {
//     switch (action) {
//       case "approve":
//         return <CheckCircle className="h-5 w-5 text-green-600" />;
//       case "reject":
//         return <XCircle className="h-5 w-5 text-red-600" />;
//       case "pay":
//         return <DollarSign className="h-5 w-5 text-blue-600" />;
//       default:
//         return <FileText className="h-5 w-5 text-gray-600" />;
//     }
//   };

//   const getAvailableActions = () => {
//     switch (paymentRequest.status) {
//       case "pending":
//         return ["approve", "reject"];
//       case "approved":
//         return ["pay", "reject"];
//       case "paid":
//         return []; // No actions for paid requests
//       case "rejected":
//         return ["approve"]; // Allow approving rejected requests
//       default:
//         return [];
//     }
//   };

//   const availableActions = getAvailableActions();
//   const { variant, className } = getStatusBadgeVariant(paymentRequest.status);

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             {getActionIcon()}
//             {getActionTitle()}
//           </DialogTitle>
//           <DialogDescription>{getActionDescription()}</DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Payment Request Details */}
//           <Card>
//             <CardContent className="pt-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-lg font-semibold">
//                     Payment Request #{paymentRequest._id}
//                   </h3>
//                   <Badge variant={variant} className={className}>
//                     {getStatusDisplayText(paymentRequest.status)}
//                   </Badge>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-2xl font-bold text-green-600">
//                     {formatCurrency(paymentRequest.withdrawalAmount)}
//                   </p>
//                   <p className="text-sm text-muted-foreground">
//                     Withdrawal Amount
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Bank Information */}
//                 <div className="space-y-4">
//                   <h4 className="font-semibold flex items-center gap-2">
//                     <Building className="h-4 w-4" />
//                     Bank Information
//                   </h4>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Bank Name:</span>
//                       <span className="font-medium">
//                         {paymentRequest.bankName}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">
//                         Account Number:
//                       </span>
//                       <span className="font-medium">
//                         {paymentRequest.accountNumber}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">
//                         Account Type:
//                       </span>
//                       <span className="font-medium capitalize">
//                         {paymentRequest.accountType}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Contact Information */}
//                 <div className="space-y-4">
//                   <h4 className="font-semibold flex items-center gap-2">
//                     <User className="h-4 w-4" />
//                     Contact Information
//                   </h4>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Phone:</span>
//                       <span className="font-medium">
//                         {paymentRequest.phoneNumber}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Seller ID:</span>
//                       <span className="font-medium text-xs">
//                         {paymentRequest.seller}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Dates Information */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="h-4 w-4 text-muted-foreground" />
//                   <div>
//                     <p className="text-sm font-medium">Request Date</p>
//                     <p className="text-sm text-muted-foreground">
//                       {formatDate(paymentRequest.requestDate)}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Calendar className="h-4 w-4 text-muted-foreground" />
//                   <div>
//                     <p className="text-sm font-medium">Created At</p>
//                     <p className="text-sm text-muted-foreground">
//                       {formatDate(paymentRequest.createdAt)}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Calendar className="h-4 w-4 text-muted-foreground" />
//                   <div>
//                     <p className="text-sm font-medium">Updated At</p>
//                     <p className="text-sm text-muted-foreground">
//                       {formatDate(paymentRequest.updatedAt)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Action Selection */}
//           {!action && availableActions.length > 0 && (
//             <Card>
//               <CardContent className="pt-6">
//                 <h4 className="font-semibold mb-4">Manage Payment Request</h4>
//                 <div className="grid grid-cols-2 gap-4">
//                   {availableActions.includes("approve") && (
//                     <Button
//                       variant="outline"
//                       onClick={() => setAction("approve")}
//                       className="h-auto p-4 flex flex-col items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
//                     >
//                       <CheckCircle className="h-6 w-6" />
//                       <span className="font-medium">Approve</span>
//                       <span className="text-xs text-muted-foreground">
//                         Approve for payment processing
//                       </span>
//                     </Button>
//                   )}

//                   {availableActions.includes("reject") && (
//                     <Button
//                       variant="outline"
//                       onClick={() => setAction("reject")}
//                       className="h-auto p-4 flex flex-col items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
//                     >
//                       <XCircle className="h-6 w-6" />
//                       <span className="font-medium">Reject</span>
//                       <span className="text-xs text-muted-foreground">
//                         Decline this request
//                       </span>
//                     </Button>
//                   )}

//                   {availableActions.includes("pay") && (
//                     <Button
//                       variant="outline"
//                       onClick={() => setAction("pay")}
//                       className="h-auto p-4 flex flex-col items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
//                     >
//                       <DollarSign className="h-6 w-6" />
//                       <span className="font-medium">Mark as Paid</span>
//                       <span className="text-xs text-muted-foreground">
//                         Payment completed
//                       </span>
//                     </Button>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* No Actions Available */}
//           {!action && availableActions.length === 0 && (
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="text-center py-4">
//                   <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
//                   <p className="font-medium">No actions available</p>
//                   <p className="text-sm text-muted-foreground">
//                     This payment request is already {paymentRequest.status} and
//                     cannot be modified.
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Action Forms */}
//           {action && (
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="space-y-4">
//                   {/* Admin Notes (Optional for all actions) */}
//                   <div>
//                     <Label
//                       htmlFor="admin-notes"
//                       className="text-base font-semibold"
//                     >
//                       Admin Notes {action === "reject" ? "" : "(Optional)"}
//                     </Label>
//                     <Textarea
//                       id="admin-notes"
//                       placeholder={
//                         action === "approve"
//                           ? "Add any notes for approval..."
//                           : action === "reject"
//                           ? "Add notes for internal records..."
//                           : "Add notes about the payment..."
//                       }
//                       value={adminNotes}
//                       onChange={(e) => setAdminNotes(e.target.value)}
//                       className="mt-2"
//                     />
//                   </div>

//                   {/* Payment Proof Upload (Required for pay) */}
//                   {action === "approve" && (
//                     <div>
//                       <Label className="text-base font-semibold mb-2 block">
//                         Payment Proof (Invoice){" "}
//                         <span className="text-red-500">*</span>
//                       </Label>
//                       <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
//                         <div className="text-center">
//                           <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
//                           <Label
//                             htmlFor="payment-proof"
//                             className="cursor-pointer"
//                           >
//                             <span className="text-sm font-medium text-primary hover:underline">
//                               Upload payment proof image
//                             </span>
//                           </Label>
//                           <p className="text-xs text-muted-foreground mt-1">
//                             JPG or PNG files up to 5MB
//                           </p>
//                           <Input
//                             id="payment-proof"
//                             type="file"
//                             accept=".jpg,.jpeg,.png"
//                             onChange={handleFileChange}
//                             className="hidden"
//                           />
//                         </div>
//                         {paymentProofFile && (
//                           <div className="mt-4 flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
//                             <FileText className="h-5 w-5 text-green-600" />
//                             <div className="flex-1">
//                               <p className="text-sm font-medium text-green-800">
//                                 {paymentProofFile.name}
//                               </p>
//                               <p className="text-xs text-green-600">
//                                 {(paymentProofFile.size / 1024 / 1024).toFixed(
//                                   2
//                                 )}{" "}
//                                 MB
//                               </p>
//                             </div>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => setPaymentProofFile(null)}
//                               className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                             >
//                               Remove
//                             </Button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Action Confirmation */}
//                   <div
//                     className={`flex items-start gap-3 p-4 rounded-lg border ${
//                       action === "approve"
//                         ? "bg-green-50 border-green-200"
//                         : action === "reject"
//                         ? "bg-red-50 border-red-200"
//                         : "bg-blue-50 border-blue-200"
//                     }`}
//                   >
//                     <AlertCircle
//                       className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
//                         action === "approve"
//                           ? "text-green-600"
//                           : action === "reject"
//                           ? "text-red-600"
//                           : "text-blue-600"
//                       }`}
//                     />
//                     <div className="text-sm">
//                       <p
//                         className={`font-medium ${
//                           action === "approve"
//                             ? "text-green-800"
//                             : action === "reject"
//                             ? "text-red-800"
//                             : "text-blue-800"
//                         }`}
//                       >
//                         {action === "approve" && "Approval Confirmation"}
//                         {action === "reject" && "Rejection Confirmation"}
//                         {action === "pay" && "Payment Confirmation"}
//                       </p>
//                       <p
//                         className={`mt-1 ${
//                           action === "approve"
//                             ? "text-green-700"
//                             : action === "reject"
//                             ? "text-red-700"
//                             : "text-blue-700"
//                         }`}
//                       >
//                         {action === "approve" &&
//                           `This will approve the payment request and notify the vendor. The vendor will expect payment within 3-5 business days.`}
//                         {action === "reject" &&
//                           `This will reject the payment request and notify the vendor with the provided reason. They can resubmit after addressing the issues.`}
//                         {action === "pay" &&
//                           `This will mark the payment as completed and notify the vendor. This action cannot be undone.`}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         <DialogFooter>
//           <Button
//             variant="outline"
//             onClick={action ? () => setAction(null) : handleClose}
//             disabled={isSubmitting}
//           >
//             {action ? "Back" : "Close"}
//           </Button>
//           {action && (
//             <Button
//               onClick={handleSubmit}
//               disabled={
//                 isSubmitting ||
//                 (action === "reject" && !adminNotes.trim()) ||
//                 (action === "pay" && !paymentProofFile)
//               }
//               className={
//                 action === "approve"
//                   ? "bg-green-600 hover:bg-green-700"
//                   : action === "reject"
//                   ? "bg-red-600 hover:bg-red-700"
//                   : "bg-blue-600 hover:bg-blue-700"
//               }
//             >
//               {isSubmitting
//                 ? "Processing..."
//                 : action === "approve"
//                 ? "Approve Request"
//                 : action === "reject"
//                 ? "Reject Request"
//                 : "Mark as Paid"}
//             </Button>
//           )}
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
