/* eslint-disable @typescript-eslint/no-explicit-any */
import { Package } from "lucide-react";
import Image from "next/image";

interface SingleOrderProductCardProps {
  item: any;
}

export default function SingleOrderProductCard({
  item,
}: SingleOrderProductCardProps) {
  const productImage = item.productId?.images?.[0];
  const hasImage = productImage && productImage.length > 0;

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      {/* Product Image */}
      <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
        {hasImage ? (
          <Image
            src={productImage}
            alt={item.productId?.productName || "Product"}
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
        <h4 className="font-semibold text-base mb-1 truncate">
          {item.productId?.productName || "Product"}
        </h4>

        {item.productId?.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {item.productId.description}
          </p>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>Quantity: {item.quantity}</span>
          <span>
            Price: AED {` `}
            {Number(item.price || 0).toFixed(2)}
          </span>
          {item.vendorId?.storeName && (
            <span>Vendor: {item.vendorId.storeName}</span>
          )}
        </div>
      </div>

      {/* Total Price */}
      <div className="text-right flex-shrink-0">
        <p className="font-semibold text-lg">
          AED {Number((item.quantity || 0) * (item.price || 0)).toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground">Total</p>
      </div>
    </div>
  );
}
