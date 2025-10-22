import * as z from "zod";

export const productSchema = z.object({
  productName: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Name too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description too long"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  optionalPrice: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  condition: z.string().min(1, "Condition is required"),
  // rarity: z.string().min(1, "Rarity is required"),
  brand: z.string().optional(),
  stockQuantity: z.number().min(1, "Stock must be at least 1"),
  tags: z.array(z.string()),
  isDraft: z.boolean().default(true),
  discountPercentage: z.number().min(0).max(100).optional(),
  shippingCost: z
    .number()
    .min(0, "Shipping cost cannot be negative")
    .default(0),
  weight: z.number().min(0, "Weight cannot be negative").optional(),
  dimensions: z.string().optional(),
  acceptOffers: z.boolean().default(false),
  minOffer: z.number().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const rawConditions = [
  "Mint",
  "Near Mint",
  "Excellent",
  "Very Good",
  "Good",
  "Fair",
  "Poor",
];

export const gradedConditions = ["CGC Graded", "PSA Graded", "BGS Graded"];

export const rarities = [
  "Common",
  "Uncommon",
  "Rare",
  "Super Rare",
  "Ultra Rare",
  "Secret Rare",
  "Legendary",
  "Mythic",
  "Promo",
  "First Edition",
];
