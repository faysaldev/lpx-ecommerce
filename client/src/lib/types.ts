// API Types and Interfaces for the data layer abstraction

import { OrderStatus } from "./checkout";
import { PaymentRequestItem, PaymentRequestStatus } from "./payment-request";

export interface Product {
  id: string;
  name: string;
  title?: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  category: string;
  categorySlug: string;
  vendor: string;
  vendorId: string;
  stock: number;
  state: "sealed" | "open"; // Product state: sealed or open
  condition?: string; // For open/raw products - conditions like mint, near-mint, etc.
  grading?: {
    company: string; // PSA, CGC, BGS, etc.
    grade: string; // 10, 9.5, BGS 9, etc.
    certificate?: string;
  };
  cardNumber?: string; // For card games
  views: number;
  rating: number;
  reviewCount: number;
  year: number;
  manufacturer: string;
  authenticity?: {
    verified: boolean;
    certificate?: string;
    verifiedBy?: string;
    verificationDate?: string;
  };
  specifications?: Record<string, string>;
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  likes?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon?: string;
  parent?: string;
  subcategories?: Category[];
  productCount: number;
  featured?: boolean;
  order?: number;
}

export interface ProductFilter {
  categoryId?: string; // Category ID for filtering
  category?: string; // Category slug for filtering
  subcategory?: string;
  vendorId?: string; // Vendor ID for filtering
  minPrice?: number;
  maxPrice?: number;
  condition?: string; // Single condition filter
  conditions?: string[]; // Multiple conditions
  rarity?: string; // Single rarity filter
  rarities?: string[]; // Multiple rarities
  vendors?: string[];
  inStock?: boolean;
  featured?: boolean;
  search?: string; // Search query
  searchQuery?: string; // Alternative search query
  sortBy?:
    | "newest"
    | "price-asc"
    | "price-desc"
    | "rating"
    | "popular"
    | "featured"
    | "name";
  limit?: number;
  page?: number; // Page number for pagination
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

// API Service Interfaces
export interface IProductAPI {
  getProducts(
    filter?: ProductFilter
  ): Promise<ApiResponse<PaginatedResponse<Product>>>;
  getProductById(id: string): Promise<ApiResponse<Product>>;
  getProductsByCategory(
    categorySlug: string,
    filter?: ProductFilter
  ): Promise<ApiResponse<PaginatedResponse<Product>>>;
  getFeaturedProducts(limit?: number): Promise<ApiResponse<Product[]>>;
  getRelatedProducts(
    productId: string,
    limit?: number
  ): Promise<ApiResponse<Product[]>>;
  searchProducts(
    query: string,
    filter?: ProductFilter
  ): Promise<ApiResponse<PaginatedResponse<Product>>>;
}

export interface ICategoryAPI {
  getCategories(): Promise<ApiResponse<Category[]>>;
  getCategoryBySlug(slug: string): Promise<ApiResponse<Category>>;
  getCategoryById(id: string): Promise<ApiResponse<Category>>;
  getSubcategories(parentSlug: string): Promise<ApiResponse<Category[]>>;
  getFeaturedCategories(): Promise<ApiResponse<Category[]>>;
}

// Vendor types for completeness
export interface Vendor {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatar?: string; // Avatar URL
  logo?: string;
  banner?: string;
  rating: number;
  totalSales?: number;
  reviewCount?: number;
  productCount?: number;
  totalProducts?: number;
  responseTime?: string;
  shippingInfo?: string;
  returnPolicy?: string;
  verified: boolean;
  featured?: boolean;
  joinedDate: string;
  storePhoto?: string; // Store photo URL
  phoneNumber?: string;
  location?: string; // Support both object and string formats
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    pinterest?: string;
  };
  specialties?: string[];
  policies?: {
    shipping: string;
    returns: string;
    authenticity: string;
  };
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  joinedAt?: Date;
}

