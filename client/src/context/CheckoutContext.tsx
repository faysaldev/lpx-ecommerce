"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { CheckoutData, CheckoutStep, ShippingAddress, BillingAddress, PaymentMethod } from "@/lib/checkout";

interface CheckoutContextType {
  checkoutData: CheckoutData;
  currentStep: CheckoutStep;
  setCurrentStep: (step: CheckoutStep) => void;
  updateShippingAddress: (address: ShippingAddress) => void;
  updateBillingAddress: (address: BillingAddress) => void;
  setSameAsShipping: (same: boolean) => void;
  updatePaymentMethod: (method: PaymentMethod) => void;
  updateCheckoutData: (data: Partial<CheckoutData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const initialCheckoutData: CheckoutData = {
  shippingAddress: null,
  billingAddress: null,
  sameAsShipping: false,
  paymentMethod: null,
  acceptTerms: false,
  subscribeNewsletter: false,
  shipping: 0,
  discount: 0,
  couponCode: "",
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [checkoutData, setCheckoutData] = useState<CheckoutData>(initialCheckoutData);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");

  const updateShippingAddress = (address: ShippingAddress) => {
    setCheckoutData(prev => ({
      ...prev,
      shippingAddress: address,
    }));
  };

  const updateBillingAddress = (address: BillingAddress) => {
    setCheckoutData(prev => ({
      ...prev,
      billingAddress: address,
      sameAsShipping: false, // Uncheck "same as shipping" when manually updating billing
    }));
  };

  const setSameAsShipping = (same: boolean) => {
    setCheckoutData(prev => ({
      ...prev,
      sameAsShipping: same,
      billingAddress: same && prev.shippingAddress ? { ...prev.shippingAddress } : prev.billingAddress,
    }));
  };

  const updatePaymentMethod = (method: PaymentMethod) => {
    setCheckoutData(prev => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const updateCheckoutData = (data: Partial<CheckoutData>) => {
    setCheckoutData(prev => ({
      ...prev,
      ...data,
    }));
  };

  const nextStep = () => {
    const steps: CheckoutStep[] = ["shipping", "billing", "payment", "review"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: CheckoutStep[] = ["shipping", "billing", "payment", "review"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        checkoutData,
        currentStep,
        setCurrentStep,
        updateShippingAddress,
        updateBillingAddress,
        setSameAsShipping,
        updatePaymentMethod,
        updateCheckoutData,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}