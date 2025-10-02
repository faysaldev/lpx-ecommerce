/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Package } from "lucide-react";
import Image from "next/image";

function SingleOrderProductCard({ item }: { item: any }) {
  return (
    <div
      key={item._id}
      className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
    >
      <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={`Product ${item.productId}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-medium">Product ID: {item.productId}</h4>
        <p className="text-sm text-muted-foreground">Vendor: {item.vendorId}</p>
        <p className="text-sm text-muted-foreground">
          Qty: {item.quantity} × ${Number(item.price || 0).toFixed(2)}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold">
          ${Number((item.price || 0) * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export default SingleOrderProductCard;
