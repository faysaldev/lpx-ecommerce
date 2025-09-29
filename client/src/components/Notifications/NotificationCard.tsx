/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, CheckCircle, MoreVertical, Trash2 } from "lucide-react";

import { useRouter } from "next/navigation";

import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";

import { cn } from "@/lib/utils";
import { Notification } from "@/lib/types";

export default function NotificationCard({
  notification,
  onRead,
  onDelete,
  notificationColors,
  notificationIcons,
}: {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  notificationIcons: any;
  notificationColors: any;
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
                      className="h-2 w-2 p-0 rounded-full bg-blue-500"
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
                  {notification.actionLabel && notification.actionUrl && (
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
