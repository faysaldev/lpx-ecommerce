/* eslint-disable @typescript-eslint/no-explicit-any */
import { getStatusStyles, Items } from "@/lib/order-single";
import { Package } from "lucide-react";

import Image from "next/image";

export default function SingleOrderProductCard({ item }: { item: Items }) {
  const product =
    typeof item.productId === "object" ? item.productId : undefined;

  const productImage = product?.image || item?.image;
  const productName = product?.productName || "Product";
  const productDescription = product?.description;
  const { bg, text } = getStatusStyles(item.status);
  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      {/* Product Image */}
      <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
        {productImage ? (
          <Image
            src={productImage}
            alt={productName}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package className="h-10 w-10 text-muted-foreground" />
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-base mb-1 truncate">{productName}</h4>

        {productDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {productDescription}
          </p>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>Quantity: {item.quantity}</span>
          <span>Price: AED {Number(item.price || 0).toFixed(2)}</span>
          {item.vendorId?.storeName && (
            <span>Vendor: {item.vendorId.storeName}</span>
          )}
        </div>

        {/* Item Status Badge */}
        <div className="flex items-center gap-2 mt-3">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
          >
            <span>Status: {item.status}</span>
          </div>
        </div>
      </div>

      {/* Total Price */}
      <div className="text-right flex-shrink-0">
        <p className="font-semibold text-lg">
          AED {Number(item.quantity * item.price).toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground">Total</p>
      </div>
    </div>
  );
}
