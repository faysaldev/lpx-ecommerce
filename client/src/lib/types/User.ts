export interface TUser {
  name: string;
  email: string;
  image: string | null; // image might be null
  password: string; // Usually, hashed passwords should be kept as strings
  role: "user" | "admin"; // Assuming roles are either "user" or "admin"
  type: "customer" | "vendor" | "admin"; // Modify this if there are other types
  address: string | null; // Address might be null if not provided
  phoneNumber: string;
  isProfileCompleted: boolean;
  totalEarnings: number;
  totalWithDrawal: number;
  createdAt: string; // You can also use `Date` if you convert to a JavaScript Date object
  id: string; // This should be a string (could be a UUID or a string-based identifier)
}
