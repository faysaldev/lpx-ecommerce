// app/payment-cancellation/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  XCircle,
  ShoppingBag,
  ArrowLeft,
  Home,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import ProtectedRoute from "@/Provider/ProtectedRoutes";

export default function PaymentCancellationPage() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-redirect to home page
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <ProtectedRoute allowedTypes={["admin", "seller", "customer"]}>
      <div className="min-h-screen bg-[#1C222D] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                  <XCircle className="h-10 w-10 text-red-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Payment Cancelled
            </h1>
            <p className="text-gray-400">
              Your payment process was interrupted or cancelled
            </p>
          </div>

          {/* Main Card */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6">
              {/* Status Message */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-yellow-500" />
                </div>
                <h2 className="text-lg font-semibold text-white mb-2">
                  Order Not Completed
                </h2>
                <p className="text-gray-400 text-sm">
                  Don{`'`}t worry, your items are still saved in your cart. You
                  can complete your purchase anytime.
                </p>
              </div>

              {/* Reasons List */}
              <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3 text-sm">
                  Common reasons for cancellation:
                </h3>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    Changed your mind during payment
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    Payment method issues
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    Network connectivity problems
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    Browser or app interruption
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => window.history.back()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retry Payment
                </Button>

                <Link href="/cart" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-white hover:bg-gray-700"
                    size="lg"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    View Cart
                  </Button>
                </Link>

                <Link href="/" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-white hover:bg-gray-700"
                    size="lg"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Support Section */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-3">
                    Need help with your payment?
                  </p>
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-400 hover:bg-green-600/20"
                    size="sm"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Countdown & Auto-redirect */}
          <div className="text-center mt-6">
            <div className="flex items-center justify-center text-gray-400 text-sm">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              <span>Redirecting to home in {countdown} seconds...</span>
            </div>
            <Button
              variant="link"
              className="text-blue-400 hover:text-blue-300 mt-2"
              onClick={() => (window.location.href = "/")}
            >
              Go now
            </Button>
          </div>

          {/* Security Notice */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Your payment information is secure. No charges were made to your
              account.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
