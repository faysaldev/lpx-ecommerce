// app/not-found.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Navigation,
  Home,
} from "lucide-react";
import { Button } from "@/components/UI/button";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Calculate gradient position based on mouse movement
  const gradientX = (mousePosition.x / window.innerWidth) * 100;
  const gradientY = (mousePosition.y / window.innerHeight) * 100;

  return (
    <div
      className="min-h-screen bg-[#1C222D] flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at ${gradientX}% ${gradientY}%, #2D3748 0%, #1C222D 50%)`,
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/20 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Animated Number */}
        <div className="relative mb-8">
          <div className="text-[180px] font-bold text-gray-700/40 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
              404
            </div>
          </div>
          <div className="absolute -top-4 -right-4">
            <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 mb-8">
          <h1 className="text-4xl font-bold text-white">Page Not Found</h1>
          <p className="text-xl text-gray-400 max-w-md mx-auto">
            Oops! The page you{`'`}re looking for seems to have wandered off
            into the digital void.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/" className="flex-1 sm:flex-none">
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25"
              size="lg"
            >
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Button>
          </Link>

          <Link href="/browse" className="flex-1 sm:flex-none">
            <Button
              variant="outline"
              className="w-full border-gray-600 text-white hover:bg-gray-700/50 backdrop-blur-sm"
              size="lg"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Browse Products
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-white font-semibold mb-4 flex items-center justify-center">
            <Navigation className="h-5 w-5 mr-2 text-blue-400" />
            Popular Destinations
          </h3>
          <div className="flex items-center justify-center">
            {[
              { href: "/cart", label: "Your Cart" },
              { href: "/browse", label: "Categories" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-gray-300 hover:text-white hover:bg-gray-700/50"
                  size="sm"
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Still lost?{" "}
            <Link
              href="/contact"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Contact our support team
            </Link>{" "}
            for assistance.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
