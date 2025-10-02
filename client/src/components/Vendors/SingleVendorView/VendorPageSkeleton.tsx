/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card, CardContent } from "@/components/UI/card";
import { Skeleton } from "@/components/UI/skeleton";

function VendorPageSkeleton() {
  return (
    <Card className="mb-8 border-0 shadow-none">
      <CardContent className="p-0 space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Skeleton */}
          <div className="lg:w-80 w-full space-y-4">
            <div className="text-center bg-card rounded-lg p-6 border">
              <Skeleton className="w-20 h-20 rounded-full mx-auto mb-3" />
              <Skeleton className="h-6 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 mx-auto" />
                <Skeleton className="h-4 w-36 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
                <Skeleton className="h-4 w-40 mx-auto" />
              </div>
            </div>
            <div className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="flex flex-wrap gap-1">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1">
            <div className="space-y-6">
              <Skeleton className="h-8 w-32" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-10 w-32" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }, (_, index) => ({
                    id: `vendor-gallery-skeleton-${index}-${Math.random()
                      .toString(36)
                      .substr(2, 9)}`,
                    index,
                  })).map((item) => (
                    <Skeleton key={item.id} className="h-64 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default VendorPageSkeleton;
