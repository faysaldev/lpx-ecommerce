/* eslint-disable @typescript-eslint/no-explicit-any */
import PaymentRequestForm from "@/components/Payments/PaymentRequestForm";
import { Dialog, DialogContent } from "@/components/UI/dialog";
import { PaymentCards } from "@/lib/types";
import React from "react";

function PaymentRequestDialog({
  showCreateForm,
  handleCreateSuccess,
  setShowCreateForm,
  payMathods,
}: {
  showCreateForm: any;
  handleCreateSuccess: any;
  setShowCreateForm: any;
  payMathods: PaymentCards[];
}) {
  return (
    <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
        <PaymentRequestForm
          // completedOrders={completedOrders}
          payMathods={payMathods}
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export default PaymentRequestDialog;
