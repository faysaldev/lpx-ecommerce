/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import ProductCard from "@/components/shared/ProductCard";
import { Button } from "@/components/UI/button";
import { designTokens } from "@/design-system/compat";
import { cn } from "@/lib/utils";
import {
  useAllDeleteWishListMutation,
  useAllGetWishListQuery,
} from "@/redux/features/GetWishList/GetWishList";
import ProtectedRoute from "@/Provider/ProtectedRoutes";
import { toast } from "sonner";

const WishlistContent = () => {
  const { data } = useAllGetWishListQuery({});
  const allData = data?.data?.attributes;

  const [DeleteAllWish] = useAllDeleteWishListMutation();

  const HandleDeleteAllWish = async () => {
    try {
      const res = await DeleteAllWish("");
      if (res?.data?.code === 200) {
        toast.success("Delete sucessfull");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const breadcrumbs = [{ label: "Wishlist" }];
  if (!allData || allData.length === 0) {
    return (
      <PageLayout
        title="My Wishlist"
        description="Save your favorite items for later"
        breadcrumbs={breadcrumbs}
      >
        <EmptyStates.NoWishlistItems />
      </PageLayout>
    );
  }

  return (
    <ProtectedRoute allowedTypes={["customer", "admin", "seller"]}>
      <PageLayout
        title="My Wishlist"
        description={`You have ${allData.length} ${
          allData.length === 1 ? "item" : "items"
        } saved`}
        breadcrumbs={breadcrumbs}
      >
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={cn(designTokens.typography.h3)}>
            {allData.length} Saved {allData.length === 1 ? "Item" : "Items"}
          </h2>
          {allData.length > 0 && (
            <Button
              onClick={HandleDeleteAllWish}
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {/* Products Grid */}
        <div
          className={cn(
            "grid gap-6",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          )}
        >
          {allData.map((product: any) => (
            <ProductCard
              key={product._id}
              product={product}
              viewMode="grid"
              onAddToCart={(p: any) => {
                if (process.env.NODE_ENV !== "production")
                  console.log("Add to cart:", p);
              }}
              onBuyNow={(p: any) => {
                if (process.env.NODE_ENV !== "production")
                  console.log("Buy now:", p);
              }}
              onShare={(p: any) => {
                if (process.env.NODE_ENV !== "production")
                  console.log("Share:", p);
              }}
            />
          ))}
        </div>

        {/* Continue Shopping */}
        {allData.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="text-center">
              <h3 className={cn(designTokens.typography.h4, "mb-4")}>
                Looking for more?
              </h3>
              <p className="text-muted-foreground mb-6">
                Discover more unique collectibles from our verified vendors
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline" size="lg">
                  <Link href="/browse">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Browse Collection
                  </Link>
                </Button>
                <Button asChild size="lg">
                  <Link href="/vendors">
                    Explore Vendors
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </PageLayout>
    </ProtectedRoute>
  );
};

export default WishlistContent;
