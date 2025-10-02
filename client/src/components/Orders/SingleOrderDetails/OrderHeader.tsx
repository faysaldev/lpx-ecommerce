/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format } from "date-fns";
import { Calendar, Copy, Download, RefreshCw } from "lucide-react";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import { cn } from "@/lib/utils";

function OrderHeader({
  StatusIcon,
  status,
  order,
  copyOrderNumber,
  copied,
  handleReorder,
  downloadInvoice,
}: {
  StatusIcon: any;
  status: any;
  order: any;
  copyOrderNumber: any;
  copied: boolean;
  handleReorder: any;
  downloadInvoice: any;
}) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={cn("p-3 rounded-lg", status.bgColor)}>
              <StatusIcon className={cn("h-6 w-6", status.color)} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">Order {order.orderID}</h1>
                <Badge
                  variant={
                    order.status === "delivered" ? "default" : "secondary"
                  }
                >
                  {status.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Placed on{" "}
                  {format(
                    new Date(order.createdAt),
                    "MMMM d, yyyy 'at' h:mm a"
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Order Number:</span>
                <span className="font-mono">{order.orderID}</span>
                <button
                  type="button"
                  onClick={copyOrderNumber}
                  className="ml-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                  title="Copy order number"
                >
                  <Copy
                    className={cn(
                      "h-3 w-3",
                      copied ? "text-green-600" : "text-muted-foreground"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:items-end gap-3">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">
                ${Number(order.totalAmount || 0).toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              {/* TODO: upcoming section */}
              {/* {order.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelOrder}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel Order
                    </Button>
                  )} */}
              <Button variant="outline" size="sm" onClick={handleReorder}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Reorder
              </Button>
              <Button variant="outline" size="sm" onClick={downloadInvoice}>
                <Download className="h-4 w-4 mr-1" />
                Invoice
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderHeader;
