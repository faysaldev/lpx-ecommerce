/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useAllGetNotificationsQuery, useUpdateNotificationsMutation, useSingleDeleteMutation, useAllNotificationsReadMutation } from "@/redux/features/Notifications/Notifications";

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



interface NotificationGroup {
  title: string;
  notifications: Notification[];
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
  
  const [filterType, setFilterType] = useState<"all" | NotificationType>("all");
  
  // Map frontend filterType to backend type
  const mapFilterTypeToBackend = (frontendType: "all" | NotificationType): string => {
    switch(frontendType) {
      case 'order':
        return 'orders';
      case 'system':
      case 'promotion': 
      case 'vendor':
      case 'price_alert':
        return frontendType; // These match the backend types
      default:
        return 'orders'; // default to orders
    }
  };
  
  const backendType = filterType === 'all' ? 'orders' : mapFilterTypeToBackend(filterType);
  const {data, isLoading, isError} = useAllGetNotificationsQuery({type: backendType});
  
  
  const [notifications, setNotifications] = useState<Notification[]>([]);

  
  useEffect(() => {
    if (data?.data?.attributes?.data) {
      
      const transformedNotifications: Notification[] = (data?.data?.attributes?.data || []).map((item: any) => {
        
        const mapNotificationType = (backendType: string): NotificationType => {
          switch(backendType) {
            case 'orders':
              return 'order';
            case 'system':
            case 'promotion':
            case 'vendor':
            case 'price_alert':
              return backendType as NotificationType;
            default:
              return 'system';
          }
        };

        return {
          id: item._id,
          type: mapNotificationType(item.type) || 'system', // fallback to 'system' if type is not provided
          priority: item.priority || 'medium',
          title: item.title || 'Notification',
          message: item.description || item.title || 'You have a new notification',
          timestamp: item.updatedAt || item.createdAt || new Date().toISOString(),
          read: item.isRead || false,
          actionUrl: item.transactionId ? `/orders/${item.transactionId}` : '', 
          actionLabel: 'View Details',
          metadata: {
            orderId: item.transactionId,
          }
        };
      });
      
      setNotifications(transformedNotifications);
    }
  }, [data]);

  console.log('All notification get then show', data?.data?.attributes);
  
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [selectedNotifications, setSelectedNotifications] = useState<
    Set<string>
  >(new Set());
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/notifications");
    }
  }, [router]);

  const getNotificationsByType = (type: NotificationType) => {
    return notifications.filter((n) => n.type === type);
  };

  const [updateNotification] = useUpdateNotificationsMutation();
  const [deleteSingleNotification] = useSingleDeleteMutation(); 
  const [markAllAsReadApi] = useAllNotificationsReadMutation(); 

  const markAsRead = async (id: string) => {
    try {
      // Call backend API to mark notification as read
      await updateNotification(id).unwrap();
      // Update local state to reflect the change
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );      
      console.log(`Notification ${id} marked as read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  const markAllAsRead = async () => {
    try {
      // Call backend API to mark all notifications as read
      await markAllAsReadApi(undefined).unwrap(); 
      // Update local state to reflect the change
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );      
      console.log('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      // Call backend API to delete notification
      await deleteSingleNotification(id).unwrap();  
      // Update local state to reflect the change
      setNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
      console.log(`Notification ${id} deleted`);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success('Notifications cleared locally');
  };

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


