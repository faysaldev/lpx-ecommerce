"use client";

import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  Check,
  CheckCircle,
  MoreVertical,
  Package,
  Settings,
  Store,
  Tag,
  Trash2,
  TrendingDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/UI/card";
import { Checkbox } from "@/components/UI/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { Separator } from "@/components/UI/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/UI/tabs";
import { cn } from "@/lib/utils";
import { NotificationType, Notification } from "@/lib/types";

const notificationIcons: Record<NotificationType, React.ElementType> = {
  order: Package,
  system: AlertCircle,
  promotion: Tag,
  vendor: Store,
  price_alert: TrendingDown,
};

const notificationColors: Record<NotificationType, string> = {
  order: "text-blue-500",
  system: "text-gray-500",
  promotion: "text-purple-500",
  vendor: "text-green-500",
  price_alert: "text-orange-500",
};

// Dummy notification data
const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "order",
    priority: "high",
    title: "Order Shipped",
    message:
      "Your order #ORD-2024-001 has been shipped and will arrive in 2-3 business days.",
    timestamp: new Date().toISOString(),
    read: false,
    actionUrl: "/orders/ORD-2024-001",
    actionLabel: "Track Order",
    metadata: {
      orderId: "ORD-2024-001",
    },
  },
  {
    id: "2",
    type: "price_alert",
    priority: "medium",
    title: "Price Drop Alert",
    message:
      "The iPhone 15 Pro you're watching has dropped by $50! Now available for $949.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    actionUrl: "/products/iphone-15-pro",
    actionLabel: "View Product",
    metadata: {
      productId: "iphone-15-pro",
      previousPrice: 999,
      currentPrice: 949,
    },
  },
  {
    id: "3",
    type: "system",
    priority: "low",
    title: "System Maintenance",
    message:
      "Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM EST. Limited functionality expected.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    read: true,
    actionUrl: "/status",
    actionLabel: "View Status",
  },
  {
    id: "4",
    type: "promotion",
    priority: "medium",
    title: "Flash Sale: 30% Off Electronics",
    message:
      "Don't miss out! Get 30% off all electronics until midnight. Use code FLASH30 at checkout.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    read: false,
    actionUrl: "/promotions/flash-sale",
    actionLabel: "Shop Now",
    metadata: {
      discount: 30,
    },
  },
  {
    id: "5",
    type: "vendor",
    priority: "low",
    title: "New Vendor Partnership",
    message:
      "We've partnered with TechCorp to bring you more amazing products at competitive prices.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    read: true,
    actionUrl: "/vendors/techcorp",
    actionLabel: "Explore Products",
    metadata: {
      vendorId: "techcorp",
    },
  },
  {
    id: "6",
    type: "order",
    priority: "medium",
    title: "Order Delivered",
    message:
      "Your order #ORD-2024-002 has been delivered successfully. We hope you love your purchase!",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    read: true,
    actionUrl: "/orders/ORD-2024-002",
    actionLabel: "Rate Order",
    metadata: {
      orderId: "ORD-2024-002",
    },
  },
  {
    id: "7",
    type: "price_alert",
    priority: "high",
    title: "Stock Alert",
    message:
      "The MacBook Pro you're watching is back in stock! Only 3 units remaining.",
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
    read: false,
    actionUrl: "/products/macbook-pro",
    actionLabel: "Buy Now",
    metadata: {
      productId: "macbook-pro",
    },
  },
  {
    id: "8",
    type: "system",
    priority: "medium",
    title: "Account Security Update",
    message:
      "We've updated our security features. Please review your account settings and enable two-factor authentication.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    read: true,
    actionUrl: "/settings/security",
    actionLabel: "Update Security",
  },
  {
    id: "9",
    type: "promotion",
    priority: "low",
    title: "Weekly Newsletter",
    message:
      "Check out this week's top deals, new arrivals, and exclusive offers just for you.",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    read: true,
    actionUrl: "/newsletter/weekly",
    actionLabel: "Read Newsletter",
  },
  {
    id: "10",
    type: "vendor",
    priority: "medium",
    title: "Vendor Sale Extended",
    message:
      "Good news! SportsCorp has extended their 25% off sale through the weekend.",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    read: false,
    actionUrl: "/vendors/sportscorp",
    actionLabel: "Shop Sale",
    metadata: {
      vendorId: "sportscorp",
      discount: 25,
    },
  },
  {
    id: "11",
    type: "order",
    priority: "low",
    title: "Order Confirmation",
    message:
      "Thank you for your order #ORD-2024-003. We'll notify you when it ships.",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    read: true,
    actionUrl: "/orders/ORD-2024-003",
    actionLabel: "View Order",
    metadata: {
      orderId: "ORD-2024-003",
    },
  },
  {
    id: "12",
    type: "system",
    priority: "high",
    title: "Password Reset Successful",
    message:
      "Your password was successfully reset on Dec 15, 2024. If this wasn't you, please contact support immediately.",
    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    read: true,
    actionUrl: "/settings/security",
    actionLabel: "Review Security",
  },
];

