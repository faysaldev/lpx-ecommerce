"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/UI/button.variants";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/UI/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { useCheckout } from "@/context/CheckoutContext";
import type { BillingAddress } from "@/lib/checkout";
import { Label } from "../UI/label";

const billingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  company: z.string().optional(),
  vatNumber: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(5, "Postal code must be at least 5 characters"),
  country: z.string().min(1, "Country is required"),
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

export default function BillingForm() {
  const {
    checkoutData,
    updateBillingAddress,
    setSameAsShipping,
    nextStep,
    prevStep,
  } = useCheckout();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BillingAddress>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      firstName: checkoutData.billingAddress?.firstName || "",
      lastName: checkoutData.billingAddress?.lastName || "",
      email: checkoutData.billingAddress?.email || "",
      phone: checkoutData.billingAddress?.phone || "",
      company: checkoutData.billingAddress?.company || "",
      vatNumber: checkoutData.billingAddress?.vatNumber || "",
      address: checkoutData.billingAddress?.address || checkoutData.shippingAddress?.address || "",
      address2: checkoutData.billingAddress?.address2 || "",
      city: checkoutData.billingAddress?.city || "",
      state: checkoutData.billingAddress?.state || "",
      postalCode: checkoutData.billingAddress?.postalCode || "",
      country: checkoutData.billingAddress?.country || "US",
    },
  });

  // Update form when same as shipping changes
  useEffect(() => {
    if (checkoutData.sameAsShipping && checkoutData.shippingAddress) {
      reset({
        ...checkoutData.shippingAddress,
        company: "",
        vatNumber: "",
      });
    }
  }, [checkoutData.sameAsShipping, checkoutData.shippingAddress, reset]);

  const onSubmit = (data: BillingAddress) => {
    if (!checkoutData.sameAsShipping) {
      updateBillingAddress(data);
    }
    nextStep();
  };

  const handleSameAsShippingChange = (checked: boolean) => {
    setSameAsShipping(checked);
    if (checked && checkoutData.shippingAddress) {
      reset({
        ...checkoutData.shippingAddress,
        company: "",
        vatNumber: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Same as Shipping Checkbox */}
      <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sameAsShipping"
            checked={checkoutData.sameAsShipping}
            onCheckedChange={(checked) => handleSameAsShippingChange(!!checked)}
          />
          <Label
            htmlFor="sameAsShipping"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Same as shipping address
          </Label>
        </div>
      </div>

      {/* Billing Form Fields - Only show if not same as shipping */}
      {!checkoutData.sameAsShipping && (
        <>
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Billing Contact</h3>
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

          {/* Company Information (Optional) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Company Information (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  {...register("company")}
                  placeholder="Acme Inc."
                />
              </div>

              <div>
                <Label htmlFor="vatNumber">VAT Number</Label>
                <Input
                  id="vatNumber"
                  {...register("vatNumber")}
                  placeholder="GB123456789"
                />
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
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
                <Label htmlFor="address2">
                  Apartment, Suite, etc. (Optional)
                </Label>
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
                    <SelectTrigger
                      className={errors.state ? "border-red-500" : ""}
                    >
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
                  <SelectTrigger
                    className={errors.country ? "border-red-500" : ""}
                  >
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
        </>
      )}

      {/* Form Actions */}
      <div className="flex justify-between pt-6 border-t">
        <SecondaryButton
          type="button"
          onClick={prevStep}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shipping
        </SecondaryButton>
        <PrimaryButton type="submit" size="lg">
          Continue to Payment
          <ArrowRight className="ml-2 h-4 w-4" />
        </PrimaryButton>
      </div>
    </form>
  );
}
