/* eslint-disable @typescript-eslint/no-explicit-any */
// Admin Mock Library - Centralized mock data service for admin interface
// import { mockProducts, mockVendorOrders, mockVendors } from "./api/mock";

export interface AdminStats {
  totalUsers: number;
  usersChange: number;
  totalProducts: number;
  productsChange: number;
  totalOrders: number;
  ordersChange: number;
  totalRevenue: number;
  revenueChange: number;
  activeVendors: number;
  vendorsChange: number;
  pendingApprovals: number;
  approvalsChange: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  vendor: string;
  vendorId: string;
  price: number;
  stock: number;
  status: "active" | "pending" | "flagged" | "inactive";
  listed: string;
  sales: number;
  image?: string;
  flagReason?: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  vendor: {
    name: string;
    id: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  total: number;
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  orderDate: string;
  estimatedDelivery?: string;
  deliveryDate?: string;
  paymentMethod: string;
  trackingNumber?: string | null;
}

export interface AdminVendor {
  _id: string; // the main identifier
  seller: {
    _id: string;
    name: string;
    email: string;
    image: string;
  };
  ownerName: string;
  storeName: string;
  storePhoto: string;
  category: string;
  status: "approved" | "pending" | "suspended";
  location: string;
  productCount: number;
  totalSales: number;
  totalEarnings: number;
  totalWithDrawal: number;
  averageRating: string; // was "0.00" in the sample, so string for now unless you convert it
  createdAt: string;
}

export interface AdminActivity {
  id: string;
  action: string;
  details: string;
  status: "success" | "pending" | "warning" | "error";
  time: string;
  user?: string;
  type: "order" | "product" | "vendor" | "user" | "system";
}
