/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { Package } from "lucide-react";
import React from "react";

function RecentOrderOverview({ allTopSelling }: { allTopSelling: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
        <CardDescription>
          Your best performing products this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(!allTopSelling || allTopSelling.length === 0) ? (
          <div className="text-center py-8">
            <Package className="h-8 w-8 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No sales data yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allTopSelling.map((product: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {product.productName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.category} • {product.totalSales} sales
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">
                    AED {product.totalSales * 10 /* Example revenue */}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentOrderOverview;
