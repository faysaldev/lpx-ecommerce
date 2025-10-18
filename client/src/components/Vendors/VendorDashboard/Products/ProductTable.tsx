/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Edit2, Eye, MoreVertical, Trash2, Save, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import Image from "next/image";
import NoProductsInVendor from "./NoProductsInVendor";
import { useState } from "react";
import { Input } from "@/components/UI/input";
import { useProductUpdateMutation } from "@/redux/features/products/product";

interface Vendor {
  _id: string;
  storeName: string;
}

interface Product {
  _id: string;
  vendor: Vendor;
  productName: string;
  category: string;
  price: number;
  stockQuantity: number;
  images: string[];
  isDraft: boolean;
  inStock: boolean;
}

export function ProductTable({
  products,
  onEdit,
  onView,
  onDelete,
}: {
  products: Product[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<{
    [key: string]: {
      price?: number;
      stockQuantity?: number;
      status?: string;
    };
  }>({});

  const [updatingProduct] = useProductUpdateMutation();

  const getStatusBadge = (isDraft: boolean, inStock: boolean) => {
    if (isDraft) {
      return <Badge variant="secondary">Draft</Badge>;
    }
    if (!inStock) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  };

  const getCurrentStatus = (product: Product) => {
    if (product.isDraft) return "draft";
    if (!product.inStock) return "out_of_stock";
    return "active";
  };

  const startEditing = (productId: string) => {
    setEditingProduct(productId);
  };

  const cancelEditing = (productId: string) => {
    setEditingProduct(null);
    setEditedValues((prev) => {
      const newValues = { ...prev };
      delete newValues[productId];
      return newValues;
    });
  };

  const handleInputChange = (productId: string, field: string, value: any) => {
    setEditedValues((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]:
          field === "price" || field === "stockQuantity"
            ? Number(value)
            : value,
      },
    }));
  };

  const handleSave = async (product: Product) => {
    const changes = editedValues[product._id];

    if (changes) {
      const data: any = {};

      // Handle status changes
      if (changes.status && changes.status !== getCurrentStatus(product)) {
        if (changes.status === "active") {
          data.isDraft = false;
          data.inStock = true;
        } else if (changes.status === "draft") {
          data.isDraft = true;
        } else if (changes.status === "out_of_stock") {
          data.inStock = false;
          data.isDraft = false;
        }
      }

      // Handle stock quantity changes
      if (
        changes.stockQuantity !== undefined &&
        changes.stockQuantity !== product.stockQuantity
      ) {
        data.stockQuantity = changes.stockQuantity;
        // Auto update inStock based on stock quantity
        if (changes.stockQuantity === 0) {
          data.inStock = false;
        } else if (changes.stockQuantity > 0 && !product.inStock) {
          data.inStock = true;
        }
      }

      // Handle price changes
      if (changes.price !== undefined && changes.price !== product.price) {
        data.price = changes.price;
      }

      // Only send request if there are changes
      if (Object.keys(data).length > 0) {
        try {
          await updatingProduct({ id: product._id, data }).unwrap();
          console.log("Product updated successfully");
        } catch (error) {
          console.error("Failed to update product:", error);
        }
      }
    }

    // Reset editing state
    cancelEditing(product._id);
  };

  const hasChanges = (productId: string) => {
    return (
      !!editedValues[productId] &&
      Object.keys(editedValues[productId]).length > 0
    );
  };

  const isEditing = (productId: string) => {
    return editingProduct === productId;
  };

  const renderPriceCell = (product: Product) => {
    if (isEditing(product._id)) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">AED</span>
          <Input
            type="number"
            value={editedValues[product._id]?.price ?? product.price}
            onChange={(e) =>
              handleInputChange(product._id, "price", e.target.value)
            }
            className="h-8 w-24"
            min="0"
            step="0.01"
          />
        </div>
      );
    }

    return (
      <div
        className="cursor-pointer px-3 py-2 rounded-md border border-transparent hover:border-gray-300 hover:bg-gray-50 transition-colors"
        onClick={() => startEditing(product._id)}
      >
        AED {product.price}
      </div>
    );
  };

  const renderStockCell = (product: Product) => {
    if (isEditing(product._id)) {
      return (
        <Input
          type="number"
          value={
            editedValues[product._id]?.stockQuantity ?? product.stockQuantity
          }
          onChange={(e) =>
            handleInputChange(product._id, "stockQuantity", e.target.value)
          }
          className="h-8 w-20"
          min="0"
        />
      );
    }

    return (
      <div
        className="cursor-pointer px-3 py-2 rounded-md border border-transparent hover:border-gray-300 hover:bg-gray-50 transition-colors"
        onClick={() => startEditing(product._id)}
      >
        {product.stockQuantity}
      </div>
    );
  };

  const renderStatusCell = (product: Product) => {
    const currentStatus = getCurrentStatus(product);

    if (isEditing(product._id)) {
      return (
        <Select
          value={editedValues[product._id]?.status ?? currentStatus}
          onValueChange={(value) =>
            handleInputChange(product._id, "status", value)
          }
        >
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    }

    return (
      <div className="cursor-pointer" onClick={() => startEditing(product._id)}>
        {getStatusBadge(product.isDraft, product.inStock)}
      </div>
    );
  };

  if (!products || products.length === 0) {
    return <NoProductsInVendor />;
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
            <TableRow key={product._id} className="group">
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
                  <p className="font-medium truncate max-w-[170px]">
                    {product.productName}
                  </p>
                  <p className="text-sm text-muted-foreground truncate max-w-[150px]">
                    ID: {product._id}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <div className="px-3 py-2">{product.category || "N/A"}</div>
              </TableCell>

              <TableCell className="font-medium">
                {renderPriceCell(product)}
              </TableCell>

              <TableCell>{renderStockCell(product)}</TableCell>

              <TableCell>{renderStatusCell(product)}</TableCell>

              <TableCell>{product.vendor?.storeName || "N/A"}</TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {isEditing(product._id) && hasChanges(product._id) && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSave(product)}
                        className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50"
                        title="Save changes"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelEditing(product._id)}
                        className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50"
                        title="Cancel changes"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}

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
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { Edit2, Eye, MoreVertical, Trash2, Save, X } from "lucide-react";
// import { Badge } from "@/components/UI/badge";
// import { Button } from "@/components/UI/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/UI/dropdown-menu";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/UI/table";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/UI/select";
// import Image from "next/image";
// import NoProductsInVendor from "./NoProductsInVendor";
// import { useState } from "react";
// import { Input } from "@/components/UI/input";
// import { useProductUpdateMutation } from "@/redux/features/products/product";

