"use client";

import { Separator } from "@/components/UI/separator";
import { Vendor } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import {
  Award,
  CheckCircle,
  MapPin,
  Package,
  Star,
  Store,
  Users,
} from "lucide-react";

export default function VendorCard({
  vendor,
  viewMode,
}: {
  vendor: Vendor;
  viewMode: "grid" | "list";
}) {
  const imageUrl = vendor?.storePhoto ? `${vendor.storePhoto}` : null;

  if (viewMode === "list") {
    return (
      <Link href={`/vendor/${vendor.id}`}>
        <div className="group bg-card rounded-lg border hover:shadow-lg transition-all my-5">
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="h-[150px] w-[200px]">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    width={500}
                    height={500}
                    alt={vendor.name}
                    className="object-fill rounded-l-md h-[150px] w-[200px]"
                  />
                ) : (
                  <Store className="h-10 w-10 text-primary" />
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0 mt-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {vendor.name}
                    </h3>
                    {vendor.verified && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {vendor.featured && (
                      <Award className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {vendor.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">
                        {parseFloat(vendor?.rating?.toFixed(2))}
                      </span>
                      <span className="text-muted-foreground">
                        ({vendor?.reviewCount?.toFixed(2)} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>{vendor.totalProducts} products</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="max-w-[200px] truncate">
                          {vendor?.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {vendor.totalProducts?.toLocaleString() || 0} products
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/vendor/${vendor.id}`}>
      <div className="group rounded-lg border hover:shadow-lg transition-all h-full flex flex-col">
        <div className="flex items-start justify-between mb-4 ">
          <div className="w-full">
            {imageUrl ? (
              <Image
                src={imageUrl}
                width={500}
                height={500}
                alt={vendor.name}
                className="object-fill rounded-md h-[200px] w-full "
              />
            ) : (
              <Store className="h-10 w-10 text-primary" />
            )}
          </div>
        </div>

        <div className="px-2 pb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
              {vendor.name}
            </h3>
            {vendor.verified && (
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            )}
            {vendor.featured && (
              <Award className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-2 mb-1 p-4">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="font-medium">
              {" "}
              {parseFloat(vendor?.rating?.toFixed(2))}
            </span>
            <span className="text-sm text-muted-foreground">
              ({vendor?.reviewCount?.toFixed(2)} reviews)
            </span>
          </div>

          <p className="text-sm text-muted-foreground  line-clamp-2 flex-1">
            {vendor.description}
          </p>

          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Package className="h-3 w-3" />
              <span>{vendor.totalProducts} items</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="max-w-[200px] truncate">{vendor?.location}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
