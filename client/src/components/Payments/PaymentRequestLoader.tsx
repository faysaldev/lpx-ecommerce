import React from "react";
import PageLayout from "../layout/PageLayout";
import { Card, CardContent } from "../UI/card";

function PaymentRequestLoader() {
  return (
    <PageLayout
      title="Payment Requests"
      description="Manage your payment requests and track payment status"
      breadcrumbs={[
        { label: "Vendor", href: "/vendor/dashboard" },
        { label: "Payment Requests" },
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={`skeleton-${i}`}>
              <CardContent className="p-6">
                <div className="h-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="h-64 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}

export default PaymentRequestLoader;
