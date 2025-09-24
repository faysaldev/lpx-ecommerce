export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  instructions?: string;
}

export interface BillingAddress extends ShippingAddress {
  company?: string;
  vatNumber?: string;
}

export interface PaymentMethod {
  type: "card" | "paypal" | "crypto";
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  saveCard?: boolean;
}

export interface CheckoutData {
  shippingAddress: ShippingAddress | null;
  billingAddress: BillingAddress | null;
  sameAsShipping: boolean;
  paymentMethod: PaymentMethod | null;
  orderNotes?: string;
  acceptTerms: boolean;
  subscribeNewsletter: boolean;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  paymentMethod: PaymentMethod | string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  orderNotes?: string;
  createdAt: Date | string;
  estimatedDelivery: Date | string;
  trackingNumber?: string;
}

export interface OrderItem {
  id: string;
  productId?: string;
  name: string;
  title?: string;
  price: number;
  quantity: number;
  image?: string;
  vendor?: string;
}

export type CheckoutStep = "shipping" | "billing" | "payment" | "review";
