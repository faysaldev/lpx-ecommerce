"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Lock,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/UI/button.variants";
import { Checkbox } from "@/components/UI/checkbox";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/UI/radio-group";
// import { useCheckout } from "@/context/CheckoutContext";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/lib/checkout";

const paymentSchema = z
  .object({
    type: z.enum(["card", "paypal", "crypto"]),
    cardNumber: z
      .string()
      .min(16, "Card number must be 16 digits")
      .max(16)
      .optional(),
    cardHolder: z.string().min(1, "Cardholder name is required").optional(),
    expiryDate: z
      .string()
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date (MM/YY)")
      .optional(),
    cvv: z.string().min(3, "CVV must be at least 3 digits").max(4).optional(),
    saveCard: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "card") {
        return !!(
          data.cardNumber &&
          data.cardHolder &&
          data.expiryDate &&
          data.cvv
        );
      }
      return true;
    },
    {
      message: "Card details are required for card payment",
      path: ["cardNumber"],
    }
  );

// Simulated Checkout Data
// const checkoutData = {
//   paymentMethod: {
//     type: "card", // Or "paypal" or "crypto"
//     cardNumber: "4242424242424242",
//     cardHolder: "John Doe",
//     expiryDate: "12/24",
//     cvv: "123",
//     saveCard: false,
//   },
//   shippingAddress: {
//     firstName: "John",
//     lastName: "Doe",
//     address: "123 Main St",
//     address2: "Apt 4B",
//     city: "Dhaka",
//     state: "Dhaka",
//     postalCode: "1212",
//     country: "Bangladesh",
//     phone: "123-456-7890",
//   },
//   billingAddress: {
//     firstName: "John",
//     lastName: "Doe",
//     address: "123 Main St",
//     address2: "Apt 4B",
//     city: "Dhaka",
//     state: "Dhaka",
//     postalCode: "1212",
//     country: "Bangladesh",
//   },
//   sameAsShipping: true,
//   acceptTerms: true,
//   subscribeNewsletter: false,
//   orderNotes: "Please handle with care.",
//   paymentMethod: {
//     type: "card", // "card", "paypal", or "crypto"
//   },
// };

const checkoutData = {
  paymentMethod: {
    type: "card", // Or "paypal" or "crypto"
    cardNumber: "4242424242424242",
    cardHolder: "John Doe",
    expiryDate: "12/24",
    cvv: "123",
    saveCard: false,
  },
  shippingAddress: {
    firstName: "John",
    lastName: "Doe",
    address: "123 Main St",
    address2: "Apt 4B",
    city: "Dhaka",
    state: "Dhaka",
    postalCode: "1212",
    country: "Bangladesh",
    phone: "123-456-7890",
  },
  billingAddress: {
    firstName: "John",
    lastName: "Doe",
    address: "123 Main St",
    address2: "Apt 4B",
    city: "Dhaka",
    state: "Dhaka",
    postalCode: "1212",
    country: "Bangladesh",
  },
  sameAsShipping: true,
  acceptTerms: true,
  subscribeNewsletter: false,
  orderNotes: "Please handle with care.",
};

// Simulated Items for Order
const items = [
  {
    id: "1",
    productId: "101",
    name: "Product A",
    price: 100,
    quantity: 2,
    image: "https://via.placeholder.com/150",
    vendor: "Vendor A",
    product: {
      id: "101",
      name: "Product A",
      price: 100,
      compareAtPrice: 120,
      description: "A high-quality product.",
      category: "Electronics",
      stock: 5,
      state: "sealed",
      grading: undefined,
      condition: undefined,
      rarity: "Rare",
    },
  },
  {
    id: "2",
    productId: "102",
    name: "Product B",
    price: 50,
    quantity: 1,
    image: "https://via.placeholder.com/150",
    vendor: "Vendor B",
    product: {
      id: "102",
      name: "Product B",
      price: 50,
      compareAtPrice: 60,
      description: "Affordable product.",
      category: "Home Appliances",
      stock: 10,
      state: "open",
      grading: { company: "PSA", grade: "9" },
      condition: "Near Mint",
      rarity: "Common",
    },
  },
];

// Calculate the necessary totals and values for the checkout
const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
const subtotal = items.reduce(
  (acc, item) => acc + item.product.price * item.quantity,
  0
);
const shipping = 10; // Flat shipping fee
const tax = subtotal * 0.1; // 10% tax
const discount = 20; // Hardcoded discount
const total = subtotal + shipping + tax - discount;

