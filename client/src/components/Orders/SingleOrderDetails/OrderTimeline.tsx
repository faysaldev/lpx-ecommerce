/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format } from "date-fns";

import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/checkout";
function OrderTimeline({
  status,
  createdAt,
}: {
  status: OrderStatus;
  createdAt: string;
}) {
  const events = [
    {
      id: "1",
      title: "Order Placed",
      description: "Your order has been received",
      timestamp: createdAt,
      type: "order" as const,
    },
    {
      id: "2",
      title: "Order Confirmed",
      description: "Your order has been confirmed",
      timestamp: new Date(
        new Date(createdAt).getTime() + 30 * 60000
      ).toISOString(),
      type: "confirmation" as const,
    },
    ...(status !== "pending" && status !== "cancelled"
      ? [
          {
            id: "3",
            title: "Processing",
            description: "Your order is being processed",
            timestamp: new Date(
              new Date(createdAt).getTime() + 60 * 60000
            ).toISOString(),
            type: "processing" as const,
          },
        ]
      : []),
    ...(status === "shipped" || status === "delivered"
      ? [
          {
            id: "4",
            title: "Shipped",
            description: "Your order has been shipped",
            timestamp: new Date(
              new Date(createdAt).getTime() + 120 * 60000
            ).toISOString(),
            type: "shipping" as const,
            metadata: {
              trackingNumber: "TRK123456789",
              carrier: "Standard Shipping",
            },
          },
        ]
      : []),
    ...(status === "delivered"
      ? [
          {
            id: "5",
            title: "Delivered",
            description: "Your order has been delivered",
            timestamp: new Date(
              new Date(createdAt).getTime() + 24 * 60 * 60000
            ).toISOString(),
            type: "delivery" as const,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-3 h-3 rounded-full border-2",
                  event.type === "delivery"
                    ? "bg-green-500 border-green-500"
                    : "bg-blue-500 border-blue-500"
                )}
              />
              {!isLast && (
                <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700 mt-2" />
              )}
            </div>
            <div className="flex-1 pb-8">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{event.title}</h4>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(event.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>
              {event.metadata && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {event.metadata.trackingNumber && (
                    <div>Tracking: {event.metadata.trackingNumber}</div>
                  )}
                  {event.metadata.carrier && (
                    <div>Carrier: {event.metadata.carrier}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OrderTimeline;
