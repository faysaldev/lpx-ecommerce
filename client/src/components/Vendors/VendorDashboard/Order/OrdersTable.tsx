/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import moment from "moment";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/UI/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import { useVendorDashboarRecentOrderQuery } from "@/redux/features/vendors/VendorDashboard";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/helpers";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/UI/pagination"; // Adjust import path as needed

export function OrdersTable() {
  // 🔹 Pagination States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useVendorDashboarRecentOrderQuery({
    page,
    limit,
  });
  const allOrders = data?.data?.attributes?.orders || [];
  const totalPages = data?.data?.attributes?.totalPages || 1;
  const currentPage = page;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Confirmed</Badge>
        );
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800">Shipped</Badge>;
      case "completed":
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 capitalize">
            {status}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="capitalize">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return moment(dateString).format("MMM DD, YYYY - hh:mm A");
  };

  // Generate page numbers with ellipsis
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're at the beginning
      if (currentPage <= 2) {
        end = 4;
      }

      // Adjust if we're at the end
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("ellipsis-end");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
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

  const pageNumbers = generatePageNumbers();

  return (
    <div className="space-y-4">
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
                      src={order.userImage ? order?.userImage : ""}
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
                <TableCell className="text-sm">
                  {formatDate(order.orderDate)}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/orders/${order.id}`}
                    className=" cursor-pointer underline"
                  >
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {/* Page Numbers */}
            {pageNumbers.map((pageNum, index) => (
              <PaginationItem key={index}>
                {pageNum === "ellipsis-start" || pageNum === "ellipsis-end" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={currentPage === pageNum}
                    onClick={() => handlePageChange(pageNum as number)}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
