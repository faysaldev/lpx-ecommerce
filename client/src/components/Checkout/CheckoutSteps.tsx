"use client";

import { Check, CreditCard, FileText, MapPin, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CheckoutStep } from "@/lib/checkout";

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
  onStepClick?: (step: CheckoutStep) => void;
}

const steps: { id: CheckoutStep; label: string; icon: React.ReactNode }[] = [
  { id: "shipping", label: "Shipping", icon: <Package className="h-5 w-5" /> },
  { id: "billing", label: "Billing", icon: <MapPin className="h-5 w-5" /> },
  { id: "payment", label: "Payment", icon: <CreditCard className="h-5 w-5" /> },
  { id: "review", label: "Review", icon: <FileText className="h-5 w-5" /> },
];

export default function CheckoutSteps({
  currentStep,
  onStepClick,
}: CheckoutStepsProps) {
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute left-0 top-1/2 h-1 bg-gray-200 w-full -translate-y-1/2" />
        <div
          className="absolute left-0 top-1/2 h-1 bg-primary -translate-y-1/2 transition-all duration-300"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = index < currentStepIndex;
          const isClickable = isCompleted || isActive;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center"
            >
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable || !onStepClick}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
                  "border-2 bg-white dark:bg-gray-800",
                  isActive &&
                    "border-primary bg-primary text-white shadow-lg scale-110",
                  isCompleted && "border-primary bg-primary text-white",
                  !isActive && !isCompleted && "border-gray-300 text-gray-400",
                  isClickable &&
                    onStepClick &&
                    "cursor-pointer hover:scale-105",
                  !isClickable && "cursor-not-allowed"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <div
                    className={cn(
                      "transition-colors",
                      isActive && "text-white",
                      !isActive && !isCompleted && "text-gray-400"
                    )}
                  >
                    {step.icon}
                  </div>
                )}
              </button>
              <span
                className={cn(
                  "mt-2 text-sm font-medium transition-colors",
                  isActive && "text-primary",
                  isCompleted && "text-primary",
                  !isActive && !isCompleted && "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