export interface IVendorAPI {
  getVendors(filter?: {
    featured?: boolean;
    verified?: boolean;
  }): Promise<ApiResponse<Vendor[]>>;
  getVendorById(id: string): Promise<ApiResponse<Vendor>>;
  getVendorBySlug(slug: string): Promise<ApiResponse<Vendor>>;
  getVendorProducts(
    vendorId: string,
    filter?: ProductFilter
  ): Promise<ApiResponse<PaginatedResponse<Product>>>;
}

// Cart API Interface
export interface ICartAPI {
  getCart(userId: string): Promise<CartItem[]>;
  addToCart(userId: string, item: CartItem): Promise<void>;
  updateQuantity(
    userId: string,
    itemId: string,
    quantity: number
  ): Promise<void>;
  removeFromCart(userId: string, itemId: string): Promise<void>;
  clearCart(userId: string): Promise<void>;
}

// Wishlist API Interface
export interface IWishlistAPI {
  getWishlist(userId: string): Promise<WishlistItem[]>;
  addToWishlist(userId: string, item: WishlistItem): Promise<void>;
  removeFromWishlist(userId: string, itemId: string): Promise<void>;
  clearWishlist(userId: string): Promise<void>;
}

// Payment Methods API Interface
export interface IPaymentMethodsAPI {
  getPaymentMethods(userId: string): Promise<PaymentMethod[]>;
  addPaymentMethod(userId: string, method: PaymentMethod): Promise<void>;
  updatePaymentMethod(
    userId: string,
    methodId: string,
    method: Partial<PaymentMethod>
  ): Promise<void>;
  removePaymentMethod(userId: string, methodId: string): Promise<void>;
  setDefaultPaymentMethod(userId: string, methodId: string): Promise<void>;
}

// Cart and Wishlist item types
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  vendor: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  vendor: string;
  addedAt: string;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "apple_pay" | "google_pay";
  name: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  brand?: string;
  isDefault: boolean;
  createdAt: string;
}
export interface OrderEvent {
  id: string;
  type:
    | "status_change"
    | "payment"
    | "shipping"
    | "delivery"
    | "cancellation"
    | "refund";
  status?: OrderStatus;
  title: string;
  description: string;
  timestamp: Date | string;
  metadata?: {
    trackingNumber?: string;
    carrier?: string;
    refundAmount?: number;
    paymentMethod?: string;
    location?: string;
  };
}

export interface PaymentRequest {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  status: PaymentRequestStatus;
  requestDate: string;
  approvedDate?: string;
  paidDate?: string;
  rejectedDate?: string;
  totalAmount: number;
  commission: number;
  netAmount: number;
  items: PaymentRequestItem[];
  notes?: string;
  adminNotes?: string;
  invoiceUrl?: string; // Vendor uploaded invoice
  paymentProofUrl?: string; // Admin uploaded payment proof
  approvedBy?: string;
  rejectedReason?: string;
}
// Factory interface for creating API instances
export interface IAPIFactory {
  createProductAPI(): IProductAPI;
  createCategoryAPI(): ICategoryAPI;
  createVendorAPI(): IVendorAPI;
  createCartAPI(): ICartAPI;
  createWishlistAPI(): IWishlistAPI;
  createPaymentMethodsAPI(): IPaymentMethodsAPI;
}

export type NotificationType =
  | "orders"
  | "system"
  | "promotion"
  | "vendor"
  | "price_alert";
export type NotificationPriority = "low" | "medium" | "high";

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  icon?: string;
  metadata?: {
    orderId?: string;
    productId?: string;
    vendorId?: string;
    discount?: number;
    previousPrice?: number;
    currentPrice?: number;
  };
}

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    orderId?: string;
    productId?: string;
    vendorId?: string;
    discount?: number;
    previousPrice?: number;
    currentPrice?: number;
  };
}

export interface ApiNotification {
  _id: string;
  authorId: string;
  sendTo: string;
  transactionId?: string;
  title: string;
  description: string;
  isRead: boolean;
  type: string;
  priority: "low" | "medium" | "high";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NotificationGroup {
  title: string;
  notifications: Notification[];
}