// interface Vendor {
//   _id: string;
//   storeName: string;
// }

// interface Product {
//   _id: string;
//   vendor: Vendor;
//   productName: string;
//   category: string;
//   price: number;
//   stockQuantity: number;
//   images: string[];
//   isDraft: boolean;
//   inStock: boolean;
// }

// export function ProductTable({
//   products,
//   onEdit,
//   onView,
//   onDelete,
// }: {
//   products: Product[];
//   onEdit: (id: string) => void;
//   onView: (id: string) => void;
//   onDelete: (id: string) => void;
// }) {
//   const [editingField, setEditingField] = useState<{
//     productId: string;
//     field: string;
//     value: any;
//   } | null>(null);

//   const [updatingProduct] = useProductUpdateMutation();

//   const [editedValues, setEditedValues] = useState<{
//     [key: string]: any;
//   }>({});

//   const getStatusBadge = (isDraft: boolean, inStock: boolean) => {
//     if (isDraft) {
//       return <Badge variant="secondary">Draft</Badge>;
//     }
//     if (!inStock) {
//       return <Badge variant="destructive">Out of Stock</Badge>;
//     }
//     return <Badge className="bg-green-100 text-green-800">Active</Badge>;
//   };

//   const handleDoubleClick = (
//     productId: string,
//     field: string,
//     currentValue: any
//   ) => {
//     setEditingField({ productId, field, value: currentValue });
//     setEditedValues((prev) => ({
//       ...prev,
//       [productId]: {
//         ...prev[productId],
//         [field]: currentValue,
//       },
//     }));
//   };