interface NotificationGroup {
  title: string;
  notifications: Notification[];
}

// Mock notifications hook
function useNotifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>(DUMMY_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationsByType = (type: NotificationType) => {
    return notifications.filter((n) => n.type === type);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByType,
  };
}

function NotificationCard({
  notification,
  onRead,
  onDelete,
  isSelected,
  onSelect,
}: {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
}) {
  const router = useRouter();
  const Icon = notificationIcons[notification.type];
  const iconColor = notificationColors[notification.type];

  const handleAction = () => {
    if (notification.actionUrl) {
      if (!notification.read) {
        onRead(notification.id);
      }
      router.push(notification.actionUrl);
    }
  };

  const handleCardClick = () => {
    if (!notification.read) {
      onRead(notification.id);
    }
  };

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md cursor-pointer",
        !notification.read && "bg-primary/5 border-primary/20"
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) =>
              onSelect(notification.id, checked as boolean)
            }
            onClick={(e) => e.stopPropagation()}
            className="mt-1"
          />

          <div
            className={cn(
              "p-2 rounded-lg bg-background",
              iconColor,
              "bg-opacity-10"
            )}
          >
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <Badge
                      variant="default"
                      className="h-2 w-2 p-0 rounded-full"
                    />
                  )}
                  {notification.priority === "high" && (
                    <Badge
                      variant="destructive"
                      className="text-xs px-1.5 py-0"
                    >
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {notification.message}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.timestamp), {
                      addSuffix: true,
                    })}
                  </span>
                  {notification.actionLabel && (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction();
                      }}
                    >
                      {notification.actionLabel}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!notification.read && (
                    <DropdownMenuItem onClick={() => onRead(notification.id)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as read
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => onDelete(notification.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function groupNotificationsByTime(
  notifications: Notification[]
): NotificationGroup[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const groups: NotificationGroup[] = [];
  const todayNotifications: Notification[] = [];
  const yesterdayNotifications: Notification[] = [];
  const thisWeekNotifications: Notification[] = [];
  const olderNotifications: Notification[] = [];

  notifications.forEach((notification) => {
    const date = new Date(notification.timestamp);

    if (date >= today) {
      todayNotifications.push(notification);
    } else if (date >= yesterday) {
      yesterdayNotifications.push(notification);
    } else if (date >= weekAgo) {
      thisWeekNotifications.push(notification);
    } else {
      olderNotifications.push(notification);
    }
  });

  if (todayNotifications.length > 0) {
    groups.push({ title: "Today", notifications: todayNotifications });
  }
  if (yesterdayNotifications.length > 0) {
    groups.push({ title: "Yesterday", notifications: yesterdayNotifications });
  }
  if (thisWeekNotifications.length > 0) {
    groups.push({ title: "This Week", notifications: thisWeekNotifications });
  }
  if (olderNotifications.length > 0) {
    groups.push({ title: "Older", notifications: olderNotifications });
  }

  return groups;
}

export default function NotificationsPage() {
  const router = useRouter();
  // Mock user for frontend-only app
  const user = { id: "1", email: "test@gmail.com", name: "Test User" };
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByType,
  } = useNotifications();

  const [filterType, setFilterType] = useState<"all" | NotificationType>("all");
  const [selectedNotifications, setSelectedNotifications] = useState<
    Set<string>
  >(new Set());
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/notifications");
    }
  }, [router]);

  const filteredNotifications =
    filterType === "all" ? notifications : getNotificationsByType(filterType);

  const displayedNotifications = showUnreadOnly
    ? filteredNotifications.filter((n) => !n.read)
    : filteredNotifications;

  const groupedNotifications = groupNotificationsByTime(displayedNotifications);

  const handleSelectNotification = (id: string, checked: boolean) => {
    setSelectedNotifications((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(
        new Set(displayedNotifications.map((n) => n.id))
      );
    } else {
      setSelectedNotifications(new Set());
    }
  };

  const handleBulkDelete = () => {
    selectedNotifications.forEach((id) => {
      deleteNotification(id);
    });
    setSelectedNotifications(new Set());
    toast.success(`${selectedNotifications.size} notifications deleted`);
  };

  const handleBulkMarkAsRead = () => {
    selectedNotifications.forEach((id) => {
      markAsRead(id);
    });
    setSelectedNotifications(new Set());
    toast.success(`${selectedNotifications.size} notifications marked as read`);
  };

  if (!user) {
    return null;
  }

  return (
    <PageLayout
      title="Notifications"
      description={
        unreadCount > 0
          ? `You have ${unreadCount} unread notification${
              unreadCount === 1 ? "" : "s"
            }`
          : "You're all caught up!"
      }
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Notifications" },
      ]}
    >
      {/* Header Actions */}
      <div className="flex justify-end mb-8">
        <div className="flex items-center gap-2">
          {selectedNotifications.size > 0 ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkMarkAsRead}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selectedNotifications.size})
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <Check className="mr-2 h-4 w-4" />
                Mark all read
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => router.push("/settings?tab=email")}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Email Preferences
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={clearAllNotifications}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All Notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <Tabs
          value={filterType}
          onValueChange={(value) =>
            setFilterType(value as "all" | NotificationType)
          }
        >
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="all">
              All {notifications.length > 0 && `(${notifications.length})`}
            </TabsTrigger>
            <TabsTrigger value="order">Orders</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="promotion">Promotions</TabsTrigger>
            <TabsTrigger value="vendor">Vendors</TabsTrigger>
            <TabsTrigger value="price_alert">Price Alerts</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={
                  selectedNotifications.size ===
                    displayedNotifications.length &&
                  displayedNotifications.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">Select all</span>
            </div>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2">
              <Checkbox
                checked={showUnreadOnly}
                onCheckedChange={(checked) =>
                  setShowUnreadOnly(checked as boolean)
                }
              />
              <span className="text-sm text-muted-foreground">Unread only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {displayedNotifications.length === 0 ? (
        <EmptyStates.NoNotifications />
      ) : (
        <div className="space-y-6">
          {groupedNotifications.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onRead={markAsRead}
                    onDelete={deleteNotification}
                    isSelected={selectedNotifications.has(notification.id)}
                    onSelect={handleSelectNotification}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}

// "use client";

// import { formatDistanceToNow } from "date-fns";
// import {
//   AlertCircle,
//   ArrowRight,
//   Bell,
//   Check,
//   CheckCircle,
//   MoreVertical,
//   Package,
//   Settings,
//   Store,
//   Tag,
//   Trash2,
//   TrendingDown,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import PageLayout from "@/components/layout/PageLayout";
// import { EmptyStates } from "@/components/shared/EmptyState";
// import { Badge } from "@/components/UI/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/UI/card";
// import { Checkbox } from "@/components/UI/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/UI/dropdown-menu";
// import { Separator } from "@/components/UI/separator";
// import { Tabs, TabsList, TabsTrigger } from "@/components/UI/tabs";
// // import {
// //   type Notification,
// //   type NotificationType,
// //   useNotifications,
// // } from "@/context/NotificationContext";
// import { cn } from "@/lib/utils";
// import { NotificationType } from "@/lib/types";

// const notificationIcons: Record<NotificationType, React.ElementType> = {
//   order: Package,
//   system: AlertCircle,
//   promotion: Tag,
//   vendor: Store,
//   price_alert: TrendingDown,
// };

// const notificationColors: Record<NotificationType, string> = {
//   order: "text-blue-500",
//   system: "text-gray-500",
//   promotion: "text-purple-500",
//   vendor: "text-green-500",
//   price_alert: "text-orange-500",
// };

// interface NotificationGroup {
//   title: string;
//   notifications: Notification[];
// }

// function NotificationCard({
//   notification,
//   onRead,
//   onDelete,
//   isSelected,
//   onSelect,
// }: {
//   notification: Notification;
//   onRead: (id: string) => void;
//   onDelete: (id: string) => void;
//   isSelected: boolean;
//   onSelect: (id: string, checked: boolean) => void;
// }) {
//   const router = useRouter();
//   // const Icon = notificationIcons[notification.type];
//   // const iconColor = notificationColors[notification.type];

//   const handleAction = () => {
//     // if (notification.actionUrl) {
//     //   if (!notification.read) {
//     //     onRead(notification.id);
//     //   }
//       // router.push(notification.actionUrl);
//     }
//   };

//   const handleCardClick = () => {
//     // if (!notification.read) {
//     //   onRead(notification.id);
//     // }
//   };

//   return (
//     <Card
//       className={cn(
//         "transition-all hover:shadow-md cursor-pointer",
//         !notification.read && "bg-primary/5 border-primary/20"
//       )}
//       onClick={handleCardClick}
//     >
//       <CardContent className="p-4">
//         <div className="flex items-start gap-4">
//           <Checkbox
//             checked={isSelected}
//             onCheckedChange={(checked) =>
//               onSelect(notification.id, checked as boolean)
//             }
//             onClick={(e) => e.stopPropagation()}
//             className="mt-1"
//           />

//           <div
//             className={cn(
//               "p-2 rounded-lg bg-background",
//               iconColor,
//               "bg-opacity-10"
//             )}
//           >
//             <Icon className={cn("h-5 w-5", iconColor)} />
//           </div>

//           <div className="flex-1 min-w-0">
//             <div className="flex items-start justify-between gap-2">
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-1">
//                   <h3 className="font-semibold text-sm">
//                     {notification.title}
//                   </h3>
//                   {!notification.read && (
//                     <Badge
//                       variant="default"
//                       className="h-2 w-2 p-0 rounded-full"
//                     />
//                   )}
//                   {notification.priority === "high" && (
//                     <Badge
//                       variant="destructive"
//                       className="text-xs px-1.5 py-0"
//                     >
//                       Urgent
//                     </Badge>
//                   )}
//                 </div>
//                 <p className="text-sm text-muted-foreground line-clamp-2">
//                   {notification.message}
//                 </p>
//                 <div className="flex items-center gap-4 mt-2">
//                   <span className="text-xs text-muted-foreground">
//                     {formatDistanceToNow(new Date(notification.timestamp), {
//                       addSuffix: true,
//                     })}
//                   </span>
//                   {notification.actionLabel && (
//                     <Button
//                       variant="link"
//                       size="sm"
//                       className="h-auto p-0 text-xs"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleAction();
//                       }}
//                     >
//                       {notification.actionLabel}
//                       <ArrowRight className="ml-1 h-3 w-3" />
//                     </Button>
//                   )}
//                 </div>
//               </div>

//               <DropdownMenu>
//                 <DropdownMenuTrigger
//                   asChild
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                     <MoreVertical className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   {!notification.read && (
//                     <DropdownMenuItem onClick={() => onRead(notification.id)}>
//                       <CheckCircle className="mr-2 h-4 w-4" />
//                       Mark as read
//                     </DropdownMenuItem>
//                   )}
//                   <DropdownMenuItem
//                     onClick={() => onDelete(notification.id)}
//                     className="text-destructive"
//                   >
//                     <Trash2 className="mr-2 h-4 w-4" />
//                     Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function groupNotificationsByTime(
//   notifications: Notification[]
// ): NotificationGroup[] {
//   const now = new Date();
//   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//   const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
//   const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

//   const groups: NotificationGroup[] = [];
//   const todayNotifications: Notification[] = [];
//   const yesterdayNotifications: Notification[] = [];
//   const thisWeekNotifications: Notification[] = [];
//   const olderNotifications: Notification[] = [];

//   notifications.forEach((notification) => {
//     const date = new Date(notification.timestamp);

//     if (date >= today) {
//       todayNotifications.push(notification);
//     } else if (date >= yesterday) {
//       yesterdayNotifications.push(notification);
//     } else if (date >= weekAgo) {
//       thisWeekNotifications.push(notification);
//     } else {
//       olderNotifications.push(notification);
//     }
//   });

//   if (todayNotifications.length > 0) {
//     groups.push({ title: "Today", notifications: todayNotifications });
//   }
//   if (yesterdayNotifications.length > 0) {
//     groups.push({ title: "Yesterday", notifications: yesterdayNotifications });
//   }
//   if (thisWeekNotifications.length > 0) {
//     groups.push({ title: "This Week", notifications: thisWeekNotifications });
//   }
//   if (olderNotifications.length > 0) {
//     groups.push({ title: "Older", notifications: olderNotifications });
//   }

//   return groups;
// }

// export default function NotificationsPage() {
//   const router = useRouter();
//   // Mock user for frontend-only app
//   const user = { id: "1", email: "test@gmail.com", name: "Test User" };
//   const {
//     notifications,
//     unreadCount,
//     markAsRead,
//     markAllAsRead,
//     deleteNotification,
//     clearAllNotifications,
//     getNotificationsByType,
//   } = useNotifications();

//   const [filterType, setFilterType] = useState<"all" | NotificationType>("all");
//   const [selectedNotifications, setSelectedNotifications] = useState<
//     Set<string>
//   >(new Set());
//   const [showUnreadOnly, setShowUnreadOnly] = useState(false);

//   useEffect(() => {
//     if (!user) {
//       router.push("/login?redirect=/notifications");
//     }
//   }, [router]);

//   const filteredNotifications =
//     filterType === "all" ? notifications : getNotificationsByType(filterType);

//   const displayedNotifications = showUnreadOnly
//     ? filteredNotifications.filter((n) => !n.read)
//     : filteredNotifications;

//   const groupedNotifications = groupNotificationsByTime(displayedNotifications);

//   const handleSelectNotification = (id: string, checked: boolean) => {
//     setSelectedNotifications((prev) => {
//       const newSet = new Set(prev);
//       if (checked) {
//         newSet.add(id);
//       } else {
//         newSet.delete(id);
//       }
//       return newSet;
//     });
//   };

//   const handleSelectAll = (checked: boolean) => {
//     if (checked) {
//       setSelectedNotifications(
//         new Set(displayedNotifications.map((n) => n.id))
//       );
//     } else {
//       setSelectedNotifications(new Set());
//     }
//   };

//   const handleBulkDelete = () => {
//     selectedNotifications.forEach((id) => {
//       deleteNotification(id);
//     });
//     setSelectedNotifications(new Set());
//     toast.success(`${selectedNotifications.size} notifications deleted`);
//   };

//   const handleBulkMarkAsRead = () => {
//     selectedNotifications.forEach((id) => {
//       markAsRead(id);
//     });
//     setSelectedNotifications(new Set());
//     toast.success(`${selectedNotifications.size} notifications marked as read`);
//   };

//   if (!user) {
//     return null;
//   }

//   return (
//     <PageLayout
//       title="Notifications"
//       description={
//         unreadCount > 0
//           ? `You have ${unreadCount} unread notification${
//               unreadCount === 1 ? "" : "s"
//             }`
//           : "You're all caught up!"
//       }
//       breadcrumbs={[
//         { label: "Dashboard", href: "/dashboard" },
//         { label: "Notifications" },
//       ]}
//     >
//       {/* Header Actions */}
//       <div className="flex justify-end mb-8">
//         <div className="flex items-center gap-2">
//           {selectedNotifications.size > 0 ? (
//             <>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleBulkMarkAsRead}
//               >
//                 <CheckCircle className="mr-2 h-4 w-4" />
//                 Mark as read
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleBulkDelete}
//                 className="text-destructive hover:text-destructive"
//               >
//                 <Trash2 className="mr-2 h-4 w-4" />
//                 Delete ({selectedNotifications.size})
//               </Button>
//             </>
//           ) : (
//             <>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={markAllAsRead}
//                 disabled={unreadCount === 0}
//               >
//                 <Check className="mr-2 h-4 w-4" />
//                 Mark all read
//               </Button>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" size="sm">
//                     <Settings className="mr-2 h-4 w-4" />
//                     Settings
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem
//                     onClick={() => router.push("/settings?tab=email")}
//                   >
//                     <Bell className="mr-2 h-4 w-4" />
//                     Email Preferences
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem
//                     onClick={clearAllNotifications}
//                     className="text-destructive"
//                   >
//                     <Trash2 className="mr-2 h-4 w-4" />
//                     Clear All Notifications
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="mb-6 space-y-4">
//         <Tabs
//           value={filterType}
//           onValueChange={(value) =>
//             setFilterType(value as "all" | NotificationType)
//           }
//         >
//           <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
//             <TabsTrigger value="all">
//               All {notifications.length > 0 && `(${notifications.length})`}
//             </TabsTrigger>
//             <TabsTrigger value="order">Orders</TabsTrigger>
//             <TabsTrigger value="system">System</TabsTrigger>
//             <TabsTrigger value="promotion">Promotions</TabsTrigger>
//             <TabsTrigger value="vendor">Vendors</TabsTrigger>
//             <TabsTrigger value="price_alert">Price Alerts</TabsTrigger>
//           </TabsList>
//         </Tabs>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <Checkbox
//                 checked={
//                   selectedNotifications.size ===
//                     displayedNotifications.length &&
//                   displayedNotifications.length > 0
//                 }
//                 onCheckedChange={handleSelectAll}
//               />
//               <span className="text-sm text-muted-foreground">Select all</span>
//             </div>
//             <Separator orientation="vertical" className="h-5" />
//             <div className="flex items-center gap-2">
//               <Checkbox
//                 checked={showUnreadOnly}
//                 onCheckedChange={(checked) =>
//                   setShowUnreadOnly(checked as boolean)
//                 }
//               />
//               <span className="text-sm text-muted-foreground">Unread only</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Notifications List */}
//       {displayedNotifications.length === 0 ? (
//         <EmptyStates.NoNotifications />
//       ) : (
//         <div className="space-y-6">
//           {groupedNotifications.map((group) => (
//             <div key={group.title}>
//               <h3 className="text-sm font-medium text-muted-foreground mb-3">
//                 {group.title}
//               </h3>
//               <div className="space-y-2">
//                 {group.notifications.map((notification) => (
//                   <NotificationCard
//                     key={notification.id}
//                     notification={notification}
//                     onRead={markAsRead}
//                     onDelete={deleteNotification}
//                     isSelected={selectedNotifications.has(notification.id)}
//                     onSelect={handleSelectNotification}
//                   />
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </PageLayout>
//   );
// }
