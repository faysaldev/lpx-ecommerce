/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TrendingUp } from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/UI/card";
import RecentlyViewed from "@/components/cart/RecentlyViewed";
import CartSummary from "@/components/cart/CartSummary";
import PromoCode from "@/components/cart/PromoCode";
import CartItem from "@/components/cart/CartItem";
// import { useCart } from "@/context/CartContext";

const useCart = () => {
  const items = [
    {
      id: "1",
      productId: "101",
      name: "Product A",
      price: 100,
      quantity: 2,
      image: "https://via.placeholder.com/150",
      vendor: "Vendor A",
    },
    {
      id: "2",
      productId: "102",
      name: "Product B",
      price: 50,
      quantity: 1,
      image: "https://via.placeholder.com/150",
      vendor: "Vendor B",
    },
    {
      id: "3",
      productId: "103",
      name: "Product C",
      price: 25,
      quantity: 3,
      image: "https://via.placeholder.com/150",
      vendor: "Vendor C",
    },
  ];

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 10; // Flat rate shipping
  const tax = subtotal * 0.1; // 10% tax
  const discount = 15; // Flat discount
  const total = subtotal + shipping + tax - discount;

  const couponCode = "DISCOUNT10";

  const updateQuantity = (itemId: string, quantity: number) => {
    console.log(`Updating item ${itemId} to quantity ${quantity}`);
    // Logic for updating quantity
  };

  const removeFromCart = (itemId: string) => {
    console.log(`Removing item ${itemId} from cart`);
    // Logic for removing item
  };

  const clearCart = () => {
    console.log("Clearing the cart");
    // Logic for clearing the cart
  };

  const applyCoupon = (code: string) => {
    console.log(`Applying coupon ${code}`);
    // Logic for applying coupon
  };

  return {
    items,
    itemCount,
    subtotal,
    shipping,
    tax,
    total,
    discount,
    couponCode,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
  };
};

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    shipping,
    tax,
    total,
    discount,
    couponCode,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
  } = useCart();

  // Remove coupon function
  const removeCoupon = () => {
    // Reset discount by applying an invalid code
    applyCoupon("");
  };

  return (
    <PageLayout
      title="Shopping Cart"
      description={
        itemCount === 0
          ? "Your cart is empty"
          : `${itemCount} ${itemCount === 1 ? "item" : "items"} in your cart`
      }
      breadcrumbs={[{ label: "Shopping Cart" }]}
    >
      {/* Page Header Actions */}
      {items.length > 0 && (
        <div className="flex justify-end -mt-16 mb-8">
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive/30 transition-all"
            size="sm"
          >
            Clear Cart
          </Button>
        </div>
      )}

      {items.length === 0 ? (
        /* Empty Cart State */
        <>
          <EmptyStates.EmptyCart />

          {/* Suggestions for Empty Cart */}
          <div className="mt-16">
            <Card className="border-dashed border-2 bg-background/50">
              <CardContent className="py-8">
                <h3 className="font-semibold text-lg mb-6 flex items-center justify-center gap-2 tracking-tight">
                  <TrendingUp className="h-5 w-5" />
                  Popular Categories
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {["Trading Cards", "Comics", "Coins", "Vintage Toys"].map(
                    (cat) => (
                      <Link
                        key={cat}
                        href={`/category/${cat
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        <Button
                          variant="secondary"
                          size="sm"
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {cat}
                        </Button>
                      </Link>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        /* Cart with Items */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item: any) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            {/* Promo Code Section */}
            <div className="pt-4 border-t border-border">
              {/* <PromoCode
                // onApply={applyCoupon}
                currentCode={couponCode}
                onRemove={removeCoupon}
              /> */}
            </div>

            {/* Recently Viewed - Desktop */}
            <div className="hidden lg:block pt-4 border-t border-border">
              <RecentlyViewed />
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24">
              <CartSummary
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                discount={discount}
                itemCount={itemCount}
                couponCode={couponCode}
              />
            </div>

            {/* Recently Viewed - Mobile */}
            <div className="lg:hidden pt-4 border-t border-border">
              <RecentlyViewed />
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
