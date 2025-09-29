"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/UI/button.variants";
import { Input } from "@/components/UI/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { Textarea } from "@/components/UI/textarea";
// import { useCheckout } from "@/context/CheckoutContext";
import type { ShippingAddress } from "@/lib/checkout";
import { Label } from "../UI/label";

const shippingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(5, "Postal code must be at least 5 characters"),
  country: z.string().min(1, "Country is required"),
  instructions: z.string().optional(),
});

const countries = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
];

const states = [
  { value: "CA", label: "California" },
  { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" },
  { value: "FL", label: "Florida" },
  { value: "WA", label: "Washington" },
];

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

export default function ShippingForm() {
  // const { checkoutData, updateShippingAddress, nextStep } = useCheckout();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ShippingAddress>({
    resolver: zodResolver(shippingSchema),
    defaultValues: checkoutData.shippingAddress || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "US",
      instructions: "",
    },
  });

  const onSubmit = (data: ShippingAddress) => {
    // updateShippingAddress(data);
    // nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              {...register("lastName")}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              {...register("address")}
              placeholder="123 Main St"
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-sm text-red-500 mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="address2">Apartment, Suite, etc. (Optional)</Label>
            <Input
              id="address2"
              {...register("address2")}
              placeholder="Apt 4B"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...register("city")}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="state">State *</Label>
              <Select
                value={watch("state")}
                onValueChange={(value) => setValue("state", value)}
              >
                <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="postalCode">ZIP Code *</Label>
              <Input
                id="postalCode"
                {...register("postalCode")}
                className={errors.postalCode ? "border-red-500" : ""}
              />
              {errors.postalCode && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.postalCode.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="country">Country *</Label>
            <Select
              value={watch("country")}
              onValueChange={(value) => setValue("country", value)}
            >
              <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-red-500 mt-1">
                {errors.country.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Instructions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Delivery Instructions (Optional)
        </h3>
        <Textarea
          {...register("instructions")}
          placeholder="Leave at front door, ring doorbell, etc."
          rows={3}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-between pt-6 border-t">
        <SecondaryButton type="button" onClick={() => window.history.back()}>
          Back to Cart
        </SecondaryButton>
        <PrimaryButton type="submit" size="lg">
          Continue to Billing
          <ArrowRight className="ml-2 h-4 w-4" />
        </PrimaryButton>
      </div>
    </form>
  );
}
