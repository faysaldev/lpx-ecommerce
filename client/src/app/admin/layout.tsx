"use client";

import {
  AlertCircle,
  BarChart3,
  ChevronLeft,
  DollarSign,
  LayoutDashboard,
  ListEndIcon,
  Menu,
  Package,
  Settings,
  Shield,
  ShoppingCart,
  Store,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/UI/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/UI/tooltip";
// import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import { cn } from "@/lib/utils";
import { useAllCategoriesQuery } from "@/redux/features/BrowseCollectibles/BrowseCollectibles";
import { useAppDispatch } from "@/redux/hooks";
import { setAllCategories } from "@/redux/features/Common/CommonSlice";

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Vendors",
    href: "/admin/vendors",
    icon: Store,
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: DollarSign,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "General",
    href: "/admin/general",
    icon: ListEndIcon,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const pathname: string | null = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { data: categoriesData, isLoading: categoriesLoading } =
    useAllCategoriesQuery({});
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAllCategories(categoriesData?.data?.attributes || null));
  }, [categoriesData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          >
            {mobileSidebarOpen ? <X /> : <Menu />}
          </Button>

          <div className="flex items-center gap-2 ml-2 md:ml-0">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Admin Panel</span>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-muted-foreground">Admin Mode</span>
              </div>
              <span className="font-medium">Admin User</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Exit Admin
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden md:flex flex-col border-r bg-muted/10 transition-all duration-300",
            sidebarOpen ? "w-64" : "w-16"
          )}
        >
          <div className="flex items-center justify-between p-4">
            {sidebarOpen && (
              <h2 className="text-lg font-semibold">Navigation</h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="ml-auto"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex-1 px-2 pb-4">
            <TooltipProvider>
              {adminNavItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname?.startsWith(item.href);

                return (
                  <Tooltip key={item.href} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-1",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        )}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {sidebarOpen && <span>{item.title}</span>}
                      </Link>
                    </TooltipTrigger>
                    {!sidebarOpen && (
                      <TooltipContent side="right">
                        <p>{item.title}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </nav>

          {/* Admin Info */}
          {sidebarOpen && (
            <div className="border-t p-4">
              <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium text-yellow-900 dark:text-yellow-400">
                      Admin Access
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-500 mt-1">
                      All actions are logged and monitored for security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Mobile Sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <span className="sr-only">Close navigation overlay</span>
            </button>
            <aside className="absolute left-0 top-0 h-full w-64 border-r bg-background">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Navigation</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <nav className="p-4">
                {adminNavItems.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname?.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-1",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    // <ProtectedRoute requiredRole="admin" redirectTo="/sign-in">
    <AdminLayoutContent>{children}</AdminLayoutContent>
    // </ProtectedRoute>
  );
}
