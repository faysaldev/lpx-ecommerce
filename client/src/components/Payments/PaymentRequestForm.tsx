"use client";

import { AlertCircle, DollarSign } from "lucide-react";
import { useState } from "react";
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
      // Log all data to console
      console.log("Payment Request Data:", {
        vendorId,
        ...formData,
        timestamp: new Date().toISOString(),
      });

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
              />
            </div>
          </div>

          {/* Withdrawal Amount */}
          <div className="space-y-2">
            <Label
              htmlFor="withdrawalAmount"
              className="text-base font-semibold"
            >
              Withdrawal Amount *
            </Label>
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
              step={0.01}
            />
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
              disabled={isSubmitting}
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
                ${formData.withdrawalAmount.toFixed(2)}
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
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Confirm Withdrawal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// "use client";

// import { AlertCircle, DollarSign, FileText, Upload } from "lucide-react";
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
// import { Checkbox } from "@/components/UI/checkbox";
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
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/UI/table";
// import { Textarea } from "@/components/UI/textarea";
// // import { PaymentRequestMockAPI } from "@/lib/api/mock/payment-requests";
// import {
//   calculatePaymentAmounts,
//   formatCurrency,
//   formatDate,
//   validatePaymentRequestData,
// } from "@/lib/utils/helpers";

// interface CompletedOrder {
//   id: string;
//   orderNumber: string;
//   customer: {
//     name: string;
//     email: string;
//   };
//   total: number;
//   orderDate: string;
//   items: Array<{
//     productName: string;
//     quantity: number;
//     price: number;
//   }>;
// }

// interface PaymentRequestFormProps {
//   vendorId: string;
//   completedOrders: CompletedOrder[];
//   onSuccess: () => void;
//   onCancel: () => void;
// }

// export default function PaymentRequestForm({
//   vendorId,
//   completedOrders,
//   onSuccess,
//   onCancel,
// }: PaymentRequestFormProps) {
//   const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
//     new Set()
//   );
//   const [notes, setNotes] = useState("");
//   const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPreview, setShowPreview] = useState(false);

//   const selectedOrders = completedOrders.filter((order) =>
//     selectedOrderIds.has(order.id)
//   );

//   const totalAmount = selectedOrders.reduce(
//     (sum, order) => sum + order.total,
//     0
//   );
//   const { commission, netAmount } = calculatePaymentAmounts(totalAmount);

//   const handleOrderSelect = (orderId: string, checked: boolean) => {
//     const newSelection = new Set(selectedOrderIds);
//     if (checked) {
//       newSelection.add(orderId);
//     } else {
//       newSelection.delete(orderId);
//     }
//     setSelectedOrderIds(newSelection);
//   };

