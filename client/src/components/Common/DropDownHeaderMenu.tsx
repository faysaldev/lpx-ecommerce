/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Heart,
  LogIn,
  LogOut,
  Package,
  Settings,
  Shield,
  ShoppingBag,
  Store,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import { Button } from "@/components/UI/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { logout } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";

function DropDownHeaderMenu({
  isLoaded,
  isSignedIn,
  user,
}: {
  isLoaded: any;
  isSignedIn: any;
  user: any;
}) {
  const dispatch = useAppDispatch();
  return (
    <div className="auth-button-group">
      {!isLoaded ? (
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
      ) : isSignedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user?.image ? user?.image : "/userProfile.svg"}
                  alt={user?.name || "User"}
                />
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || user?.name || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="cursor-pointer">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            {user?.type === "seller" && (
              <DropdownMenuItem asChild>
                <Link href="/vendor/dashboard" className="cursor-pointer">
                  <Store className="mr-2 h-4 w-4" />
                  Vendor Dashboard
                </Link>
              </DropdownMenuItem>
            )}
            {user?.type === "admin" && (
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Panel
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/orders" className="cursor-pointer">
                <Package className="mr-2 h-4 w-4" />
                My Orders
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/wishlist" className="cursor-pointer">
                <Heart className="mr-2 h-4 w-4" />
                Wishlist
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user?.type === "customer" && (
              <DropdownMenuItem asChild>
                <Link href="/sell" className="cursor-pointer">
                  <Store className="mr-2 h-4 w-4" />
                  Become a Seller
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => dispatch(logout())}
              className="cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="flex items-center gap-2">
            <Link href="/auth/signin">
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default DropDownHeaderMenu;
