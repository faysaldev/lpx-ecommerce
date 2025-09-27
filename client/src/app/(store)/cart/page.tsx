/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TrendingUp } from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import RecentlyViewed from "@/components/cart/RecentlyViewed";
import CartSummary from "@/components/cart/CartSummary";
import CartItem from "@/components/cart/CartItem";
import { useAllShoppingCartQuery } from "@/redux/features/ShoppingCart/ShoppingCart";

const CartPage = () => {
  // Fetch data from the backend
  const { data, error, isLoading } = useAllShoppingCartQuery({});
  
  // If data is still loading or there's an error, show loading or error state
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error loading cart data</div>;
  }

  // Access the cart items directly from the response
  const allData = data?.data?.attributes; // Assuming cart items are directly in attributes
  const items = allData || []; // Directly use `allData` if it represents the cart items
 

  // Calculate item count, subtotal, etc.
  const itemCount = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc: number, item: any) => {
    const itemTotal = (item.money || item.price) * item.quantity;
    return acc + (itemTotal || item.totalPrice || 0);
  }, 0);
  const shipping = 10; // Flat rate shipping
  const tax = subtotal * 0.1; // 10% tax
  const discount = 15; // Flat discount
  const total = subtotal + shipping + tax - discount;

  const couponCode = allData?.couponCode || ""; // Assuming 'couponCode' comes from the backend
  
  const updateQuantity = (itemId: string, quantity: number) => {
    console.log(`Updating item ${itemId} to quantity ${quantity}`);
    // Logic for updating quantity (trigger API call here)
  };

  const removeFromCart = (itemId: string) => {
    console.log(`Removing item ${itemId} from cart`);
    // Logic for removing item (trigger API call here)
  };

  const clearCart = () => {
    console.log("Clearing the cart");
    // Logic for clearing the cart (trigger API call here)
  };

  const applyCoupon = (code: string) => {
    console.log(`Applying coupon ${code}`);
    // Logic for applying coupon (trigger API call here)
  };

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
                        href={`/category/${cat.toLowerCase().replace(" ", "-")}`}
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
            <div className="space-y-4">
              {items.map((item: any) => (
                <CartItem
                  key={item.id || `${item.productId}-${Math.random()}`}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            {/* Promo Code Section */}
            <div className="pt-4 border-t border-border">
              {/* <PromoCode onApply={applyCoupon} currentCode={couponCode} onRemove={removeCoupon} /> */}
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
};

export default CartPage;
