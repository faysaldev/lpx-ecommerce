"use client";

import {
  AlertCircle,
  Bell,
  BellOff,
  CreditCard,
  Heart,
  type LucideIcon,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/UI/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  onSecondaryAction?: () => void;
  className?: string;
  iconClassName?: string;
  variant?: "default" | "card" | "minimal";
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction,
  className,
  iconClassName,
  variant = "default",
  size = "md",
  children,
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: "py-8",
      iconWrapper: "w-16 h-16",
      icon: "h-8 w-8",
      title: "text-lg",
      description: "text-sm",
      button: "sm" as const,
    },
    md: {
      container: "py-12",
      iconWrapper: "w-24 h-24",
      icon: "h-12 w-12",
      title: "text-xl",
      description: "text-base",
      button: "default" as const,
    },
    lg: {
      container: "py-16",
      iconWrapper: "w-32 h-32",
      icon: "h-16 w-16",
      title: "text-2xl",
      description: "text-lg",
      button: "lg" as const,
    },
  };

  const currentSize = sizeClasses[size];

  const content = (
    <>
      <div
        className={cn(
          "mx-auto bg-muted rounded-full flex items-center justify-center mb-6",
          currentSize.iconWrapper,
          variant === "minimal" && "bg-transparent"
        )}
      >
        <Icon
          className={cn(
            "text-muted-foreground",
            currentSize.icon,
            iconClassName
          )}
        />
      </div>

      <h3 className={cn("font-semibold mb-2", currentSize.title)}>{title}</h3>

      {description && (
        <p
          className={cn(
            "text-muted-foreground mb-8 max-w-md mx-auto",
            currentSize.description
          )}
        >
          {description}
        </p>
      )}

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {actionLabel &&
            (actionHref ? (
              <Button asChild size={currentSize.button}>
                <Link href={actionHref}>{actionLabel}</Link>
              </Button>
            ) : (
              <Button onClick={onAction} size={currentSize.button}>
                {actionLabel}
              </Button>
            ))}

          {secondaryActionLabel &&
            (secondaryActionHref ? (
              <Button asChild variant="outline" size={currentSize.button}>
                <Link href={secondaryActionHref}>{secondaryActionLabel}</Link>
              </Button>
            ) : (
              <Button
                onClick={onSecondaryAction}
                variant="outline"
                size={currentSize.button}
              >
                {secondaryActionLabel}
              </Button>
            ))}
        </div>
      )}

      {children}
    </>
  );

  if (variant === "card") {
    return (
      <Card className={className}>
        <CardContent className={cn("text-center", currentSize.container)}>
          {content}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("text-center", currentSize.container, className)}>
      {content}
    </div>
  );
}

// Pre-built empty states for common scenarios
export const EmptyStates = {
  NoProducts: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={Package}
      title="No products found"
      description="Try adjusting your filters or search query to find what you're looking for."
      actionLabel="Browse All Products"
      actionHref="/browse"
      {...props}
    />
  ),

  EmptyCart: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={ShoppingCart}
      title="Your cart is empty"
      description="Looks like you haven't added any items to your cart yet. Start exploring our collection!"
      actionLabel="Browse Collection"
      actionHref="/browse"
      {...props}
    />
  ),

  NoOrders: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={ShoppingBag}
      title="No orders yet"
      description="You haven't placed any orders yet. Start shopping to see your order history here."
      actionLabel="Start Shopping"
      actionHref="/browse"
      {...props}
    />
  ),

  NoWishlistItems: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={Heart}
      title="Your wishlist is empty"
      description="Save items you love to your wishlist and come back to them anytime."
      actionLabel="Explore Products"
      actionHref="/browse"
      {...props}
    />
  ),

  NoNotifications: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={Bell}
      title="No notifications"
      description="You're all caught up! We'll notify you when there's something new."
      {...props}
    />
  ),

  NoSearchResults: ({
    query,
    onClear,
    ...props
  }: { query?: string; onClear?: () => void } & Partial<EmptyStateProps>) => (
    <EmptyState
      icon={Search}
      title="No results found"
      description={
        query
          ? `No results found for "${query}". Try different keywords or browse all products.`
          : "No results found. Try adjusting your search."
      }
      actionLabel="Clear Search"
      onAction={onClear}
      secondaryActionLabel="Browse All"
      secondaryActionHref="/browse"
      {...props}
    />
  ),

  Error: ({
    onRetry,
    ...props
  }: { onRetry?: () => void } & Partial<EmptyStateProps>) => (
    <EmptyState
      icon={AlertCircle}
      title="Something went wrong"
      description="We encountered an error while loading this content. Please try again."
      actionLabel="Try Again"
      onAction={onRetry}
      {...props}
    />
  ),

  NoVendors: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={Users}
      title="No vendors found"
      description="Try adjusting your filters or search terms to find vendors."
      actionLabel="Clear Filters"
      {...props}
    />
  ),

  NoAddresses: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={MapPin}
      title="No shipping addresses saved"
      description="Add a shipping address to make checkout faster and easier."
      actionLabel="Add Address"
      {...props}
    />
  ),

  NoPaymentMethods: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={CreditCard}
      title="No payment methods"
      description="Add a payment method to make checkout faster and easier."
      actionLabel="Add Payment Method"
      {...props}
    />
  ),

  NoVendorProducts: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={Package}
      title="No products yet"
      description="Start listing your products to reach customers."
      actionLabel="Add Your First Product"
      actionHref="/vendor/dashboard"
      {...props}
    />
  ),

  EmptyNotifications: ({
    filterType,
    showUnreadOnly,
    ...props
  }: {
    filterType?: string;
    showUnreadOnly?: boolean;
  } & Partial<EmptyStateProps>) => (
    <EmptyState
      icon={BellOff}
      title="No notifications"
      description={
        showUnreadOnly
          ? "You don't have any unread notifications. Great job staying on top of things!"
          : filterType === "all" || !filterType
          ? "You don't have any notifications yet. We'll notify you when something important happens."
          : `No ${filterType} notifications to show.`
      }
      actionLabel={
        showUnreadOnly ? "Show All Notifications" : "Browse Products"
      }
      actionHref={showUnreadOnly ? undefined : "/browse"}
      {...props}
    />
  ),

  NoVendorInfo: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon={Store}
      title="Vendor not found"
      description="The vendor you're looking for doesn't exist or has been removed."
      actionLabel="Browse All Vendors"
      actionHref="/vendors"
      {...props}
    />
  ),
};
