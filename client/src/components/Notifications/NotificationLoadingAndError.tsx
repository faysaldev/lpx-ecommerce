/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import PageLayout from "../layout/PageLayout";
import { Button } from "../UI/button";
import { AlertCircle } from "lucide-react";

export function NotificationError({ refetch }: any) {
  return (
    <PageLayout
      title="Notifications"
      description="Error loading notifications"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Notifications" },
      ]}
    >
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Failed to load notifications
          </h3>
          <p className="text-muted-foreground mb-4">
            There was an error loading your notifications. Please try again.
          </p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    </PageLayout>
  );
}

export function NotificationLoading() {
  return (
    <PageLayout
      title="Notifications"
      description="Loading your notifications..."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Notifications" },
      ]}
    >
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    </PageLayout>
  );
}
