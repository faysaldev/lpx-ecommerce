/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  PaymentRequest,
  PaymentRequestItem,
  PaymentRequestStatus,
} from "@/lib/payment-request";

export const PLATFORM_COMMISSION_RATE = 0.15; // 15%

// Format currency for display
export function formatCurrency(amount: number, currency = "AED"): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format date for display
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Date(dateString).toLocaleDateString("en-AE", {
    ...defaultOptions,
    ...options,
  });
}

// Get status badge variant
export function getStatusBadgeVariant(status: PaymentRequestStatus): {
  variant: "default" | "secondary" | "destructive" | "outline";
  className?: string;
} {
  switch (status) {
    case "pending":
      return {
        variant: "secondary",
        className: "bg-yellow-100 text-yellow-800",
      };
    case "approved":
      return { variant: "default", className: "bg-blue-100 text-blue-800" };
    case "paid":
      return { variant: "default", className: "bg-green-100 text-green-800" };
    case "rejected":
      return { variant: "destructive" };
    default:
      return { variant: "outline" };
  }
}

// Get status display text
export function getStatusDisplayText(status: PaymentRequestStatus): string {
  switch (status) {
    case "pending":
      return "Pending Review";
    case "approved":
      return "Approved";
    case "paid":
      return "Paid";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
}

// Calculate commission and net amount
export function calculatePaymentAmounts(totalAmount: number): {
  commission: number;
  netAmount: number;
} {
  const commission = totalAmount * PLATFORM_COMMISSION_RATE;
  const netAmount = totalAmount - commission;

  return { commission, netAmount };
}

// Calculate totals from payment request items
export function calculateRequestTotals(items: PaymentRequestItem[]): {
  totalAmount: number;
  totalCommission: number;
  totalNetAmount: number;
} {
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const totalCommission = items.reduce((sum, item) => sum + item.commission, 0);
  const totalNetAmount = items.reduce((sum, item) => sum + item.netAmount, 0);

  return { totalAmount, totalCommission, totalNetAmount };
}

// Filter payment requests by various criteria
export function filterPaymentRequests(
  requests: PaymentRequest[],
  filters: {
    status?: PaymentRequestStatus | "all";
    vendorId?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    searchQuery?: string;
  }
): PaymentRequest[] {
  return requests.filter((request) => {
    // Status filter
    if (
      filters.status &&
      filters.status !== "all" &&
      request.status !== filters.status
    ) {
      return false;
    }

    // Vendor filter
    if (filters.vendorId && request.vendorId !== filters.vendorId) {
      return false;
    }

    // Date range filter
    if (filters.startDate) {
      const requestDate = new Date(request.requestDate);
      const startDate = new Date(filters.startDate);
      if (requestDate < startDate) return false;
    }

    if (filters.endDate) {
      const requestDate = new Date(request.requestDate);
      const endDate = new Date(filters.endDate);
      if (requestDate > endDate) return false;
    }

    // Amount range filter
    if (filters.minAmount && request.totalAmount < filters.minAmount) {
      return false;
    }

    if (filters.maxAmount && request.totalAmount > filters.maxAmount) {
      return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchFields = [
        request.vendorName,
        request.vendorEmail,
        request.notes || "",
        request.adminNotes || "",
        ...request.items.map((item: any) => item.orderNumber),
      ];

      const matches = searchFields.some((field) =>
        field.toLowerCase().includes(query)
      );

      if (!matches) return false;
    }

    return true;
  });
}

// Sort payment requests
export function sortPaymentRequests(
  requests: PaymentRequest[],
  sortBy: "date" | "amount" | "status" | "vendor",
  sortOrder: "asc" | "desc" = "desc"
): PaymentRequest[] {
  return [...requests].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison =
          new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime();
        break;
      case "amount":
        comparison = a.totalAmount - b.totalAmount;
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      case "vendor":
        comparison = a.vendorName.localeCompare(b.vendorName);
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });
}

// Get payment request summary statistics
export function getPaymentRequestSummary(requests: PaymentRequest[]): {
  totalRequests: number;
  totalAmount: number;
  totalNetAmount: number;
  statusCounts: Record<PaymentRequestStatus, number>;
  averageAmount: number;
} {
  const totalRequests = requests.length;
  const totalAmount = requests.reduce((sum, req) => sum + req.totalAmount, 0);
  const totalNetAmount = requests.reduce((sum, req) => sum + req.netAmount, 0);
  const averageAmount = totalRequests > 0 ? totalAmount / totalRequests : 0;

  const statusCounts: Record<PaymentRequestStatus, number> = {
    all: 0,
    pending: 0,
    approved: 0,
    paid: 0,
    rejected: 0,
  };

  requests.forEach((req) => {
    statusCounts[req.status]++;
    statusCounts.all++;
  });

  return {
    totalRequests,
    totalAmount,
    totalNetAmount,
    statusCounts,
    averageAmount,
  };
}

// Validate payment request creation data
export function validatePaymentRequestData(data: {
  orderIds: string[];
  notes?: string;
}): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.orderIds || data.orderIds.length === 0) {
    errors.push("At least one order must be selected");
  }

  if (data.notes && data.notes.length > 500) {
    errors.push("Notes must be 500 characters or less");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Generate invoice filename
export function generateInvoiceFilename(
  vendorName: string,
  requestDate: string,
  requestId: string
): string {
  const date = new Date(requestDate);
  const dateStr = date.toISOString().split("T")[0];
  const sanitizedVendorName = vendorName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-");

  return `invoice-${sanitizedVendorName}-${dateStr}-${requestId}.pdf`;
}

// Get time since request
export function getTimeSinceRequest(requestDate: string): string {
  const now = new Date();
  const request = new Date(requestDate);
  const diffMs = now.getTime() - request.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
}
export function formatNumber(number: any) {
  // Convert the number to a string and check for decimals
  const [integer, decimal] = number.toString().split(".");

  // Format the integer part with commas
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // If there's no decimal part, return the formatted integer only
  if (!decimal) {
    return formattedInteger;
  }

  // If the decimal part is "00", just return the integer
  if (decimal === "00") {
    return formattedInteger;
  }

  // Otherwise, return the formatted integer with decimal, rounded to 1 decimal if necessary
  return `${formattedInteger}.${
    decimal.length > 2 ? decimal.substring(0, 2) : decimal
  }`;
}
