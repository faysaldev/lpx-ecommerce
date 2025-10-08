/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import { TabsContent } from "@/components/UI/tabs";
import { formatCurrency, formatDate } from "@/lib/utils/helpers";
import { Users } from "lucide-react";
import React from "react";

function PaymentVendorAnalysis({ vendorSummaries }: { vendorSummaries: any }) {
  return (
    <TabsContent value="vendors" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vendor Payment Summaries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Total Earnings</TableHead>
                  <TableHead>Paid Amount</TableHead>
                  <TableHead>Pending Amount</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Avg Order Value</TableHead>
                  <TableHead>Last Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorSummaries.map((vendor: any) => (
                  <TableRow key={vendor.vendorId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{vendor.vendorName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(vendor.totalEarnings)}
                    </TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {formatCurrency(vendor.paidAmount)}
                    </TableCell>
                    <TableCell className="text-yellow-600 font-medium">
                      {formatCurrency(vendor.pendingAmount)}
                    </TableCell>
                    <TableCell>{vendor.totalOrders}</TableCell>
                    <TableCell>
                      {formatCurrency(vendor.averageOrderValue)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {vendor.lastPaymentDate
                        ? formatDate(vendor.lastPaymentDate, {
                            hour: undefined,
                            minute: undefined,
                          })
                        : "No payments yet"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default PaymentVendorAnalysis;
