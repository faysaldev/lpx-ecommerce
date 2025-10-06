/* eslint-disable @typescript-eslint/no-explicit-any */
import PaymentRequestForm from "@/components/Payments/PaymentRequestForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import React from "react";

function PaymentRequestDialog({
  VENDOR_ID,
  showCreateForm,
  handleCreateSuccess,
  setShowCreateForm,
}: {
  VENDOR_ID: any;
  showCreateForm: any;
  handleCreateSuccess: any;
  setShowCreateForm: any;
}) {
  return (
    <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create Payment Request</DialogTitle>
          <DialogDescription>
            Select completed orders to include in your payment request
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <PaymentRequestForm
            vendorId={VENDOR_ID}
            // completedOrders={completedOrders}
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentRequestDialog;