//   const handleInputChange = (value: string) => {
//     if (!editingField) return;

//     setEditedValues((prev) => ({
//       ...prev,
//       [editingField.productId]: {
//         ...prev[editingField.productId],
//         [editingField.field]:
//           editingField.field === "price" ||
//           editingField.field === "stockQuantity"
//             ? Number(value)
//             : value,
//       },
//     }));
//   };

//   const handleSave = async (product: Product) => {
//     const changes = editedValues[product._id];
//     console.log(product, "single product");

//     if (changes) {
//       console.log("Saving changes for product:", product._id, changes);

//       // Conditionally construct the `data` object
//       const data: any = {};

//       // Update `inStock` if it has changed, otherwise leave it unchanged
//       console.log(changes,"changes")
//       if (changes.status && changes.status !== product.isDraft) {
//         data.isDraft = changes.status === "active" ? false : true;
//       }

//       // Update `stockQuantity` if it has changed, otherwise leave it unchanged
//       if (
//         changes.stockQuantity &&
//         changes.stockQuantity !== product.stockQuantity
//       ) {
//         data.stockQuantity = changes.stockQuantity;
//       }

//       // Update `price` if it has changed, otherwise leave it unchanged
//       if (changes.price && changes.price !== product.price) {
//         data.price = changes.price;
//       }

//       // Only send the `data` if there are any changes
//       if (Object.keys(data).length > 0) {
//         await updatingProduct({ id: product._id, data });
//         console.log("Product updated:", data);
//       } else {
//         console.log("No changes detected for product:", product._id);
//       }
//     }

//     // Reset editing state
//     setEditingField(null);
//     setEditedValues((prev) => {
//       const newValues = { ...prev };
//       delete newValues[product._id];
//       return newValues;
//     });
//   };

//   const handleCancel = (product: Product) => {
//     setEditingField(null);
//     setEditedValues((prev) => {
//       const newValues = { ...prev };
//       delete newValues[product._id];
//       return newValues;
//     });
//   };

//   const isEditing = (productId: string, field: string) => {
//     return (
//       editingField?.productId === productId && editingField?.field === field
//     );
//   };

//   const hasChanges = (productId: string) => {
//     return !!editedValues[productId];
//   };

//   const renderEditableCell = (
//     product: Product,
//     field: string,
//     displayValue: any
//   ) => {
//     if (isEditing(product._id, field)) {
//       return (
//         <Input
//           type={
//             field === "price" || field === "stockQuantity" ? "number" : "text"
//           }
//           value={editedValues[product._id]?.[field] ?? displayValue}
//           onChange={(e) => handleInputChange(e.target.value)}
//           className="h-8 w-24"
//           autoFocus
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               handleSave(product);
//             } else if (e.key === "Escape") {
//               handleCancel(product);
//             }
//           }}
//         />
//       );
//     }

//     return (
//       <div
//         onDoubleClick={() =>
//           handleDoubleClick(product._id, field, displayValue)
//         }
//         className="cursor-pointer px-2 py-1 rounded transition-colors"
//       >
//         {field === "price" ? `AED ${displayValue}` : displayValue}
//       </div>
//     );
//   };

//   const renderStatusEditableCell = (product: Product) => {
//     if (isEditing(product._id, "status")) {
//       const currentStatus = product.isDraft
//         ? "draft"
//         : !product.inStock
//         ? "out_of_stock"
//         : "active";

//       const getStatusDisplayText = (status: string) => {
//         switch (status) {
//           case "active":
//             return "active";
//           case "out_of_stock":
//             return "Out of Stock";
//           default:
//             return "Status";
//         }
//       };

