/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import { Button } from "@/components/UI/button";
import { Checkbox } from "@/components/UI/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { TableCell, TableRow } from "@/components/UI/table";
import { Calendar } from "antd";
import {
  CheckCircle,
  Eye,
  Mail,
  MapPin,
  MoreHorizontal,
  Star,
  Store,
  XCircle,
} from "lucide-react";
import React from "react";

function SingleRow({
  vendor,
  statusFilter,
  handleSelectVendor,
  selectedVendors,
  handleVendorAction,
  getStatusBadge,
  formatDate,
  handleViewVendorDetails,
}: any) {
  return (
    <>
      <TableRow key={vendor.id}>
        {statusFilter === "pending" && vendor.status === "pending" && (
          <TableCell>
            <Checkbox
              checked={selectedVendors.has(vendor.id)}
              onCheckedChange={(checked) =>
                handleSelectVendor(vendor.id, checked as boolean)
              }
            />
          </TableCell>
        )}
        {statusFilter === "pending" && vendor.status !== "pending" && (
          <TableCell></TableCell>
        )}
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={vendor.avatar} />
              <AvatarFallback>
                {vendor.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{vendor.name}</p>
              <p className="text-xs text-muted-foreground">{vendor.email}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <span className="font-medium">{vendor.owner}</span>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">
              {vendor.location.city}, {vendor.location.country}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <span className="font-medium">{vendor.products}</span>
        </TableCell>
        <TableCell>
          <span className="font-medium">{vendor.sales}</span>
        </TableCell>
        <TableCell>
          <span className="font-medium">
            ${vendor.revenue.toLocaleString()}
          </span>
        </TableCell>
        <TableCell>
          {vendor.rating > 0 ? (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-medium">{vendor.rating}</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">No ratings</span>
          )}
        </TableCell>
        <TableCell>
          {getStatusBadge(vendor.status)}
          {vendor.status === "pending" && (
            <div className="flex gap-1 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleVendorAction(vendor, "approve")}
                className="h-6 px-2 text-xs text-green-600 border-green-200 hover:bg-green-50"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleVendorAction(vendor, "reject")}
                className="h-6 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="h-3 w-3 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{formatDate(vendor.joined)}</span>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewVendorDetails(vendor)}>
                <Eye className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Store className="mr-2 h-4 w-4" />
                View Products
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {vendor.status === "pending" && (
                <>
                  <DropdownMenuItem
                    onClick={() => handleVendorAction(vendor, "approve")}
                    className="text-green-600"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Vendor
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleVendorAction(vendor, "reject")}
                    className="text-destructive"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Application
                  </DropdownMenuItem>
                </>
              )}
              {vendor.status === "verified" && (
                <DropdownMenuItem
                  onClick={() => handleVendorAction(vendor, "reject")}
                  className="text-destructive"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Suspend Vendor
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </>
  );
}

export default SingleRow;
