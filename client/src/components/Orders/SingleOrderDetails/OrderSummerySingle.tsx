/* eslint-disable @typescript-eslint/no-explicit-any */
import { Separator } from "@/components/UI/separator";
import React from "react";

function OrderSummerySingle({
  order,
  subtotal,
}: {
  order: any;
  subtotal: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>${Number(subtotal || 0).toFixed(2)}</span>
      </div>
      {order.coupon?.isValid && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Coupon Discount</span>
          <span>-${Number(subtotal - order.total || 0).toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between text-sm">
        <span>Shipping</span>
        <span>
          {order.shipping === 0
            ? "FREE"
            : `$${Number(order.shipping || 0).toFixed(2)}`}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Tax</span>
        <span>${Number(order.tax || 0).toFixed(2)}</span>
      </div>
      <Separator />
      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>${Number(order.totalAmount || 0).toFixed(2)}</span>
      </div>
    </div>
  );
}

export default OrderSummerySingle;
