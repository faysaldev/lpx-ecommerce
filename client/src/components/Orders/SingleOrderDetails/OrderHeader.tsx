/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import { Copy, Download, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface OrderHeaderProps {
  order: any;
  status: {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
  };
  StatusIcon: React.ElementType;
  copied: boolean;
  copyOrderNumber: () => void;
  downloadInvoice: () => void;
  handleReorder: () => void;
}

export default function OrderHeader({
  order,
  status,
  StatusIcon,
  copied,
  copyOrderNumber,
  downloadInvoice,
  handleReorder,
}: OrderHeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Order Info */}
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${status.bgColor}`}>
              <StatusIcon className={`h-6 w-6 ${status.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold">{order.orderID}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyOrderNumber}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge
                  variant={
                    order.status === "delivered" ? "default" : "secondary"
                  }
                >
                  {status.label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {mounted ? (
                    <>
                      Placed on{" "}
                      {format(
                        new Date(order.createdAt),
                        "MMM d, yyyy 'at' h:mm a"
                      )}
                    </>
                  ) : (
                    <span className="invisible">Loading date...</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReorder}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reorder
            </Button>
            <Button variant="outline" onClick={downloadInvoice}>
              <Download className="h-4 w-4 mr-2" />
              Invoice
            </Button>
          </div>
        </div>

        {/* Customer Info */}
        {order.customer && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                {order.customer.image ? (
                  <img
                    src={order.customer.image}
                    alt={order.customer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold">
                    {order.customer.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold">{order.customer.name}</p>
                <p className="text-sm text-muted-foreground">
                  {order.customer.email}
                </p>
                {order.customer.phoneNumber && (
                  <p className="text-sm text-muted-foreground">
                    {order.customer.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
