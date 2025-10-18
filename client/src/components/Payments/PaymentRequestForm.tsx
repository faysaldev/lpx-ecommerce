"use client";

import { AlertCircle, CheckCircle, CreditCard } from "lucide-react";
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
import { Label } from "@/components/UI/label";
import { Textarea } from "@/components/UI/textarea";
import { InputNumber } from "antd";
import {
  useCreatePaymentRequestMutation,
  useGetPaymentWithDrawlElgbleQuery,
} from "@/redux/features/vendors/paymentRequest";
import { PaymentCards } from "@/lib/types";

interface PaymentRequestFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  payMathods: PaymentCards[];
}

interface PaymentRequestData {
  selectedCardId: string;
  withdrawalAmount: number;
  notes: string;
}

export default function PaymentRequestForm({
  onSuccess,
  onCancel,
  payMathods,
}: PaymentRequestFormProps) {
  const { data: eligableWithDrawl, isLoading: withdrawlLoading } =
    useGetPaymentWithDrawlElgbleQuery({});

  console.log(payMathods, "paymentod from dialog");

  // Extract available withdrawal amount
  const availableAmount =
    eligableWithDrawl?.data?.attributes?.availableWithdrawl || 0;
  const isEligible = availableAmount >= 100;

  const [formData, setFormData] = useState<PaymentRequestData>({
    selectedCardId: payMathods.length > 0 ? payMathods[0]._id : "",
    withdrawalAmount: 0,
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [createPayReq] = useCreatePaymentRequestMutation();

  const handleInputChange = (
    field: keyof PaymentRequestData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCardSelect = (cardId: string) => {
    if (isEligible) {
      setFormData((prev) => ({
        ...prev,
        selectedCardId: cardId,
      }));
    }
  };

  const getSelectedCard = () => {
    return payMathods.find((card) => card._id === formData.selectedCardId);
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Check eligibility first
    if (!isEligible) {
      errors.push("You need at least AED 100 available to make a withdrawal");
      errors.forEach((error) => toast.error(error));
      return false;
    }

    if (!formData.selectedCardId) {
      errors.push("Please select a payment card");
    }

    if (!formData.withdrawalAmount || formData.withdrawalAmount <= 0) {
      errors.push("Withdrawal amount must be greater than 0");
    } else if (formData.withdrawalAmount > availableAmount) {
      errors.push(
        `Withdrawal amount cannot exceed AED ${availableAmount.toFixed(2)}`
      );
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
      const selectedCard = getSelectedCard();
      const requestData = {
        withdrawalAmount: formData.withdrawalAmount,
        notes: formData.notes,
        bankDetails: selectedCard?._id,
      };

      const res = await createPayReq(requestData);

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
            Select your payment card and enter withdrawal amount
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Eligibility Status Card */}
          {withdrawlLoading ? (
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Loading balance...
              </p>
            </div>
          ) : (
            <div
              className={`flex items-start gap-3 p-4 rounded-lg border ${
                isEligible
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              {isEligible ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p
                  className={`font-semibold ${
                    isEligible ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {isEligible
                    ? "Eligible for Withdrawal"
                    : "Not Eligible for Withdrawal"}
                </p>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span
                      className={isEligible ? "text-green-700" : "text-red-700"}
                    >
                      Available Balance:
                    </span>
                    <span
                      className={`font-bold ${
                        isEligible ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      AED {availableAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
                {!isEligible && (
                  <p className="text-red-700 mt-2 text-sm">
                    You need at least AED 100.00 available to make a withdrawal
                    request.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Payment Cards Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              Select Payment Card *
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {payMathods.map((card) => (
                <div
                  key={card._id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.selectedCardId === card._id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-[#2D3748] hover:border-gray-300"
                  } ${!isEligible ? "opacity-50 cursor-not-allowed" : ""}`}
                  style={{
                    backgroundColor:
                      formData.selectedCardId === card._id
                        ? undefined
                        : "#2D3748",
                  }}
                  onClick={() => handleCardSelect(card._id)}
                >
                  <div className="flex items-start gap-3">
                    <CreditCard
                      className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        formData.selectedCardId === card._id
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`font-semibold ${
                            formData.selectedCardId === card._id
                              ? "text-blue-900"
                              : "text-white"
                          }`}
                        >
                          {card.bankName}
                        </h3>
                        {formData.selectedCardId === card._id && (
                          <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          formData.selectedCardId === card._id
                            ? "text-blue-700"
                            : "text-gray-300"
                        }`}
                      >
                        {card.accountType} • •••• {card.accountNumber.slice(-4)}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          formData.selectedCardId === card._id
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      >
                        {card.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {payMathods?.length != 0 ? (
            <>
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
                  max={availableAmount}
                  step={0.01}
                  disabled={!isEligible}
                />
                <div className="flex items-center justify-between text-sm mt-1">
                  <p className="text-muted-foreground">
                    Maximum withdrawal:{" "}
                    <span className="font-semibold text-foreground">
                      AED {availableAmount.toFixed(2)}
                    </span>
                  </p>
                  {formData.withdrawalAmount > 0 && (
                    <p
                      className={`font-medium ${
                        formData.withdrawalAmount <= availableAmount
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formData.withdrawalAmount <= availableAmount
                        ? "✓ Valid amount"
                        : "✗ Exceeds available balance"}
                    </p>
                  )}
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
                  disabled={!isEligible}
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
                    Withdrawal requests are typically processed within 1-2
                    business days. Please ensure all bank details are accurate.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center">
              {" "}
              <h1>Add Payment Method First</h1>
            </div>
          )}

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
              disabled={isSubmitting || !isEligible}
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
            {/* Selected Card Preview */}
            {getSelectedCard() && (
              <div className="p-4 rounded-lg bg-[#2D3748] text-white">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-semibold">
                      {getSelectedCard()?.bankName}
                    </h4>
                    <p className="text-sm text-gray-300">
                      {getSelectedCard()?.accountType} • ••••{" "}
                      {getSelectedCard()?.accountNumber?.slice(-4)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {getSelectedCard()?.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="font-semibold text-sm text-muted-foreground">
                Withdrawal Amount
              </h4>
              <p className="text-2xl font-bold text-green-600">
                AED {formData.withdrawalAmount.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Available Balance: AED {availableAmount.toFixed(2)}
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
