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
  id: string;
  name: string;
  owner: string;
  email: string;
  products: number;
  sales: number;
  revenue: number;
  rating: number;
  status: "verified" | "pending" | "suspended";
  joined: string;
  location: {
    city: string;
    country: string;
  };
  avatar?: string;
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
      const _vendorOrders = mockVendorOrders.filter(() => Math.random() > 0.3); // Simulate some orders for each vendor

      return {
        id: vendor.id,
        name: vendor.name,
        owner: this.extractOwnerName(vendor.name),
        email: vendor.contact.email,
        products: vendorProducts.length,
        sales: vendor.totalSales,
        revenue: vendor.totalSales * 150, // Approximate revenue
        rating: vendor.rating,
        status: vendor.verified ? "verified" : "pending",
        joined: vendor.joinedDate,
        location: {
          city: vendor.location.city,
          country: vendor.location.country,
        },
        avatar: vendor.avatar,
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
    const activeVendors = vendors.filter((v) => v.status === "verified").length;
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
        id: `activity-vendor-${vendor.id}`,
        action: `Vendor verified`,
        details: `${vendor.name} has been verified and approved`,
        status: "success",
        time: this.getRelativeTime(vendor.joined),
        user: vendor.owner,
        type: "vendor",
      });
    });

    return activities
      .sort(
        (a, b) =>
          new Date(this.parseRelativeTime(b.time)).getTime() -
          new Date(this.parseRelativeTime(a.time)).getTime()
      )
      .slice(0, 5);
  }

  // Get top performing vendors
  getTopVendors(): Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
    rating: number;
  }> {
    return this.getAllVendors()
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((vendor) => ({
        id: vendor.id,
        name: vendor.name,
        sales: vendor.sales,
        revenue: vendor.revenue,
        rating: vendor.rating,
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
    const now = new Date();
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
    return `${diffInMonths}mo ago`;
  }

  private parseRelativeTime(relativeTime: string): string {
    // Convert relative time back to approximate date for sorting
    const now = new Date();

    if (relativeTime.includes("h ago")) {
      const hours = parseInt(relativeTime, 10);
      return new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
    }

    if (relativeTime.includes("d ago")) {
      const days = parseInt(relativeTime, 10);
      return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
    }

    if (relativeTime.includes("w ago")) {
      const weeks = parseInt(relativeTime, 10);
      return new Date(
        now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000
      ).toISOString();
    }

    if (relativeTime.includes("mo ago")) {
      const months = parseInt(relativeTime, 10);
      return new Date(
        now.getTime() - months * 30 * 24 * 60 * 60 * 1000
      ).toISOString();
    }

    return now.toISOString();
  }
}

// Export singleton instance
export const adminMockService = new AdminMockService();

// Export types and service
export default adminMockService;
