/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import moment from "moment";
import { Edit2, Eye, MoreVertical, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import { Pagination } from "antd"; // ✅ Ant Design Pagination
import { useVendorDashboarRecentOrderQuery } from "@/redux/features/vendors/VendorDashboard";

export function OrdersTable() {
  // 🔹 Pagination States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useVendorDashboarRecentOrderQuery({ page, limit });
  const allOrders = data?.data?.attributes?.orders || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800">Shipped</Badge>;
      case "completed":
      case "conformed":
        return <Badge className="bg-green-100 text-green-800 capitalize">{status}</Badge>;
      default:
        return <Badge variant="outline" className="capitalize">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return moment(dateString).format("MMM DD, YYYY - hh:mm A");
  };

  if (isLoading) {
    return <p className="text-center py-8">Loading orders...</p>;
  }

  if (allOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto bg-muted rounded-full flex items-center justify-center mb-6 w-24 h-24">
          <ShoppingCart className="text-muted-foreground h-12 w-12" />
        </div>
        <h3 className="font-semibold mb-2 text-xl">No orders found</h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Your orders will appear here once customers start purchasing.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>User Type</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allOrders.map((order: any) => (
            <TableRow key={order.orderMongoId}>
              <TableCell>
                <div className="font-medium">{order.orderId}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={order.userImage ? `${process.env.NEXT_PUBLIC_BASE_URL}${order.userImage}` : ''}
                    alt={order.userName}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{order.userName}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="capitalize">{order.userType}</TableCell>
              <TableCell className="font-medium">
                {formatCurrency(order.totalPrice)}
              </TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell className="text-sm">{formatDate(order.orderDate)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Update Status
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ✅ Ant Design Pagination */}
      <div className="flex  justify-end items-center px-4 py-3">
        <Pagination
          
          current={page}
          pageSize={limit}
          // showSizeChanger
          onChange={(newPage, newLimit) => {
            setPage(newPage);
            setLimit(newLimit);
          }}
          className="bg-white rounded-2xl "
        />
      </div>
    </div>
  );
}
