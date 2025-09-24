export type PaymentRequestStatus = "pending" | "approved" | "paid" | "rejected";

export interface PaymentRequestItem {
  orderId: string;
  orderNumber: string;
  amount: number;
  commission: number; // Platform commission
  netAmount: number; // Amount after commission
  orderDate: string;
  customer: {
    name: string;
    email: string;
  };
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
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

export interface CreatePaymentRequestData {
  orderIds: string[];
  notes?: string;
  invoiceFile?: File;
}

export interface PaymentRequestFilter {
  status?: PaymentRequestStatus;
  vendorId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaymentRequestStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  paidRequests: number;
  rejectedRequests: number;
  totalAmount: number;
  pendingAmount: number;
  paidAmount: number;
}

export interface VendorPaymentSummary {
  vendorId: string;
  vendorName: string;
  totalEarnings: number;
  paidAmount: number;
  pendingAmount: number;
  totalOrders: number;
  averageOrderValue: number;
  commissionRate: number;
  lastPaymentDate?: string;
}