export default function PaymentForm() {
  // const { checkoutData, updatePaymentMethod, nextStep, prevStep } =
  //   useCheckout();
  const [paymentType, setPaymentType] = useState<"card" | "paypal" | "crypto">(
    (checkoutData.paymentMethod?.type as "card" | "paypal" | "crypto") || "card"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PaymentMethod>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      ...checkoutData.paymentMethod,
      type:
        checkoutData.paymentMethod?.type === "card" ||
        checkoutData.paymentMethod?.type === "paypal" ||
        checkoutData.paymentMethod?.type === "crypto"
          ? checkoutData.paymentMethod?.type
          : "card", // Default if type is invalid
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
      saveCard: false,
    },
    // defaultValues: checkoutData.paymentMethod || {
    //   type: "card",
    //   cardNumber: "",
    //   cardHolder: "",
    //   expiryDate: "",
    //   cvv: "",
    //   saveCard: false,
    // },
  });

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const limited = cleaned.substring(0, 16);
    setValue("cardNumber", limited);
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 3) {
      const formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
      setValue("expiryDate", formatted);
    } else {
      setValue("expiryDate", cleaned);
    }
  };

  const onSubmit = (data: PaymentMethod) => {
    // updatePaymentMethod({ ...data, type: paymentType });
    // nextStep();
  };

  const handlePaymentTypeChange = (type: "card" | "paypal" | "crypto") => {
    setPaymentType(type);
    if (type !== "card") {
      // For non-card payments, just save the type
      // updatePaymentMethod({ type });
      // nextStep();
    }
  };

  return (
    <form
      // onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
        <RadioGroup
          value={paymentType}
          onValueChange={(value) =>
            handlePaymentTypeChange(value as "card" | "paypal" | "crypto")
          }
        >
          <div className="space-y-3">
            {/* Credit/Debit Card */}
            <div
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-all",
                paymentType === "card"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="card" id="card" />
                  <Label
                    htmlFor="card"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <CreditCard className="h-5 w-5" />
                    Credit or Debit Card
                  </Label>
                </div>
                <div className="flex gap-2">
                  {/* Card logos */}
                  <div className="h-6 w-10 bg-gray-200 rounded" />
                  <div className="h-6 w-10 bg-gray-200 rounded" />
                  <div className="h-6 w-10 bg-gray-200 rounded" />
                </div>
              </div>
            </div>

            {/* PayPal */}
            <div
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-all",
                paymentType === "paypal"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="cursor-pointer">
                  PayPal
                </Label>
              </div>
            </div>

            {/* Cryptocurrency */}
            <div
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-all opacity-50",
                paymentType === "crypto"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200"
              )}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="crypto" id="crypto" disabled />
                <Label htmlFor="crypto" className="cursor-pointer">
                  Cryptocurrency (Coming Soon)
                </Label>
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Card Details Form */}
      {paymentType === "card" && (
        <>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number *</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  type="text"
                  {...register("cardNumber")}
                  onChange={(e) => formatCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className={cn(
                    "pl-10",
                    errors.cardNumber ? "border-red-500" : ""
                  )}
                  maxLength={16}
                />
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.cardNumber && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.cardNumber.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="cardHolder">Cardholder Name *</Label>
              <Input
                id="cardHolder"
                type="text"
                {...register("cardHolder")}
                placeholder="John Doe"
                className={errors.cardHolder ? "border-red-500" : ""}
              />
              {errors.cardHolder && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.cardHolder.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="text"
                  {...register("expiryDate")}
                  onChange={(e) => formatExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  className={errors.expiryDate ? "border-red-500" : ""}
                  maxLength={5}
                />
                {errors.expiryDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.expiryDate.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="cvv">CVV *</Label>
                <div className="relative">
                  <Input
                    id="cvv"
                    type="text"
                    {...register("cvv")}
                    placeholder="123"
                    className={cn("pr-10", errors.cvv ? "border-red-500" : "")}
                    maxLength={4}
                  />
                  <Shield className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {errors.cvv && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.cvv.message}
                  </p>
                )}
              </div>
            </div>

            {/* Save Card Option */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="saveCard"
                checked={watch("saveCard")}
                onCheckedChange={(checked) =>
                  setValue("saveCard", checked as boolean)
                }
              />
              <Label
                htmlFor="saveCard"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Save this card for future purchases
              </Label>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Your payment information is secure
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  We use industry-standard encryption to protect your payment
                  details. Your information is never stored on our servers.
                </p>
              </div>
            </div>
          </div>

          {/* Test Card Notice */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Test Mode
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Use test card: 4242 4242 4242 4242, any future date, and any
                  3-digit CVV
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Form Actions */}
      <div className="flex justify-between pt-6 border-t">
        <SecondaryButton
          type="button"
          // onClick={prevStep}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Billing
        </SecondaryButton>
        {paymentType === "card" && (
          <PrimaryButton type="submit" size="lg">
            Review Order
            <ArrowRight className="ml-2 h-4 w-4" />
          </PrimaryButton>
        )}
      </div>
    </form>
  );
}
