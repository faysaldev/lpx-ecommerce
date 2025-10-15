/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Bell, Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { IconButton } from "@/components/UI/button.variants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { designTokens } from "@/design-system/compat";
// import { getNavigationCategories } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAllCategoriesQuery } from "@/redux/features/BrowseCollectibles/BrowseCollectibles";
import {
  selectHeaderStatitics,
  setAllCategories,
  setHeaderStatitics,
} from "@/redux/features/Common/CommonSlice";
import { useLandingpageHeaderStatiticsQuery } from "@/redux/features/Common/LandingPageUtils";
import MobileMenuToggle from "./Common/MobileMenuToggle";
import DropDownHeaderMenu from "./Common/DropDownHeaderMenu";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<
    { name: string; slug: string; productCount?: number }[]
  >([]);
  const headerStats = useAppSelector(selectHeaderStatitics);
  const { data: categoriesData } = useAllCategoriesQuery({});

  const { data: headerStatitics } = useLandingpageHeaderStatiticsQuery({});
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isLoaded = true;
  const isSignedIn = useAppSelector(selectCurrentUser);
  useEffect(() => {
    setCategories(categoriesData?.data?.attributes || []);
    dispatch(setAllCategories(categoriesData?.data?.attributes || null));
    dispatch(setHeaderStatitics(headerStatitics?.data));
  }, [categoriesData, headerStatitics]);

  const memoizedCategories = useMemo(() => categories, [categories]);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border w-full">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                width={100}
                height={100}
                alt="image"
                src="/lpx_logo.svg"
                className="h-8"
                style={{ filter: "invert(1) grayscale(100%)" }} // This inverts the image to white
              />
            </Link>
            {/* Professional Tagline */}
            <div className="hidden lg:flex items-center">
              <span className="text-sm text-muted-foreground">
                Your Trusted Marketplace for Rare Collectibles
              </span>
            </div>
          </div>

          {/* Navigation and Icons */}
          <div className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 header-auth-section">
              {/* Categories Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "transition",
                      designTokens.colors.text.secondary,
                      "hover:text-primary"
                    )}
                  >
                    Categories
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[400px] md:w-[500px]">
                  <div className="grid gap-3 p-4 md:grid-cols-2">
                    {memoizedCategories.map((category: any) => (
                      <DropdownMenuItem key={category.name}>
                        <Link
                          href={`/category/${category.name}`}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer w-full"
                        >
                          <div className="text-sm font-medium leading-none">
                            {category.name}
                          </div>
                          <p className="hidden text-xs md:block line-clamp-2 leading-snug text-muted-foreground">
                            Browse our collection of{" "}
                            {category.description.toLowerCase()}
                          </p>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                href="/browse"
                className={cn(
                  "transition",
                  designTokens.colors.text.secondary,
                  "hover:text-primary"
                )}
              >
                Browse
              </Link>
              <Link
                href="/vendors"
                className={cn(
                  "transition",
                  designTokens.colors.text.secondary,
                  "hover:text-primary"
                )}
              >
                Vendors
              </Link>

              {user && (
                <>
                  <IconButton asChild className="relative">
                    <Link href="/cart">
                      <ShoppingCart className="h-6 w-6" />
                      {(headerStats?.cartItemsCount ?? 0) > 0 && (
                        <Badge
                          className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                          variant="destructive"
                        >
                          {headerStats?.cartItemsCount
                            ? headerStats?.cartItemsCount
                            : 0}
                        </Badge>
                      )}
                    </Link>
                  </IconButton>

                  <IconButton asChild className="relative">
                    <Link href="/wishlist">
                      <Heart className="h-5 w-5" />
                      {(headerStats?.wishlistProductIds?.length ?? 0) > 0 && (
                        <Badge
                          className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                          variant="destructive"
                        >
                          {headerStats?.wishlistProductIds?.length
                            ? headerStats?.wishlistProductIds?.length
                            : 0}
                        </Badge>
                      )}
                    </Link>
                  </IconButton>

                  <IconButton asChild className="relative">
                    <Link href="/notifications">
                      <Bell className="h-5 w-5" />
                      {isSignedIn &&
                        (headerStats?.unreadNotificationsCount ?? 0) > 0 && (
                          <Badge
                            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                            variant="destructive"
                          >
                            {(headerStats?.unreadNotificationsCount ?? 0) > 9
                              ? "9+"
                              : headerStats?.unreadNotificationsCount
                              ? headerStats?.unreadNotificationsCount
                              : 0}
                          </Badge>
                        )}
                    </Link>
                  </IconButton>
                </>
              )}

              <DropDownHeaderMenu
                isLoaded={isLoaded}
                isSignedIn={isSignedIn}
                user={user}
              />
            </nav>

            {/* Mobile Menu Toggle */}
            <MobileMenuToggle
              isLoaded={isLoaded}
              isMenuOpen={isMenuOpen}
              isSignedIn={isSignedIn}
              memoizedCategories={memoizedCategories}
              setIsMenuOpen={setIsMenuOpen}
              user={user}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