//       const displayStatus = editedValues[product._id]?.isDraft ?? currentStatus;
//        console.log('displayStatus', displayStatus)

//       return (
//         <Select
//           value={displayStatus}
//           onValueChange={(newStatus) => {
//             setEditedValues((prev) => ({
//               ...prev,
//               [product._id]: {
//                 ...prev[product._id],
//                 status: newStatus,
//               },
//             }));
//           }}
//         >
//           <SelectTrigger className="w-[140px] h-8">
//             <SelectValue>{getStatusDisplayText(displayStatus)}</SelectValue>
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectItem value="active">Active</SelectItem>
//               <SelectItem value="inActive">In Active</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//       );
//     }

//     return (
//       <div
//         onDoubleClick={() => handleDoubleClick(product._id, "status", product)}
//         className="cursor-pointer"
//       >
//         {getStatusBadge(product.isDraft, product.inStock)}
//       </div>
//     );
//   };

//   if (!products || products.length === 0) {
//     return <NoProductsInVendor />;
//   }

//   return (
//     <div className="rounded-md border">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="w-[100px]">Image</TableHead>
//             <TableHead>Product</TableHead>
//             <TableHead>Category</TableHead>
//             <TableHead>Price</TableHead>
//             <TableHead>Stock</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Vendor</TableHead>
//             <TableHead className="text-right">Actions</TableHead>
//           </TableRow>
//         </TableHeader>

//         <TableBody>
//           {products.map((product) => (
//             <TableRow key={product._id} className="group">
//               <TableCell>
//                 <Image
//                   src={
//                     product.images?.[0]
//                       ? `${process.env.NEXT_PUBLIC_BASE_URL}/${product.images[0]}`
//                       : "/placeholder.jpg"
//                   }
//                   alt={product.productName}
//                   width={64}
//                   height={64}
//                   className="w-16 h-16 object-cover rounded-md border"
//                 />
//               </TableCell>

//               <TableCell>
//                 <div>
//                   <p className="font-medium truncate max-w-[170px]">
//                     {product.productName}
//                   </p>
//                   <p className="text-sm text-muted-foreground truncate max-w-[150px]">
//                     ID: {product._id}
//                   </p>
//                 </div>
//               </TableCell>

//               <TableCell>
//                 {renderEditableCell(
//                   product,
//                   "category",
//                   product.category || "N/A"
//                 )}
//               </TableCell>

//               <TableCell className="font-medium">
//                 {renderEditableCell(product, "price", product.price)}
//               </TableCell>

//               <TableCell>
//                 {renderEditableCell(
//                   product,
//                   "stockQuantity",
//                   product.stockQuantity
//                 )}
//               </TableCell>

//               <TableCell>{renderStatusEditableCell(product)}</TableCell>

//               <TableCell>{product.vendor?.storeName || "N/A"}</TableCell>

//               <TableCell className="text-right">
//                 <div className="flex items-center justify-end gap-2">
//                   {hasChanges(product._id) && (
//                     <>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleSave(product)}
//                         className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50"
//                       >
//                         <Save className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleCancel(product)}
//                         className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </>
//                   )}

//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" className="h-8 w-8 p-0">
//                         <MoreVertical className="h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>

//                     <DropdownMenuContent align="end">
//                       <DropdownMenuLabel>Actions</DropdownMenuLabel>

//                       <DropdownMenuItem onClick={() => onView(product._id)}>
//                         <Eye className="mr-2 h-4 w-4" />
//                         View
//                       </DropdownMenuItem>

//                       <DropdownMenuItem onClick={() => onEdit(product._id)}>
//                         <Edit2 className="mr-2 h-4 w-4" />
//                         Edit
//                       </DropdownMenuItem>

//                       <DropdownMenuSeparator />

//                       <DropdownMenuItem
//                         onClick={() => onDelete(product._id)}
//                         className="text-destructive"
//                       >
//                         <Trash2 className="mr-2 h-4 w-4" />
//                         Delete
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
