/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import { IconButton } from "@/components/UI/button.variants";
import { Separator } from "@/components/UI/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/UI/sheet";
import { logout } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";

function MobileMenuToggle({
  isLoaded,
  isMenuOpen,
  isSignedIn,
  memoizedCategories,
  setIsMenuOpen,
  user,
}: {
  isMenuOpen: any;
  setIsMenuOpen: any;
  memoizedCategories: any;
  isLoaded: any;
  isSignedIn: any;
  user: any;
}) {
  const dispatch = useAppDispatch();
  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <IconButton className="md:hidden">
          <Menu className="h-6 w-6" />
        </IconButton>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {/* Mobile Navigation */}
          <nav className="flex flex-col gap-3">
            <p className="text-sm font-semibold mb-2">Categories</p>
            {memoizedCategories.map((category: any) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="block py-2 text-sm hover:text-primary transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <Separator className="my-2" />
            <Link
              href="/browse"
              className="py-2 hover:text-primary transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse All
            </Link>
            <Link
              href="/vendors"
              className="py-2 hover:text-primary transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Vendors
            </Link>
            {isLoaded && !isSignedIn && (
              <>
                <Link
                  href="/auth/signin"
                  className="py-2 hover:text-primary transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="py-2 hover:text-primary transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
            {isLoaded && isSignedIn && (
              <>
                <Separator className="my-2" />
                <div className="flex items-center gap-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.image ? user?.image : "/userProfile.svg"}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {user?.name || user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Separator className="my-2" />
                <Link
                  href="/dashboard"
                  className="py-2 hover:text-primary transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Dashboard
                </Link>
                <Link
                  href="/orders"
                  className="py-2 hover:text-primary transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  href="/wishlist"
                  className="py-2 hover:text-primary transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wishlist
                </Link>
                <Link
                  href="/notifications"
                  className="py-2 hover:text-primary transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Notifications
                </Link>
                <Link
                  href="/settings"
                  className="py-2 hover:text-primary transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                {user?.type === "seller" && (
                  <Link
                    href="/sell"
                    className="py-2 hover:text-primary transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Become a Seller
                  </Link>
                )}
                <Separator className="my-2" />
                <button
                  type="button"
                  onClick={() => {
                    dispatch(logout());
                    setIsMenuOpen(false);
                  }}
                  className="py-2 text-left hover:text-primary transition w-full"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileMenuToggle;
