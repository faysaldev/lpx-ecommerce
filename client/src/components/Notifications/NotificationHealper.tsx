import { AlertCircle, Package, Store, Tag, TrendingDown } from "lucide-react";

import {
  NotificationType,
  Notification,
  ApiNotification,
} from "../../lib/types";
// Map backend types to frontend types
export const mapBackendTypeToFrontend = (
  backendType: string
): NotificationType => {
  switch (backendType) {
    case "order":
      return "orders";
    case "system":
    case "promotion":
    case "vendor":
    case "price_alert":
      return backendType as NotificationType;
    default:
      return "system";
  }
};

// Map frontend types to backend types
export const mapFrontendTypeToBackend = (
  frontendType: NotificationType | "all"
): string => {
  switch (frontendType) {
    case "orders":
      return "orders";
    case "system":
    case "promotion":
    case "vendor":
    case "price_alert":
      return frontendType;
    case "all":
    default:
      return "all";
  }
};

// Transform API response to frontend notification format
export const transformApiNotification = (
  apiNotification: ApiNotification
): Notification => {
  const frontendType = mapBackendTypeToFrontend(apiNotification.type);

  // Build action URL based on notification type
  let actionUrl = "";
  let actionLabel = "";

  if (frontendType === "orders" && apiNotification.transactionId) {
    actionUrl = `/orders/${apiNotification.transactionId}`;
    actionLabel = "View Order";
  } else if (frontendType === "promotion") {
    actionUrl = "/promotions";
    actionLabel = "View Promotions";
  } else if (frontendType === "vendor") {
    actionUrl = "/vendors";
    actionLabel = "View Vendors";
  }

  return {
    id: apiNotification._id,
    type: frontendType,
    priority: apiNotification.priority,
    title: apiNotification.title,
    message: apiNotification.description,
    timestamp: apiNotification.updatedAt || apiNotification.createdAt,
    read: apiNotification.isRead,
    actionUrl: actionUrl || undefined,
    actionLabel: actionLabel || undefined,
    metadata: {
      orderId: apiNotification.transactionId,
    },
  };
};

export const notificationIcons: Record<NotificationType, React.ElementType> = {
  orders: Package,
  system: AlertCircle,
  promotion: Tag,
  vendor: Store,
  price_alert: TrendingDown,
};

export const notificationColors: Record<NotificationType, string> = {
  orders: "text-blue-500",
  system: "text-gray-500",
  promotion: "text-purple-500",
  vendor: "text-green-500",
  price_alert: "text-orange-500",
};
