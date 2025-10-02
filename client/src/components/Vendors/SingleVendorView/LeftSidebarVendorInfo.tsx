/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  CheckCircle,
  Clock,
  ExternalLink,
  Facebook,
  Globe,
  Heart,
  Instagram,
  MapPin,
  MessageCircle,
  Package,
  Star,
  Store,
  Twitter,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { cn } from "@/lib/utils";
function LeftSidebarVendorInfo({ vendor }: { vendor: any }) {
  return (
    <div className="lg:w-80 w-full space-y-4 lg:sticky lg:top-4 lg:self-start">
      {/* Vendor Card */}
      <div className="text-center bg-card rounded-lg p-6 border">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
          {vendor.logo ? (
            <Image
              src={vendor.logo}
              alt={vendor.name}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <Store className="h-10 w-10 text-muted-foreground" />
          )}
        </div>
        <h1 className="text-2xl font-bold">{vendor.name}</h1>
        {vendor.verified && (
          <div className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
            <CheckCircle className="h-3 w-3" />
            <span>Verified Seller</span>
          </div>
        )}
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-center gap-1 text-sm">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="font-semibold">{vendor.rating}</span>
            <span className="text-muted-foreground">
              ({vendor.reviewCount || 0} reviews)
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {vendor.totalSales?.toLocaleString() || 0} sales •{" "}
            {vendor.totalProducts || vendor.productCount || 0} items
          </div>
          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Clock className="h-3 w-3" />
            Responds {vendor.responseTime || "quickly"}
          </div>
          {vendor.location && (
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <MapPin className="h-3 w-3" />
              {typeof vendor.location === "string"
                ? vendor.location
                : `${vendor.location.city}, ${vendor.location.country}`}
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            Member since{" "}
            {new Date(vendor.joinedDate).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Quick Stats - Enhanced */}
      {vendor.specialties && vendor.specialties.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Specializes in
          </h3>
          <div className="flex flex-wrap gap-1">
            {vendor.specialties.map((specialty: any) => (
              <Badge
                key={`spec-${specialty}`}
                variant="secondary"
                className="text-xs"
              >
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Contact & Social */}
      {(vendor.contact || vendor.socialMedia) && (
        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Connect
          </h3>

          {vendor.contact?.website && (
            <a
              href={vendor.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Globe className="h-4 w-4" />
              Visit Website
              <ExternalLink className="h-3 w-3" />
            </a>
          )}

          <div className="flex gap-2">
            {vendor.socialMedia?.facebook && (
              <a
                href={vendor.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border rounded-md hover:bg-accent"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {vendor.socialMedia?.instagram && (
              <a
                href={vendor.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border rounded-md hover:bg-accent"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {vendor.socialMedia?.twitter && (
              <a
                href={vendor.socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border rounded-md hover:bg-accent"
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        <Button className="w-full" size="sm">
          <MessageCircle className="h-4 w-4 mr-2" />
          Contact Seller
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsFollowing(!isFollowing)}
          className="w-full"
          size="sm"
        >
          <Heart
            className={cn(
              "h-4 w-4 mr-2",
              isFollowing ? "fill-current text-red-500" : ""
            )}
          />
          {isFollowing ? "Following" : "Follow Shop"}
        </Button>
      </div>
    </div>
  );
}

export default LeftSidebarVendorInfo;
