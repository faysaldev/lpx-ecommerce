"use client";

import { AlertCircle, CheckCircle, CreditCard, Info } from "lucide-react";
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
import { Label } from "@/components/UI/label";
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

  const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, "");

    // Prevent multiple decimal points
    const parts = numericValue.split(".");
    if (parts.length > 2) return;

    const parsedValue = parseFloat(numericValue) || 0;

    // Don't allow more than available amount
    if (parsedValue <= availableAmount) {
      handleInputChange("withdrawalAmount", parsedValue);
    }
  };

  const handleMaxClick = () => {
    handleInputChange("withdrawalAmount", availableAmount);
  };

  return (
    <>
      <Card className="border-0 shadow-xl">
        <CardContent className="space-y-6 pt-6 mt-5">
          {/* Eligibility Status Card */}
          <div>
            {withdrawlLoading ? (
              <div className="flex items-center justify-center p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
                <p className="text-sm text-muted-foreground font-medium">
                  Loading balance...
                </p>
              </div>
            ) : (
              <div
                className={`flex flex-col sm:flex-row items-start gap-4 p-5 rounded-xl border-2 transition-all ${
                  isEligible
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
                    : "bg-gradient-to-r from-red-50 to-rose-50 border-red-300"
                }`}
              >
                {isEligible ? (
                  <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <p
                    className={`text-lg font-bold ${
                      isEligible ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {isEligible
                      ? "✓ Eligible for Withdrawal"
                      : "✗ Not Eligible for Withdrawal"}
                  </p>
                  <div className="mt-3 p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm font-medium ${
                          isEligible ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        Available Balance:
                      </span>
                      <span
                        className={`text-2xl font-bold ${
                          isEligible ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        AED {availableAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {!isEligible && (
                    <p className="text-red-700 mt-3 text-sm font-medium flex items-start gap-2">
                      <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      You need at least AED 100.00 available to make a
                      withdrawal request.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Payment Cards Selection */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <Label className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Select Payment Card *
              </Label>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {payMathods.map((card) => (
                <div
                  key={card._id}
                  className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                    formData.selectedCardId === card._id
                      ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg"
                      : "border-gray-300 bg-gradient-to-br from-gray-700 to-gray-800 hover:border-gray-400 shadow-md"
                  } ${
                    !isEligible
                      ? "opacity-50 cursor-not-allowed hover:scale-100"
                      : ""
                  }`}
                  onClick={() => handleCardSelect(card._id)}
                >
                  {formData.selectedCardId === card._id && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                        formData.selectedCardId === card._id
                          ? "bg-blue-100"
                          : "bg-gray-600"
                      }`}
                    >
                      <CreditCard
                        className={`h-6 w-6 ${
                          formData.selectedCardId === card._id
                            ? "text-blue-600"
                            : "text-gray-300"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-bold text-lg ${
                          formData.selectedCardId === card._id
                            ? "text-blue-900"
                            : "text-white"
                        }`}
                      >
                        {card.bankName}
                      </h3>
                      {/* <p
                        className={`text-sm mt-1 ${
                          formData.selectedCardId === card._id
                            ? "text-blue-700"
                            : "text-gray-300"
                        }`}
                      >
                        {card.accountType} • •••• {card.accountNumber.slice(-4)}
                      </p> */}
                      <p
                        className={`text-xs mt-2 font-medium ${
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

          {payMathods?.length !== 0 ? (
            <>
              {/* Withdrawal Amount */}
              <div className="space-y-3">
                <Label
                  htmlFor="withdrawalAmount"
                  className="text-lg font-bold text-white"
                >
                  Withdrawal Amount *
                </Label>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg pointer-events-none">
                    AED
                  </div>
                  <input
                    id="withdrawalAmount"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={formData.withdrawalAmount || ""}
                    onChange={handleAmountInput}
                    disabled={!isEligible}
                    className={`w-full pl-16 pr-24 py-4 text-2xl font-bold border-2 rounded-xl transition-all ${
                      !isEligible
                        ? "bg-gray-100 border-white cursor-not-allowed text-gray-500"
                        : formData.withdrawalAmount > availableAmount
                        ? "border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100"
                        : formData.withdrawalAmount > 0
                        ? "border-green-500 focus:border-green-600 focus:ring-4 focus:ring-green-100"
                        : "border-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    } outline-none`}
                  />
                  <Button
                    type="button"
                    onClick={handleMaxClick}
                    disabled={!isEligible}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 h-auto bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors text-sm"
                  >
                    MAX
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Maximum withdrawal
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      AED {availableAmount.toFixed(2)}
                    </p>
                  </div>
                  {formData.withdrawalAmount > 0 && (
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${
                        formData.withdrawalAmount <= availableAmount
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {formData.withdrawalAmount <= availableAmount ? (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          Valid
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5" />
                          Exceeds limit
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Warning */}
              <div className="flex flex-col sm:flex-row items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Info className="h-5 w-5 text-yellow-900" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-yellow-900">Processing Time</p>
                  <p className="text-yellow-800 mt-1 text-sm">
                    Withdrawal requests are typically processed within 1-2
                    business days. Please ensure all bank details are accurate.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <CreditCard className="h-16 w-16 text-gray-400 mb-4" />
              <h1 className="text-xl font-bold text-gray-700">
                Add Payment Method First
              </h1>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 py-6 text-lg font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setShowPreview(true)}
              disabled={
                isSubmitting ||
                !isEligible ||
                formData.withdrawalAmount <= 0 ||
                formData.withdrawalAmount > availableAmount
              }
              className="flex-1 py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Review & Submit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white -m-6 p-6 mb-4 rounded-t-lg">
            <DialogTitle className="text-2xl">
              Review Withdrawal Request
            </DialogTitle>
            <DialogDescription className="text-blue-100">
              Please review your withdrawal details before submitting
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Selected Card Preview */}
            {getSelectedCard() && (
              <div className="p-5 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 text-white shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-gray-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">
                      {getSelectedCard()?.bankName}
                    </h4>
                    {/* <p className="text-sm text-gray-300 mt-1">
                      {getSelectedCard()?.accountType} • ••••{" "}
                      {getSelectedCard()?.accountNumber?.slice(-4)}
                    </p> */}
                    <p className="text-xs text-gray-400 mt-1 font-medium">
                      {getSelectedCard()?.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t-2 pt-6">
              <h4 className="font-semibold text-sm text-gray-600 mb-2">
                Withdrawal Amount
              </h4>
              <p className="text-4xl font-bold text-green-600 mb-2">
                AED {formData.withdrawalAmount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                Available Balance:{" "}
                <span className="font-bold">
                  AED {availableAmount.toFixed(2)}
                </span>
              </p>
            </div>

            {formData.notes && (
              <div>
                <h4 className="font-semibold text-sm text-gray-600 mb-2">
                  Notes
                </h4>
                <p className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {formData.notes}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-3 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(false)}
              className="flex-1 py-6 text-base font-bold"
            >
              Back to Edit
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-6 text-base font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              {isSubmitting ? "Processing..." : "Confirm Withdrawal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
