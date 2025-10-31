export interface Product {
  _id: string;
  productName?: string;
  description?: string;
  image?: string;
}

export interface VendorID {
  _id: string;
  storeName: string;
  email: string;
}
export type OrderStatus =
  | "unpaid"
  | "confirmed"
  | "Pickup"
  | "Scheduled"
  | "Pickup Completed"
  | "Not Picked Up"
  | "Inscan At Hub"
  | "Reached At Hub"
  | "Out For Delivery"
  | "Delivered"
  | "Undelivered"
  | "On-Hold"
  | "RTO"
  | "RTO Delivered"
  | "Cancelled"
  | "cancelled"
  | "Order Updated"
  | "Rescheduled"
  | string;

export interface Items {
  _id: string;
  productId: Product | string;
  image: string;
  quantity: number;
  price: number;
  vendorId: VendorID;
  status: OrderStatus;
}

export const getStatusStyles = (status: OrderStatus) => {
  switch (status) {
    case "unpaid":
      return { bg: "bg-orange-100", text: "text-orange-700" };
    case "confirmed":
      return { bg: "bg-green-100", text: "text-green-700" };
    case "Pickup":
    case "Scheduled":
    case "Pickup Completed":
      return { bg: "bg-blue-100", text: "text-blue-700" };
    case "Not Picked Up":
    case "Undelivered":
    case "Cancelled":
    case "cancelled":
      return { bg: "bg-red-100", text: "text-red-700" };
    case "Inscan At Hub":
    case "Reached At Hub":
      return { bg: "bg-indigo-100", text: "text-indigo-700" };
    case "Out For Delivery":
      return { bg: "bg-sky-100", text: "text-sky-700" };
    case "Delivered":
    case "RTO Delivered":
      return { bg: "bg-green-100", text: "text-green-700" };
    case "On-Hold":
      return { bg: "bg-yellow-100", text: "text-yellow-700" };
    case "RTO":
      return { bg: "bg-rose-100", text: "text-rose-700" };
    case "Order Updated":
      return { bg: "bg-blue-100", text: "text-blue-700" };
    case "Rescheduled":
      return { bg: "bg-orange-100", text: "text-orange-700" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700" };
  }
};