//   const handleSelectAll = (checked: boolean) => {
//     if (checked) {
//       setSelectedOrderIds(new Set(completedOrders.map((order) => order.id)));
//     } else {
//       setSelectedOrderIds(new Set());
//     }
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.includes("pdf") && !file.type.includes("image")) {
//         toast.error("Please upload a PDF or image file");
//         return;
//       }

//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("File size must be less than 5MB");
//         return;
//       }

//       setInvoiceFile(file);
//     }
//   };

//   const handleSubmit = async () => {
//     const validation = validatePaymentRequestData({
//       orderIds: Array.from(selectedOrderIds),
//       notes,
//     });

//     if (!validation.isValid) {
//       for (const error of validation.errors) {
//         toast.error(error);
//       }
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // await PaymentRequestMockAPI.createPaymentRequest(vendorId, {
//       //   orderIds: Array.from(selectedOrderIds),
//       //   notes: notes.trim() || undefined,
//       // });

//       toast.success("Payment request submitted successfully", {
//         description: "Your request is now pending admin review",
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

//   const completedOrdersWithoutRequests = completedOrders;

//   if (completedOrdersWithoutRequests.length === 0) {
//     return (
//       <Card>
//         <CardContent className="flex flex-col items-center justify-center py-12">
//           <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
//           <h3 className="text-lg font-semibold mb-2">No Eligible Orders</h3>
//           <p className="text-muted-foreground text-center max-w-md">
//             You don{`'`}t have any completed orders that haven{`'`}t been
//             included in a payment request yet.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle>Create Payment Request</CardTitle>
//           <CardDescription>
//             Select completed orders to include in your payment request
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {/* Order Selection */}
//           <div>
//             <div className="flex items-center justify-between mb-4">
//               <Label className="text-base font-semibold">
//                 Select Orders ({completedOrdersWithoutRequests.length}{" "}
//                 available)
//               </Label>
//               <Checkbox
//                 checked={
//                   selectedOrderIds.size ===
//                   completedOrdersWithoutRequests.length
//                 }
//                 onCheckedChange={handleSelectAll}
//                 className="mr-2"
//               />
//             </div>

//             <div className="border rounded-lg">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="w-12">Select</TableHead>
//                     <TableHead>Order</TableHead>
//                     <TableHead>Customer</TableHead>
//                     <TableHead>Items</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead className="text-right">Amount</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {completedOrdersWithoutRequests.map((order) => (
//                     <TableRow key={order.id}>
//                       <TableCell>
//                         <Checkbox
//                           checked={selectedOrderIds.has(order.id)}
//                           onCheckedChange={(checked) =>
//                             handleOrderSelect(order.id, checked as boolean)
//                           }
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <div>
//                           <p className="font-medium">{order.orderNumber}</p>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div>
//                           <p className="font-medium">{order.customer.name}</p>
//                           <p className="text-sm text-muted-foreground">
//                             {order.customer.email}
//                           </p>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div>
//                           <p className="font-medium">
//                             {order.items.length} item(s)
//                           </p>
//                           <p className="text-sm text-muted-foreground">
//                             {order.items[0]?.productName}
//                             {order.items.length > 1 &&
//                               ` +${order.items.length - 1} more`}
//                           </p>
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-sm">
//                         {formatDate(order.orderDate, {
//                           month: "short",
//                           day: "numeric",
//                           hour: undefined,
//                           minute: undefined,
//                         })}
//                       </TableCell>
//                       <TableCell className="text-right font-medium">
//                         {formatCurrency(order.total)}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>

//           {/* Payment Summary */}
//           {selectedOrderIds.size > 0 && (
//             <Card className="bg-muted/30">
//               <CardContent className="pt-6">
//                 <div className="grid grid-cols-3 gap-4 text-center">
//                   <div>
//                     <p className="text-sm text-muted-foreground">
//                       Total Amount
//                     </p>
//                     <p className="text-2xl font-bold">
//                       {formatCurrency(totalAmount)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">
//                       Platform Fee (15%)
//                     </p>
//                     <p className="text-xl font-semibold text-red-600">
//                       -{formatCurrency(commission)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">
//                       You{`'`}ll Receive
//                     </p>
//                     <p className="text-2xl font-bold text-green-600">
//                       {formatCurrency(netAmount)}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Notes */}
//           <div>
//             <Label htmlFor="notes" className="text-base font-semibold">
//               Notes (Optional)
//             </Label>
//             <Textarea
//               id="notes"
//               placeholder="Add any notes or comments for this payment request..."
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="mt-2"
//               maxLength={500}
//             />
//             <p className="text-sm text-muted-foreground mt-1">
//               {notes.length}/500 characters
//             </p>
//           </div>

//           {/* Invoice Upload */}
//           <div>
//             <Label className="text-base font-semibold mb-2 block">
//               Invoice (Optional)
//             </Label>
//             <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
//               <div className="text-center">
//                 <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
//                 <Label htmlFor="invoice-file" className="cursor-pointer">
//                   <span className="text-sm font-medium text-primary hover:underline">
//                     Click to upload
//                   </span>
//                   <span className="text-sm text-muted-foreground">
//                     {" "}
//                     or drag and drop
//                   </span>
//                 </Label>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   PDF or image files up to 5MB
//                 </p>
//                 <Input
//                   id="invoice-file"
//                   type="file"
//                   accept=".pdf,.jpg,.jpeg,.png"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//               </div>
//               {invoiceFile && (
//                 <div className="mt-4 flex items-center gap-2 p-2 bg-muted rounded">
//                   <FileText className="h-4 w-4" />
//                   <span className="text-sm">{invoiceFile.name}</span>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => setInvoiceFile(null)}
//                     className="ml-auto"
//                   >
//                     Remove
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Warning for first-time users */}
//           <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//             <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
//             <div className="text-sm">
//               <p className="font-medium text-yellow-800">
//                 Payment Processing Time
//               </p>
//               <p className="text-yellow-700 mt-1">
//                 Payment requests are typically reviewed within 1-2 business
//                 days. Once approved, payments are processed within 3-5 business
//                 days.
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
//               disabled={selectedOrderIds.size === 0 || isSubmitting}
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
//             <DialogTitle>Review Payment Request</DialogTitle>
//             <DialogDescription>
//               Please review your payment request before submitting
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4">
//             <div>
//               <h4 className="font-semibold mb-2">
//                 Selected Orders ({selectedOrders.length})
//               </h4>
//               <div className="border rounded-lg max-h-48 overflow-y-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Order</TableHead>
//                       <TableHead>Customer</TableHead>
//                       <TableHead className="text-right">Amount</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {selectedOrders.map((order) => (
//                       <TableRow key={order.id}>
//                         <TableCell className="font-medium">
//                           {order.orderNumber}
//                         </TableCell>
//                         <TableCell>{order.customer.name}</TableCell>
//                         <TableCell className="text-right">
//                           {formatCurrency(order.total)}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>

//             <Card>
//               <CardContent className="pt-6">
//                 <div className="grid grid-cols-3 gap-4 text-center">
//                   <div>
//                     <p className="text-sm text-muted-foreground">
//                       Total Amount
//                     </p>
//                     <p className="text-xl font-bold">
//                       {formatCurrency(totalAmount)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">
//                       Platform Fee
//                     </p>
//                     <p className="text-lg font-semibold text-red-600">
//                       -{formatCurrency(commission)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Net Amount</p>
//                     <p className="text-xl font-bold text-green-600">
//                       {formatCurrency(netAmount)}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {notes && (
//               <div>
//                 <h4 className="font-semibold mb-2">Notes</h4>
//                 <p className="text-sm bg-muted p-3 rounded-lg">{notes}</p>
//               </div>
//             )}

//             {invoiceFile && (
//               <div>
//                 <h4 className="font-semibold mb-2">Invoice</h4>
//                 <div className="flex items-center gap-2 p-2 bg-muted rounded">
//                   <FileText className="h-4 w-4" />
//                   <span className="text-sm">{invoiceFile.name}</span>
//                 </div>
//               </div>
//             )}
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowPreview(false)}>
//               Back to Edit
//             </Button>
//             <Button onClick={handleSubmit} disabled={isSubmitting}>
//               {isSubmitting ? "Submitting..." : "Submit Request"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }
