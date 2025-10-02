import React from "react";
import PageLayout from "../layout/PageLayout";
import { Card, CardContent } from "../UI/card";

function OrderLoader() {
  return (
    <PageLayout
      title="Order History"
      description="View and manage your past orders"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Order History" },
      ]}
    >
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}

export default OrderLoader;
