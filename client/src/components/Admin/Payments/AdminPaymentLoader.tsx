import { Card, CardContent } from "@/components/UI/card";
import React from "react";

function AdminPaymentLoader() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Payment Management
          </h1>
          <p className="text-muted-foreground">
            Manage vendor payment requests and process payments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton loaders with predictable order
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
  );
}

export default AdminPaymentLoader;
