/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Check, CheckCircle, RefreshCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import { Button } from "@/components/UI/button";
import { Separator } from "@/components/UI/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/UI/tabs";
import {
  NotificationType,
  Notification,
  ApiNotification,
  NotificationGroup,
} from "@/lib/types";
import {
  useAllGetNotificationsQuery,
  useUpdateNotificationsMutation,
  useSingleDeleteMutation,
  useAllNotificationsReadMutation,
  useAllDeleteNotificationsMutation,
} from "@/redux/features/Notifications/Notifications";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  mapFrontendTypeToBackend,
  notificationColors,
  notificationIcons,
  transformApiNotification,
} from "../../../components/Notifications/NotificationHealper";
import NotificationCard from "@/components/Notifications/NotificationCard";
import {
  NotificationError,
  NotificationLoading,
} from "@/components/Notifications/NotificationLoadingAndError";

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
  const user = useAppSelector(selectCurrentUser);

  const [filterType, setFilterType] = useState<"all" | NotificationType>("all");
  const [selectedNotifications, setSelectedNotifications] = useState<
    Set<string>
  >(new Set());
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Get backend type for API call
  const backendType = mapFrontendTypeToBackend(filterType);

  const { data, isLoading, isError, refetch } = useAllGetNotificationsQuery(
    filterType === "all" ? { type: "all" } : { type: backendType }
  );

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [updateNotification] = useUpdateNotificationsMutation();
  const [deleteSingleNotification] = useSingleDeleteMutation();
  const [markAllAsReadApi] = useAllNotificationsReadMutation();
  const [bulkDeleteNotifications] = useAllDeleteNotificationsMutation();

  // Transform API data to notifications
  useEffect(() => {
    if (data?.data?.attributes) {
      const apiNotifications = data.data.attributes;

      if (Array.isArray(apiNotifications)) {
        const transformedNotifications = apiNotifications
          .filter((item: ApiNotification) => !item.isDeleted) // Filter out deleted notifications
          .map(transformApiNotification);

        setNotifications(transformedNotifications);
      }
    }
  }, [data]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/notifications");
    }
  }, [user, router]);

  const markAsRead = async (id: string) => {
    try {
      await updateNotification(id).unwrap();

      // Update local state optimistically
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );

      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
      // Refetch to sync with server
      refetch();
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllAsReadApi(undefined).unwrap();

      // Update local state optimistically
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
      refetch();
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteSingleNotification(id).unwrap();

      // Update local state optimistically
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );

      // Remove from selected notifications
      setSelectedNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });

      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
      refetch();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications.size === 0) return;

    try {
      const notificationIds = Array.from(selectedNotifications);
      await bulkDeleteNotifications(notificationIds).unwrap();

      // Update local state optimistically
      setNotifications((prev) =>
        prev.filter(
          (notification) => !selectedNotifications.has(notification.id)
        )
      );

      toast.success(`${selectedNotifications.size} notifications deleted`);
      setSelectedNotifications(new Set());
    } catch (error) {
      console.error("Error bulk deleting notifications:", error);
      toast.error("Failed to delete notifications");
      refetch();
    }
  };

  const handleBulkMarkAsRead = async () => {
    if (selectedNotifications.size === 0) return;

    try {
      // Mark each selected notification as read
      const promises = Array.from(selectedNotifications).map((id) =>
        updateNotification(id).unwrap()
      );

      await Promise.all(promises);

      // Update local state optimistically
      setNotifications((prev) =>
        prev.map((notification) =>
          selectedNotifications.has(notification.id)
            ? { ...notification, read: true }
            : notification
        )
      );

      toast.success(
        `${selectedNotifications.size} notifications marked as read`
      );
      setSelectedNotifications(new Set());
    } catch (error) {
      console.error("Error bulk marking notifications as read:", error);
      toast.error("Failed to mark notifications as read");
      refetch();
    }
  };

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

  // Filter notifications based on current filters
  const filteredNotifications =
    filterType === "all"
      ? notifications
      : notifications.filter((n) => n.type === filterType);

  const displayedNotifications = showUnreadOnly
    ? filteredNotifications.filter((n) => !n.read)
    : filteredNotifications;

  const groupedNotifications = groupNotificationsByTime(displayedNotifications);

  if (isLoading) {
    return <NotificationLoading />;
  }

  if (isError) {
    return <NotificationError refetch={refetch} />;
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

              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
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
            <TabsTrigger value="order">
              Orders ({notifications.filter((n) => n.type === "order").length})
            </TabsTrigger>
            <TabsTrigger value="system">
              System ({notifications.filter((n) => n.type === "system").length})
            </TabsTrigger>
            <TabsTrigger value="promotion">
              Promotions (
              {notifications.filter((n) => n.type === "promotion").length})
            </TabsTrigger>
            <TabsTrigger value="vendor">
              Vendors ({notifications.filter((n) => n.type === "vendor").length}
              )
            </TabsTrigger>
            <TabsTrigger value="price_alert">
              Price Alerts (
              {notifications.filter((n) => n.type === "price_alert").length})
            </TabsTrigger>
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
                disabled={displayedNotifications.length === 0}
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

          {displayedNotifications.length > 0 && (
            <span className="text-sm text-muted-foreground">
              Showing {displayedNotifications.length} notification
              {displayedNotifications.length !== 1 ? "s" : ""}
            </span>
          )}
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
                    notificationColors={notificationColors}
                    notificationIcons={notificationIcons}
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
