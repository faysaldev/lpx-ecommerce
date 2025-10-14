/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Edit2, Eye, MoreVertical, Package, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import Image from "next/image";

export function ProductTable({
  products,
  onEdit,
  onView,
  onDelete,
}: {
  products: any[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const getStatusBadge = (isDraft: boolean, inStock: boolean) => {
    if (isDraft) {
      return <Badge variant="secondary">Draft</Badge>;
    }
    if (!inStock) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto bg-muted rounded-full flex items-center justify-center mb-6 w-24 h-24">
          <Package className="text-muted-foreground h-12 w-12" />
        </div>
        <h3 className="font-semibold mb-2 text-xl">No products found</h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          You haven&apos;t created any products yet. Start by adding your first
          product to your store.
        </p>
        <Button asChild>
          <Link href="/vendor/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Product
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                <Image
                  src={
                    product.images?.[0]
                      ? `${process.env.NEXT_PUBLIC_BASE_URL}/${product.images[0]}`
                      : "/placeholder.jpg"
                  }
                  alt={product.productName}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-md border"
                />
              </TableCell>

              <TableCell>
                <div>
                  <p className="font-medium">{product.productName}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                    ID: {product._id}
                  </p>
                </div>
              </TableCell>

              <TableCell>{product.category || "N/A"}</TableCell>

              <TableCell className="font-medium">${product.price}</TableCell>

              <TableCell>{product.stockQuantity}</TableCell>

              <TableCell>
                {getStatusBadge(product.isDraft, product.inStock)}
              </TableCell>

              <TableCell>{product.vendor?.storeName || "N/A"}</TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem onClick={() => onView(product._id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => onEdit(product._id)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => onDelete(product._id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
