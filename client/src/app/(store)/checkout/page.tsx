"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Alert, AlertDescription } from "@/components/UI/alert";
import { Card, CardContent } from "@/components/UI/card";
// import { useCart } from "@/context/CartContext";
import { CheckoutProvider, useCheckout } from "@/context/CheckoutContext";
import { designTokens } from "@/design-system/compat";
import BillingForm from "@/components/Checkout/BillingForm";
import CheckoutSteps from "@/components/Checkout/CheckoutSteps";
import CheckoutSummary from "@/components/Checkout/CheckoutSummary";
import OrderReview from "@/components/Checkout/OrderReview";
import PaymentForm from "@/components/Checkout/PaymentForm";
import ShippingForm from "@/components/Checkout/ShippingForm";
import { cn } from "@/lib/utils";

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
      title: "Product A",
      price: 100,
      compareAtPrice: 120,
      description: "A high-quality product.",
      image: "https://via.placeholder.com/150",
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
      title: "Product B",
      price: 50,
      compareAtPrice: 60,
      description: "Affordable product.",
      category: "Home Appliances",
      stock: 10,
      state: "open",
      image: "https://via.placeholder.com/150",
      grading: {
        company: "PSA",
        grade: "9",
      },
      condition: "Near Mint",
      rarity: "Common",
    },
  },
];

function CheckoutContent() {
  const router = useRouter();
  // const { items } = useCart();
  const authLoading = false; // No auth loading in frontend-only app
  const { currentStep } = useCheckout();

  // Redirect if cart is empty
  useEffect(() => {
    if (!authLoading && items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  if (authLoading) {
    return (
      <PageLayout title="Loading..." showHeader={true} showFooter={true}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  if (items.length === 0) {
    return (
      <PageLayout title="Checkout" showHeader={true} showFooter={true}>
        <div className="text-center py-12">
          <h1 className={cn(designTokens.typography.h3, "mb-4")}>
            Your cart is empty
          </h1>
          <Link href="/browse" className="text-primary hover:underline">
            Continue Shopping
          </Link>
        </div>
      </PageLayout>
    );
  }



  const breadcrumbs = [{ label: "Cart", href: "/cart" }, { label: "Checkout" }];

  return (
    <PageLayout
      title="Checkout"
      breadcrumbs={breadcrumbs}
      showHeader={true}
      showFooter={true}
      withCard={false}
    >
      <div className="max-w-7xl mx-auto">
        {/* Guest Checkout Notice */}
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You{`'`}re checking out as a guest.
            <Link href="/sign-in" className="ml-1 text-primary hover:underline">
              Sign in
            </Link>{" "}
            to save your information for next time.
          </AlertDescription>
        </Alert>

        {/* Checkout Progress */}
        <CheckoutSteps 
          currentStep={currentStep} 
          onStepClick={(step) => {
            // Allow navigation to completed steps or current step, but not ahead of current
            if (step === "shipping" || 
                step === "billing" && ["shipping", "billing"].includes(currentStep) ||
                step === "payment" && ["shipping", "billing", "payment"].includes(currentStep) ||
                step === "review" && ["shipping", "billing", "payment", "review"].includes(currentStep)) {
              // For now, just allow navigation to previous steps
              // In a real implementation, you might want to validate that required fields are filled
            }
          }} 
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {currentStep === "shipping" && <ShippingForm />}
                {currentStep === "billing" && <BillingForm />}
                {currentStep === "payment" && <PaymentForm />}
                {currentStep === "review" && <OrderReview />}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CheckoutSummary />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  );
}
