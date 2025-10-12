/* eslint-disable @typescript-eslint/no-explicit-any */
// Admin Mock Library - Centralized mock data service for admin interface
// import { mockProducts, mockVendorOrders, mockVendors } from "./api/mock";

import { mockProducts, mockVendorOrders, mockVendors } from "../mockdata";

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

// Transform existing mock data for admin interface
class AdminMockService {
  // Get all products from all vendors
  getAllProducts(): AdminProduct[] {
    return mockProducts.map((product: any) => {
      const vendor = mockVendors.find((v: any) => v.id === product.vendorId);

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        vendor: vendor?.name || "Unknown Vendor",
        vendorId: product.vendorId,
        price: product.price,
        stock: product.stock,
        status: this.mapProductStatus(product.state),
        listed: product.createdAt || "2024-01-01",
        sales: product.views ? Math.floor(product.views / 10) : 0,
        image: product.image,
      };
    });
  }

  // Get all orders from all vendors
  getAllOrders(): AdminOrder[] {
    return mockVendorOrders.map((order: any) => {
      const vendor =
        mockVendors.find((v: any) => v.id === "vendor-1") || mockVendors[0];

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        customer: order.customer,
        vendor: {
          name: vendor.name,
          id: vendor.id,
        },
        items: order.items,
        total: order.total,
        status: order.status as AdminOrder["status"],
        orderDate: order.orderDate,
        estimatedDelivery: order.estimatedDelivery,
        deliveryDate: order.deliveryDate,
        paymentMethod: order.paymentMethod,
        trackingNumber: order.trackingNumber,
      };
    });
  }

  // Get all vendors
  getAllVendors(): AdminVendor[] {
    return mockVendors.map((vendor: any) => {
      const vendorProducts = mockProducts.filter(
        (p: any) => p.vendorId === vendor.id
      );

      return {
        _id: vendor.id,
        seller: {
          _id: vendor.id,
          name: vendor.name,
          email: vendor.contact.email,
          image: vendor.avatar,
        },
        ownerName: this.extractOwnerName(vendor.name),
        storeName: vendor.name,
        storePhoto: vendor.avatar,
        category: vendor.category,
        status: vendor.verified ? "approved" : "pending",
        location: `${vendor.location.city}, ${vendor.location.country}`,
        productCount: vendorProducts.length,
        totalSales: vendor.totalSales,
        totalEarnings: vendor.totalSales * 150, // Approximate revenue
        totalWithDrawal: 0, // Mock data
        averageRating: vendor.rating.toString(),
        createdAt: vendor.joinedDate,
      };
    });
  }

  // Generate platform statistics
  getPlatformStats(): AdminStats {
    const products = this.getAllProducts();
    const orders = this.getAllOrders();
    const vendors = this.getAllVendors();

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const _activeProducts = products.filter(
      (p) => p.status === "active"
    ).length;
    const pendingProducts = products.filter(
      (p) => p.status === "pending"
    ).length;
    const activeVendors = vendors.filter((v) => v.status === "approved").length;
    const pendingVendors = vendors.filter((v) => v.status === "pending").length;

    return {
      totalUsers: 127, // Mock user count
      usersChange: 12.5,
      totalProducts: products.length,
      productsChange: 8.3,
      totalOrders: orders.length,
      ordersChange: 15.7,
      totalRevenue,
      revenueChange: 22.1,
      activeVendors,
      vendorsChange: activeVendors - pendingVendors,
      pendingApprovals: pendingProducts + pendingVendors,
      approvalsChange: -2,
    };
  }

  // Generate recent activity feed
  getRecentActivity(): AdminActivity[] {
    const activities: AdminActivity[] = [];
    const orders = this.getAllOrders();
    const products = this.getAllProducts();

    // Add order activities
    orders.slice(0, 3).forEach((order, _index) => {
      activities.push({
        id: `activity-order-${order.id}`,
        action: `New order ${order.orderNumber}`,
        details: `${order.customer.name} ordered ${order.items.length} item(s) for $${order.total}`,
        status: order.status === "completed" ? "success" : "pending",
        time: this.getRelativeTime(order.orderDate),
        user: order.customer.name,
        type: "order",
      });
    });

    // Add product activities
    products.slice(0, 2).forEach((product, _index) => {
      activities.push({
        id: `activity-product-${product.id}`,
        action: `Product listed`,
        details: `${product.vendor} listed "${product.name}" for $${product.price}`,
        status: product.status === "active" ? "success" : "pending",
        time: this.getRelativeTime(product.listed),
        user: product.vendor,
        type: "product",
      });
    });

    // Add vendor activities
    const vendors = this.getAllVendors();
    vendors.slice(0, 1).forEach((vendor) => {
      activities.push({
        id: `activity-vendor-${vendor._id}`,
        action: `Vendor verified`,
        details: `${vendor.storeName} has been verified and approved`,
        status: "success",
        time: this.getRelativeTime(vendor.createdAt),
        user: vendor.ownerName,
        type: "vendor",
      });
    });

    return activities
      .sort((a, b) => {
        const dateA = new Date(this.parseRelativeTime(a.time));
        const dateB = new Date(this.parseRelativeTime(b.time));

        // Handle invalid dates by treating them as the oldest possible
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          return isNaN(dateA.getTime()) ? 1 : -1;
        }

        // Sort in descending order (newest first)
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5);
  }

  // Get top performing vendors
  getTopVendors(): Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
    rating: string;
  }> {
    return this.getAllVendors()
      .sort((a, b) => b.totalEarnings - a.totalEarnings)
      .slice(0, 5)
      .map((vendor) => ({
        id: vendor._id,
        name: vendor.storeName,
        sales: vendor.totalSales,
        revenue: vendor.totalEarnings,
        rating: vendor.averageRating,
      }));
  }

  // Helper methods
  private mapProductStatus(state?: string): AdminProduct["status"] {
    switch (state) {
      case "open":
      case "sealed":
        return "active";
      case "draft":
        return "pending";
      default:
        return "active";
    }
  }

  private extractOwnerName(vendorName: string): string {
    // Extract owner name from vendor name or return a default
    const ownerMap: Record<string, string> = {
      "Emirates Card Exchange": "Ahmed Al Maktoum",
      "Dubai Comic Vault": "Sarah Hassan",
    };
    return ownerMap[vendorName] || "Unknown Owner";
  }

  private getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Just now"; // Default to "Just now" for invalid dates
    }

    const now = new Date();
    // Check if the date is in the future
    if (date > now) {
      return "Just now";
    }

    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    // Prevent extremely large month numbers
    if (diffInMonths > 999) return "Long ago";
    return `${diffInMonths}mo ago`;
  }

  private parseRelativeTime(relativeTime: string): string {
    // Convert relative time back to approximate date for sorting
    const now = new Date();

    if (relativeTime.includes("h ago")) {
      const match = relativeTime.match(/(\d+)h ago/);
      if (match) {
        const hours = parseInt(match[1], 10);
        if (isNaN(hours) || hours <= 0) {
          return now.toISOString();
        }
        // Limit to prevent date overflow
        const safeHours = Math.min(hours, 8760); // Limit to 1 year max
        const resultDate = new Date(now.getTime() - safeHours * 60 * 60 * 1000);
        // Ensure the date is not in the future or invalid
        if (resultDate > now) {
          return now.toISOString();
        }
        return resultDate.toISOString();
      }
    }

    if (relativeTime.includes("d ago")) {
      const match = relativeTime.match(/(\d+)d ago/);
      if (match) {
        const days = parseInt(match[1], 10);
        if (isNaN(days) || days <= 0) {
          return now.toISOString();
        }
        // Limit to prevent date overflow
        const safeDays = Math.min(days, 365); // Limit to 1 year max
        const resultDate = new Date(
          now.getTime() - safeDays * 24 * 60 * 60 * 1000
        );
        // Ensure the date is not in the future or invalid
        if (resultDate > now) {
          return now.toISOString();
        }
        return resultDate.toISOString();
      }
    }

    if (relativeTime.includes("w ago")) {
      const match = relativeTime.match(/(\d+)w ago/);
      if (match) {
        const weeks = parseInt(match[1], 10);
        if (isNaN(weeks) || weeks <= 0) {
          return now.toISOString();
        }
        // Limit to prevent date overflow
        const safeWeeks = Math.min(weeks, 52); // Limit to 1 year max
        const resultDate = new Date(
          now.getTime() - safeWeeks * 7 * 24 * 60 * 60 * 1000
        );
        // Ensure the date is not in the future or invalid
        if (resultDate > now) {
          return now.toISOString();
        }
        return resultDate.toISOString();
      }
    }

    if (relativeTime.includes("mo ago")) {
      const match = relativeTime.match(/(\d+)mo ago/);
      if (match) {
        const months = parseInt(match[1], 10);
        if (isNaN(months) || months <= 0) {
          return now.toISOString();
        }
        // Limit to prevent date overflow
        const safeMonths = Math.min(months, 12); // Limit to 1 year max
        const resultDate = new Date(
          now.getTime() - safeMonths * 30 * 24 * 60 * 60 * 1000
        );
        // Ensure the date is not in the future or invalid
        if (resultDate > now) {
          return now.toISOString();
        }
        return resultDate.toISOString();
      }
    }

    return now.toISOString();
  }
}

// Export singleton instance
export const adminMockService = new AdminMockService();

// Export types and service
export default adminMockService;
