"use client";

import { Fragment, type ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/UI/breadcrumb";
import { designTokens } from "@/design-system/compat";
import { cn } from "@/lib/utils";

export interface BreadcrumbData {
  label: string;
  href?: string;
}

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbData[];
  className?: string;
  containerClassName?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  fullWidth?: boolean;
  withCard?: boolean;
}

export default function PageLayout({
  children,
  title,
  description,
  breadcrumbs = [],
  className,
  containerClassName,
  showHeader = true,
  showFooter = true,
  fullWidth = false,
  withCard = true,
}: PageLayoutProps) {
  const allBreadcrumbs =
    breadcrumbs.length > 0
      ? [{ label: "Home", href: "/" }, ...breadcrumbs]
      : [];

  return (
    <div className={cn("min-h-screen flex flex-col bg-background", className)}>
      {showHeader && <Header />}

      <main className="flex-grow">
        <div
          className={cn(
            "mx-auto px-6 py-8",
            !fullWidth && "max-w-7xl",
            containerClassName
          )}
        >
          {withCard ? (
            <div className="bg-card rounded-xl border border-border shadow-lg p-8">
              {/* Breadcrumbs */}
              {allBreadcrumbs.length > 0 && (
                <Breadcrumb className="mb-8">
                  <BreadcrumbList>
                    {allBreadcrumbs.map((crumb, index) => (
                      <Fragment key={`breadcrumb-${crumb.label}-${index}`}>
                        <BreadcrumbItem>
                          {index < allBreadcrumbs.length - 1 ? (
                            <BreadcrumbLink
                              href={crumb.href || "#"}
                              className="hover:text-primary transition-colors"
                            >
                              {crumb.label}
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage className="text-foreground font-medium">
                              {crumb.label}
                            </BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                        {index < allBreadcrumbs.length - 1 && (
                          <BreadcrumbSeparator />
                        )}
                      </Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              )}

              {/* Page Header */}
              {(title || description) && (
                <div className="mb-8">
                  {title && (
                    <h1 className={cn(designTokens.typography.h1, "mb-2")}>
                      {title}
                    </h1>
                  )}
                  {description && (
                    <p className="text-muted-foreground">{description}</p>
                  )}
                </div>
              )}

              {/* Page Content */}
              {children}
            </div>
          ) : (
            <>
              {/* Breadcrumbs for non-card layout */}
              {allBreadcrumbs.length > 0 && (
                <Breadcrumb className="mb-8">
                  <BreadcrumbList>
                    {allBreadcrumbs.map((crumb, index) => (
                      <Fragment key={`breadcrumb-${crumb.label}-${index}`}>
                        <BreadcrumbItem>
                          {index < allBreadcrumbs.length - 1 ? (
                            <BreadcrumbLink
                              href={crumb.href || "#"}
                              className="hover:text-primary transition-colors"
                            >
                              {crumb.label}
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage className="text-foreground font-medium">
                              {crumb.label}
                            </BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                        {index < allBreadcrumbs.length - 1 && (
                          <BreadcrumbSeparator />
                        )}
                      </Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              )}

              {/* Page Header for non-card layout */}
              {(title || description) && (
                <div className="mb-8">
                  {title && (
                    <h1 className={cn(designTokens.typography.h1, "mb-2")}>
                      {title}
                    </h1>
                  )}
                  {description && (
                    <p className="text-muted-foreground">{description}</p>
                  )}
                </div>
              )}

              {/* Page Content */}
              {children}
            </>
          )}
        </div>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}

// Export a simplified version for special pages
export function SimplePageLayout({
  children,
  className,
  containerClassName,
  showHeader = true,
  showFooter = true,
  fullWidth = false,
}: Omit<
  PageLayoutProps,
  "title" | "description" | "breadcrumbs" | "withCard"
>) {
  return (
    <div className={cn("min-h-screen flex flex-col bg-background", className)}>
      {showHeader && <Header />}

      <main className="flex-grow">
        <div
          className={cn(
            "mx-auto px-6 py-8",
            !fullWidth && "max-w-7xl",
            containerClassName
          )}
        >
          {children}
        </div>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}
