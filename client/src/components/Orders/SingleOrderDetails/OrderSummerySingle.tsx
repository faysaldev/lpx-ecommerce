/* eslint-disable @typescript-eslint/no-explicit-any */

interface OrderSummerySingleProps {
  order: any;
  subtotal: number;
}

export default function OrderSummerySingle({
  order,
  subtotal,
}: OrderSummerySingleProps) {
  return (
    <div className="space-y-2">
      {/* Subtotal */}
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-medium">${Number(subtotal || 0).toFixed(2)}</span>
      </div>

      {/* Shipping */}
      {order.shipping !== undefined && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">
            {order.shipping === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              `$${Number(order.shipping).toFixed(2)}`
            )}
          </span>
        </div>
      )}

      {/* Tax */}
      {order.tax !== undefined && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span className="font-medium">${Number(order.tax).toFixed(2)}</span>
        </div>
      )}

      {/* Coupon Discount */}
      {order.coupon?.isValid && order.coupon?.discountAmount && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Coupon Discount</span>
          <span className="font-medium text-green-600">
            -${Number(order.coupon.discountAmount).toFixed(2)}
          </span>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between text-base font-bold pt-2 border-t">
        <span>Total</span>
        <span>${Number(order.totalAmount || 0).toFixed(2)}</span>
      </div>

      {/* Order Notes */}
      {order.orderNotes && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium mb-1">Order Notes:</p>
          <p className="text-sm text-muted-foreground">{order.orderNotes}</p>
        </div>
      )}
    </div>
  );
}
