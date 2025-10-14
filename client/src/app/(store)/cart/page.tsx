/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Swal from "sweetalert2";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo, useCallback } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import { EmptyStates } from "@/components/shared/EmptyState";
import RecentlyViewed from "@/components/cart/RecentlyViewed";
import CartSummary from "@/components/cart/CartSummary";
import CartItem from "@/components/cart/CartItem";
import {
  useAllDeleteCartMutation,
  useAllShoppingCartQuery,
  useDeleteSingleCartMutation,
  // useUpdateCartItemMutation,
} from "@/redux/features/ShoppingCart/ShoppingCart";
import ProtectedRoute from "@/Provider/ProtectedRoutes";

interface CartItemType {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
  money?: number;
  stockQuantity: number;
  totalPrice?: number;
}

interface CartCalculations {
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

const CartPage = () => {
  const { data, refetch, isLoading } = useAllShoppingCartQuery({});
  const [deleteSingleCart] = useDeleteSingleCartMutation();
  const [deleteAllCart] = useAllDeleteCartMutation();
  // const [updateCartItem] = useUpdateCartItemMutation();

  // Local state for optimistic updates
  const [localCartItems, setLocalCartItems] = useState<
    Map<string, { quantity: number; price: number; stockQuantity: number }>
  >(new Map());

  const allData = data?.data?.attributes;
  const items: CartItemType[] = allData || [];

  // Initialize local cart state when data loads or changes
  useEffect(() => {
    if (items.length > 0) {
      const initialItems = new Map(
        items.map((item) => [
          item.productId,
          {
            quantity: item.quantity,
            price: item.money || item.price || 0,
            stockQuantity: item.stockQuantity || 0,
          },
        ])
      );
      setLocalCartItems(initialItems);
    } else {
      setLocalCartItems(new Map());
    }
  }, [data, items]);

  // Optimized quantity update handler with debouncing
  const updateQuantity = useCallback(
    async (productId: string, newQuantity: number, stockQuantity: number) => {
      // Validate quantity against stock
      const validQuantity = Math.max(1, Math.min(newQuantity, stockQuantity));

      // Update local state immediately for instant UI feedback
      setLocalCartItems((prev) => {
        const updated = new Map(prev);
        const currentItem = updated.get(productId);
        if (currentItem) {
          updated.set(productId, {
            ...currentItem,
            quantity: validQuantity,
          });
        }
        return updated;
      });

      // Find the cart item to get the cartId
      const cartItem = items.find((item) => item.productId === productId);
      if (!cartItem) return;
    },
    [items, refetch]
  );

  // Calculate cart totals with memoization
  const cartCalculations: CartCalculations = useMemo(() => {
    if (localCartItems.size === 0) {
      return {
        itemCount: 0,
        subtotal: 0,
        shipping: 0,
        tax: 0,
        discount: 0,
        total: 0,
      };
    }

    let itemCount = 0;
    let subtotal = 0;

    // Calculate from local state for instant updates
    localCartItems.forEach((item) => {
      itemCount += item.quantity;
      subtotal += item.price * item.quantity;
    });

    // Shipping: Free over $100, otherwise $10
    // const shipping = subtotal > 100 ? 0 : subtotal > 0 ? 10 : 0;
    const shipping = 20;

    // Tax (currently 0%)
    const tax = subtotal * 0;

    // Discount (can be applied via coupon)
    const discount = 0;

    // Final total
    const total = subtotal + shipping + tax - discount;

    return {
      itemCount,
      subtotal,
      shipping,
      tax,
      discount,
      total,
    };
  }, [localCartItems]);

  const couponCode = allData?.couponCode || "";

  // Remove single item from cart
  const removeFromCart = useCallback(
    async (cartId: string, productId: string) => {
      try {
        const res = await deleteSingleCart({ id: cartId });
        if (res && "data" in res && res.data?.code === 201) {
          // Remove from local state immediately
          setLocalCartItems((prev) => {
            const updated = new Map(prev);
            updated.delete(productId);
            return updated;
          });

          await refetch();

          Swal.fire({
            title: res?.data?.message || "Item removed successfully",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Error removing item:", error);
        Swal.fire({
          title: "Error",
          text: "Could not remove item. Please try again.",
          icon: "error",
        });
      }
    },
    [deleteSingleCart, refetch]
  );

  // Clear entire cart
  const clearCart = useCallback(async () => {
    const result = await Swal.fire({
      title: "Clear Cart?",
      text: "Are you sure you want to remove all items?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteAllCart("");
        if (res && "data" in res && res.data?.code === 201) {
          setLocalCartItems(new Map());
          await refetch();

          Swal.fire({
            title: res?.data?.message || "Cart cleared successfully",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Error clearing cart:", error);
        Swal.fire({
          title: "Error",
          text: "Could not clear cart. Please try again.",
          icon: "error",
        });
      }
    }
  }, [deleteAllCart, refetch]);

  return (
    <ProtectedRoute allowedTypes={["customer", "admin", "seller"]}>
      <PageLayout
        title="Shopping Cart"
        description={
          cartCalculations.itemCount === 0
            ? "Your cart is empty"
            : `${cartCalculations.itemCount} ${
                cartCalculations.itemCount === 1 ? "item" : "items"
              } in your cart`
        }
        breadcrumbs={[{ label: "Shopping Cart" }]}
      >
        {/* Clear Cart Button */}
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

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart State */
          <>
            <EmptyStates.EmptyCart />

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
              <div className="space-y-4">
                {items.map((item: any) => (
                  <CartItem
                    key={item.cartId || item.id}
                    item={item}
                    localQuantity={
                      localCartItems.get(item.productId)?.quantity ||
                      item.quantity
                    }
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
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
                  subtotal={cartCalculations.subtotal}
                  shipping={cartCalculations.shipping}
                  items={items}
                  tax={cartCalculations.tax}
                  total={cartCalculations.total}
                  discount={cartCalculations.discount}
                  itemCount={cartCalculations.itemCount}
                  couponCode={couponCode}
                  localCartItems={localCartItems}
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
    </ProtectedRoute>
  );
};

export default CartPage;
