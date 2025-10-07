"use client";

import { AlertCircle, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/UI/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Textarea } from "@/components/UI/textarea";
import { Select, Input as AntInput, InputNumber } from "antd";
import {
  useCreatePaymentRequestMutation,
  useMyeligableRequestQuery,
} from "@/redux/features/vendors/paymentRequest";

const { Option } = Select;

interface PaymentRequestFormProps {
  vendorId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

type AccountType = "savings" | "current" | "checking" | "other";

interface PaymentRequestData {
  bankName: string;
  accountNumber: string;
  accountType: AccountType;
  phoneNumber: string;
  withdrawalAmount: number;
  notes: string;
}

export default function PaymentRequestForm({
  vendorId,
  onSuccess,
  onCancel,
}: PaymentRequestFormProps) {
  const { data: eligableWithDrawl, isLoading: withdrawlLoading } =
    useMyeligableRequestQuery({});

  const [formData, setFormData] = useState<PaymentRequestData>({
    bankName: "",
    accountNumber: "",
    accountType: "savings",
    phoneNumber: "",
    withdrawalAmount: 0,
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [createPayReq] = useCreatePaymentRequestMutation();

  // Get available withdrawal amount from API response
  const availableWithdrawal =
    eligableWithDrawl?.data?.attributes?.availableWithdrawl || 0;
  const minimumWithdrawal = 100;
  const isEligibleForWithdrawal = availableWithdrawal >= minimumWithdrawal;

  // Reset withdrawal amount when available withdrawal changes
  useEffect(() => {
    if (formData.withdrawalAmount > availableWithdrawal) {
      setFormData((prev) => ({
        ...prev,
        withdrawalAmount: availableWithdrawal,
      }));
    }
  }, [availableWithdrawal]);

  const handleInputChange = (
    field: keyof PaymentRequestData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!isEligibleForWithdrawal) {
      errors.push(
        `Minimum withdrawal amount is AED ${minimumWithdrawal}. You need AED ${
          minimumWithdrawal - availableWithdrawal
        } more to be eligible.`
      );
    }

    if (!formData.bankName.trim()) {
      errors.push("Bank name is required");
    }

    if (!formData.accountNumber.trim()) {
      errors.push("Account number is required");
    } else if (!/^\d+$/.test(formData.accountNumber)) {
      errors.push("Account number must contain only numbers");
    }

    if (!formData.phoneNumber.trim()) {
      errors.push("Phone number is required");
    }

    if (!formData.withdrawalAmount || formData.withdrawalAmount <= 0) {
      errors.push("Withdrawal amount must be greater than 0");
    } else if (formData.withdrawalAmount > availableWithdrawal) {
      errors.push(
        `Withdrawal amount cannot exceed available balance of AED ${availableWithdrawal}`
      );
    } else if (formData.withdrawalAmount < minimumWithdrawal) {
      errors.push(`Minimum withdrawal amount is AED ${minimumWithdrawal}`);
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createPayReq(formData);

      toast.success("Payment request submitted successfully", {
        description: "Your withdrawal request has been processed",
      });

      onSuccess();
    } catch (_error) {
      toast.error("Failed to submit payment request", {
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency display
  const formatCurrency = (amount: number) => {
    return `AED ${amount.toFixed(2)}`;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Request</CardTitle>
          <CardDescription>
            Enter your bank details and withdrawal amount
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Eligibility Banner */}
          {!isEligibleForWithdrawal && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-red-800">
                  Not Eligible for Withdrawal
                </p>
                <p className="text-red-700 mt-1">
                  You need at least {formatCurrency(minimumWithdrawal)} to make
                  a withdrawal. Current available balance:{" "}
                  <strong>{formatCurrency(availableWithdrawal)}</strong>
                </p>
              </div>
            </div>
          )}

          {/* Available Balance Info */}
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Available for Withdrawal:
              </span>
            </div>
            <span className="text-lg font-bold text-blue-800">
              {formatCurrency(availableWithdrawal)}
            </span>
          </div>

          {/* Bank Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bank Name */}
            <div className="space-y-2">
              <Label htmlFor="bankName" className="text-base font-semibold">
                Bank Name *
              </Label>
              <AntInput
                id="bankName"
                placeholder="Enter bank name"
                value={formData.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                size="large"
                disabled={!isEligibleForWithdrawal}
              />
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label
                htmlFor="accountNumber"
                className="text-base font-semibold"
              >
                Account Number *
              </Label>
              <AntInput
                id="accountNumber"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={(e) =>
                  handleInputChange("accountNumber", e.target.value)
                }
                size="large"
                maxLength={20}
                disabled={!isEligibleForWithdrawal}
              />
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label htmlFor="accountType" className="text-base font-semibold">
                Account Type *
              </Label>
              <Select
                value={formData.accountType}
                onChange={(value: AccountType) =>
                  handleInputChange("accountType", value)
                }
                size="large"
                style={{ width: "100%" }}
                disabled={!isEligibleForWithdrawal}
              >
                <Option value="savings">Savings</Option>
                <Option value="current">Current</Option>
                <Option value="checking">Checking</Option>
                <Option value="other">Other</Option>
              </Select>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-base font-semibold">
                Phone Number *
              </Label>
              <AntInput
                id="phoneNumber"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                size="large"
                disabled={!isEligibleForWithdrawal}
              />
            </div>
          </div>

          {/* Withdrawal Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="withdrawalAmount"
                className="text-base font-semibold"
              >
                Withdrawal Amount *
              </Label>
              <span className="text-sm text-muted-foreground">
                Max: {formatCurrency(availableWithdrawal)}
              </span>
            </div>
            <InputNumber
              id="withdrawalAmount"
              placeholder="AED 0.00"
              value={formData.withdrawalAmount}
              onChange={(value) =>
                handleInputChange("withdrawalAmount", value || 0)
              }
              style={{ width: "100%" }}
              size="large"
              min={0}
              max={availableWithdrawal}
              step={0.01}
              disabled={!isEligibleForWithdrawal}
              formatter={(value) =>
                `AED ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                value?.replace(/AED\s?|(,*)/g, "") as unknown as number
              }
            />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Minimum: {formatCurrency(minimumWithdrawal)}
              </span>
              <span
                className={
                  formData.withdrawalAmount > availableWithdrawal
                    ? "text-red-600 font-medium"
                    : "text-green-600 font-medium"
                }
              >
                Remaining:{" "}
                {formatCurrency(
                  availableWithdrawal - formData.withdrawalAmount
                )}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-semibold">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any notes or comments for this withdrawal request..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="mt-2"
              maxLength={500}
              disabled={!isEligibleForWithdrawal}
            />
            <p className="text-sm text-muted-foreground mt-1">
              {formData.notes.length}/500 characters
            </p>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Processing Time</p>
              <p className="text-yellow-700 mt-1">
                Withdrawal requests are typically processed within 1-2 business
                days. Please ensure all bank details are accurate.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setShowPreview(true)}
              disabled={isSubmitting || !isEligibleForWithdrawal}
              className="flex-1"
            >
              Review & Submit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Withdrawal Request</DialogTitle>
            <DialogDescription>
              Please review your withdrawal details before submitting
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">
                  Bank Name
                </h4>
                <p className="text-base">{formData.bankName}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">
                  Account Number
                </h4>
                <p className="text-base">{formData.accountNumber}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">
                  Account Type
                </h4>
                <p className="text-base capitalize">{formData.accountType}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">
                  Phone Number
                </h4>
                <p className="text-base">{formData.phoneNumber}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold text-sm text-muted-foreground">
                Withdrawal Amount
              </h4>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(formData.withdrawalAmount)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Available balance after withdrawal:{" "}
                {formatCurrency(
                  availableWithdrawal - formData.withdrawalAmount
                )}
              </p>
            </div>

            {formData.notes && (
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">
                  Notes
                </h4>
                <p className="text-sm bg-muted p-3 rounded-lg">
                  {formData.notes}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Back to Edit
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !isEligibleForWithdrawal}
            >
              {isSubmitting ? "Processing..." : "Confirm Withdrawal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// "use client";

// import { AlertCircle, DollarSign } from "lucide-react";
// import { useState } from "react";
// import { toast } from "sonner";
// import { Button } from "@/components/UI/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/UI/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/UI/dialog";
// import { Input } from "@/components/UI/input";
// import { Label } from "@/components/UI/label";
// import { Textarea } from "@/components/UI/textarea";
// import { Select, Input as AntInput, InputNumber } from "antd";
// import { useCreatePaymentRequestMutation } from "@/redux/features/vendors/paymentRequest";

// const { Option } = Select;

// interface PaymentRequestFormProps {
//   vendorId: string;
//   onSuccess: () => void;
//   onCancel: () => void;
// }

// type AccountType = "savings" | "current" | "checking" | "other";

// interface PaymentRequestData {
//   bankName: string;
//   accountNumber: string;
//   accountType: AccountType;
//   phoneNumber: string;
//   withdrawalAmount: number;
//   notes: string;
// }

// export default function PaymentRequestForm({
//   vendorId,
//   onSuccess,
//   onCancel,
// }: PaymentRequestFormProps) {
//   const [formData, setFormData] = useState<PaymentRequestData>({
//     bankName: "",
//     accountNumber: "",
//     accountType: "savings",
//     phoneNumber: "",
//     withdrawalAmount: 0,
//     notes: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPreview, setShowPreview] = useState(false);
//   const [createPayReq] = useCreatePaymentRequestMutation();

//   const handleInputChange = (
//     field: keyof PaymentRequestData,
//     value: string | number
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const validateForm = (): boolean => {
//     const errors: string[] = [];

//     if (!formData.bankName.trim()) {
//       errors.push("Bank name is required");
//     }

//     if (!formData.accountNumber.trim()) {
//       errors.push("Account number is required");
//     } else if (!/^\d+$/.test(formData.accountNumber)) {
//       errors.push("Account number must contain only numbers");
//     }

//     if (!formData.phoneNumber.trim()) {
//       errors.push("Phone number is required");
//     }

//     if (!formData.withdrawalAmount || formData.withdrawalAmount <= 0) {
//       errors.push("Withdrawal amount must be greater than 0");
//     }

//     if (errors.length > 0) {
//       errors.forEach((error) => toast.error(error));
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const res = await createPayReq(formData);

//       toast.success("Payment request submitted successfully", {
//         description: "Your withdrawal request has been processed",
//       });

//       onSuccess();
//     } catch (_error) {
//       toast.error("Failed to submit payment request", {
//         description: "Please try again later",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle>Withdrawal Request</CardTitle>
//           <CardDescription>
//             Enter your bank details and withdrawal amount
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {/* Bank Details */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Bank Name */}
//             <div className="space-y-2">
//               <Label htmlFor="bankName" className="text-base font-semibold">
//                 Bank Name *
//               </Label>
//               <AntInput
//                 id="bankName"
//                 placeholder="Enter bank name"
//                 value={formData.bankName}
//                 onChange={(e) => handleInputChange("bankName", e.target.value)}
//                 size="large"
//               />
//             </div>

//             {/* Account Number */}
//             <div className="space-y-2">
//               <Label
//                 htmlFor="accountNumber"
//                 className="text-base font-semibold"
//               >
//                 Account Number *
//               </Label>
//               <AntInput
//                 id="accountNumber"
//                 placeholder="Enter account number"
//                 value={formData.accountNumber}
//                 onChange={(e) =>
//                   handleInputChange("accountNumber", e.target.value)
//                 }
//                 size="large"
//                 maxLength={20}
//               />
//             </div>

//             {/* Account Type */}
//             <div className="space-y-2">
//               <Label htmlFor="accountType" className="text-base font-semibold">
//                 Account Type *
//               </Label>
//               <Select
//                 value={formData.accountType}
//                 onChange={(value: AccountType) =>
//                   handleInputChange("accountType", value)
//                 }
//                 size="large"
//                 style={{ width: "100%" }}
//               >
//                 <Option value="savings">Savings</Option>
//                 <Option value="current">Current</Option>
//                 <Option value="checking">Checking</Option>
//                 <Option value="other">Other</Option>
//               </Select>
//             </div>

//             {/* Phone Number */}
//             <div className="space-y-2">
//               <Label htmlFor="phoneNumber" className="text-base font-semibold">
//                 Phone Number *
//               </Label>
//               <AntInput
//                 id="phoneNumber"
//                 placeholder="Enter phone number"
//                 value={formData.phoneNumber}
//                 onChange={(e) =>
//                   handleInputChange("phoneNumber", e.target.value)
//                 }
//                 size="large"
//               />
//             </div>
//           </div>

//           {/* Withdrawal Amount */}
//           <div className="space-y-2">
//             <Label
//               htmlFor="withdrawalAmount"
//               className="text-base font-semibold"
//             >
//               Withdrawal Amount *
//             </Label>
//             <InputNumber
//               id="withdrawalAmount"
//               placeholder="AED 0.00"
//               value={formData.withdrawalAmount}
//               onChange={(value) =>
//                 handleInputChange("withdrawalAmount", value || 0)
//               }
//               style={{ width: "100%" }}
//               size="large"
//               min={0}
//               step={0.01}
//             />
//           </div>

//           {/* Notes */}
//           <div className="space-y-2">
//             <Label htmlFor="notes" className="text-base font-semibold">
//               Notes (Optional)
//             </Label>
//             <Textarea
//               id="notes"
//               placeholder="Add any notes or comments for this withdrawal request..."
//               value={formData.notes}
//               onChange={(e) => handleInputChange("notes", e.target.value)}
//               className="mt-2"
//               maxLength={500}
//             />
//             <p className="text-sm text-muted-foreground mt-1">
//               {formData.notes.length}/500 characters
//             </p>
//           </div>

//           {/* Warning */}
//           <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//             <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
//             <div className="text-sm">
//               <p className="font-medium text-yellow-800">Processing Time</p>
//               <p className="text-yellow-700 mt-1">
//                 Withdrawal requests are typically processed within 1-2 business
//                 days. Please ensure all bank details are accurate.
//               </p>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3 pt-4">
//             <Button
//               variant="outline"
//               onClick={onCancel}
//               disabled={isSubmitting}
//               className="flex-1"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={() => setShowPreview(true)}
//               disabled={isSubmitting}
//               className="flex-1"
//             >
//               Review & Submit
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Preview Dialog */}
//       <Dialog open={showPreview} onOpenChange={setShowPreview}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Review Withdrawal Request</DialogTitle>
//             <DialogDescription>
//               Please review your withdrawal details before submitting
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <h4 className="font-semibold text-sm text-muted-foreground">
//                   Bank Name
//                 </h4>
//                 <p className="text-base">{formData.bankName}</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-sm text-muted-foreground">
//                   Account Number
//                 </h4>
//                 <p className="text-base">{formData.accountNumber}</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-sm text-muted-foreground">
//                   Account Type
//                 </h4>
//                 <p className="text-base capitalize">{formData.accountType}</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-sm text-muted-foreground">
//                   Phone Number
//                 </h4>
//                 <p className="text-base">{formData.phoneNumber}</p>
//               </div>
//             </div>

//             <div className="border-t pt-4">
//               <h4 className="font-semibold text-sm text-muted-foreground">
//                 Withdrawal Amount
//               </h4>
//               <p className="text-2xl font-bold text-green-600">
//                 ${formData.withdrawalAmount.toFixed(2)}
//               </p>
//             </div>

//             {formData.notes && (
//               <div>
//                 <h4 className="font-semibold text-sm text-muted-foreground">
//                   Notes
//                 </h4>
//                 <p className="text-sm bg-muted p-3 rounded-lg">
//                   {formData.notes}
//                 </p>
//               </div>
//             )}
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowPreview(false)}>
//               Back to Edit
//             </Button>
//             <Button onClick={handleSubmit} disabled={isSubmitting}>
//               {isSubmitting ? "Processing..." : "Confirm Withdrawal"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }
