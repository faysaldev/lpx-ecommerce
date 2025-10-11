/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/checkout";

function OrderTimeline({
  status,
  createdAt,
}: {
  status: OrderStatus;
  createdAt: string;
}) {
  const orderDate = new Date(createdAt);

  // Calculate dates based on order date
  const shippingStartDate = addDays(orderDate, 2); // 2 days after order
  const shippingEndDate = addDays(orderDate, 4); // 4 days after order
  const deliveryStartDate = addDays(orderDate, 5); // 5 days after order
  const deliveryEndDate = addDays(orderDate, 9); // 9 days after order

  const events = [
    {
      id: "1",
      title: "Order Placed & Confirmed",
      description: "Your order has been received and confirmed",
      timestamp: createdAt,
      type: "order" as const,
    },
    ...(status !== "cancelled"
      ? [
          {
            id: "2",
            title: "Shipping",
            description: `Expected to ship between ${format(
              shippingStartDate,
              "MMM d"
            )} - ${format(shippingEndDate, "MMM d, yyyy")}`,
            timestamp: shippingStartDate.toISOString(),
            type: "shipping" as const,
            isEstimated: status !== "shipped" && status !== "delivered",
            metadata:
              status === "shipped" || status === "delivered"
                ? {
                    trackingNumber: "TRK123456789",
                    carrier: "Standard Shipping",
                  }
                : undefined,
          },
        ]
      : []),
    ...(status !== "cancelled"
      ? [
          {
            id: "3",
            title: "Delivery",
            description: `Expected delivery between ${format(
              deliveryStartDate,
              "MMM d"
            )} - ${format(deliveryEndDate, "MMM d, yyyy")}`,
            timestamp: deliveryStartDate.toISOString(),
            type: "delivery" as const,
            isEstimated: status !== "delivered",
            actualDeliveryDate:
              status === "delivered" ? deliveryStartDate : undefined,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const isCompleted =
          event.type === "order" ||
          (event.type === "shipping" &&
            (status === "shipped" || status === "delivered")) ||
          (event.type === "delivery" && status === "delivered");

        return (
          <div key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-3 h-3 rounded-full border-2",
                  isCompleted
                    ? event.type === "delivery"
                      ? "bg-green-500 border-green-500"
                      : "bg-blue-500 border-blue-500"
                    : "bg-gray-300 border-gray-300 dark:bg-gray-600 dark:border-gray-600"
                )}
              />
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 h-8 mt-2",
                    isCompleted ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                  )}
                />
              )}
            </div>
            <div className="flex-1 pb-8">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4
                  className={cn(
                    "font-medium",
                    !isCompleted && "text-muted-foreground"
                  )}
                >
                  {event.title}
                </h4>
                {event.type === "order" && (
                  <span className="text-sm text-muted-foreground">
                    {format(
                      new Date(event.timestamp),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </span>
                )}
                {event.isEstimated && (
                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded">
                    Estimated
                  </span>
                )}
              </div>
              <p
                className={cn(
                  "text-sm",
                  isCompleted
                    ? "text-muted-foreground"
                    : "text-muted-foreground/70"
                )}
              >
                {event.description}
              </p>
              {event.metadata && (
                <div className="mt-2 text-xs text-muted-foreground space-y-1">
                  {event.metadata.trackingNumber && (
                    <div>
                      <span className="font-medium">Tracking:</span>{" "}
                      {event.metadata.trackingNumber}
                    </div>
                  )}
                  {event.metadata.carrier && (
                    <div>
                      <span className="font-medium">Carrier:</span>{" "}
                      {event.metadata.carrier}
                    </div>
                  )}
                </div>
              )}
              {event.actualDeliveryDate && (
                <div className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                  Delivered on {format(event.actualDeliveryDate, "MMM d, yyyy")}
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

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { format } from "date-fns";

// import { cn } from "@/lib/utils";
// import type { OrderStatus } from "@/lib/checkout";
// function OrderTimeline({
//   status,
//   createdAt,
// }: {
//   status: OrderStatus;
//   createdAt: string;
// }) {
//   const events = [
//     {
//       id: "1",
//       title: "Order Placed",
//       description: "Your order has been received",
//       timestamp: createdAt,
//       type: "order" as const,
//     },
//     {
//       id: "2",
//       title: "Order Confirmed",
//       description: "Your order has been confirmed",
//       timestamp: new Date(
//         new Date(createdAt).getTime() + 30 * 60000
//       ).toISOString(),
//       type: "confirmation" as const,
//     },
//     ...(status !== "conformed" && status !== "cancelled"
//       ? [
//           {
//             id: "3",
//             title: "Processing",
//             description: "Your order is being processed",
//             timestamp: new Date(
//               new Date(createdAt).getTime() + 60 * 60000
//             ).toISOString(),
//             type: "processing" as const,
//           },
//         ]
//       : []),
//     ...(status === "shipped" || status === "delivered"
//       ? [
//           {
//             id: "4",
//             title: "Shipped",
//             description: "Your order has been shipped",
//             timestamp: new Date(
//               new Date(createdAt).getTime() + 120 * 60000
//             ).toISOString(),
//             type: "shipping" as const,
//             metadata: {
//               trackingNumber: "TRK123456789",
//               carrier: "Standard Shipping",
//             },
//           },
//         ]
//       : []),
//     ...(status === "delivered"
//       ? [
//           {
//             id: "5",
//             title: "Delivered",
//             description: "Your order has been delivered",
//             timestamp: new Date(
//               new Date(createdAt).getTime() + 24 * 60 * 60000
//             ).toISOString(),
//             type: "delivery" as const,
//           },
//         ]
//       : []),
//   ];

//   return (
//     <div className="space-y-4">
//       {events.map((event, index) => {
//         const isLast = index === events.length - 1;

//         return (
//           <div key={event.id} className="flex gap-4">
//             <div className="flex flex-col items-center">
//               <div
//                 className={cn(
//                   "w-3 h-3 rounded-full border-2",
//                   event.type === "delivery"
//                     ? "bg-green-500 border-green-500"
//                     : "bg-blue-500 border-blue-500"
//                 )}
//               />
//               {!isLast && (
//                 <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700 mt-2" />
//               )}
//             </div>
//             <div className="flex-1 pb-8">
//               <div className="flex items-center gap-2 mb-1">
//                 <h4 className="font-medium">{event.title}</h4>
//                 <span className="text-sm text-muted-foreground">
//                   {format(new Date(event.timestamp), "MMM d, yyyy 'at' h:mm a")}
//                 </span>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 {event.description}
//               </p>
//               {event.metadata && (
//                 <div className="mt-2 text-xs text-muted-foreground">
//                   {event.metadata.trackingNumber && (
//                     <div>Tracking: {event.metadata.trackingNumber}</div>
//                   )}
//                   {event.metadata.carrier && (
//                     <div>Carrier: {event.metadata.carrier}</div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default OrderTimeline;
