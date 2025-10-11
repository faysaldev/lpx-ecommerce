import { Facebook, Instagram, Package, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/UI/separator";
// manik added comment
export default function Footer() {
  return (
    <footer className="bg-background border-t border-border text-foreground mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="flex items-center gap-2">
                <img
                  src={"./lpx_logo.svg"}
                  className="h-8"
                  style={{ filter: "invert(1) grayscale(100%)" }} // This inverts the image to white
                />
              </Link>
            </div>
            <p className="text-muted-foreground mb-4">
              Your trusted marketplace for authentic collectibles. Connect with
              verified vendors and discover rare treasures.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-white transition"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-white transition"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-white transition"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-white transition"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/browse"
                  className="text-muted-foreground hover:text-white transition"
                >
                  Browse All
                </Link>
              </li>
              <li>
                <Link
                  href="/new-arrivals"
                  className="text-muted-foreground hover:text-white transition"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/featured"
                  className="text-muted-foreground hover:text-white transition"
                >
                  Featured Items
                </Link>
              </li>
              <li>
                <Link
                  href="/deals"
                  className="text-muted-foreground hover:text-white transition"
                >
                  Deals & Offers
                </Link>
              </li>
              <li>
                <Link
                  href="/vendors"
                  className="text-muted-foreground hover:text-white transition"
                >
                  Top Vendors
                </Link>
              </li>
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h3 className="font-semibold mb-4">For Vendors</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/sell"
                  className="text-muted-foreground hover:text-white transition"
                >
                  Start Selling
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor-guide"
                  className="text-muted-foreground hover:text-white transition"
                >
                  Vendor Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-white transition"
                >
                  Pricing & Fees
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor-tools"
                  className="text-muted-foreground hover:text-white transition"
                >
                  Vendor Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/success-stories"
                  className="text-muted-foreground hover:text-white transition"
                >
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-muted-foreground hover:text-white transition"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-white transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-muted-foreground hover:text-white transition"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-muted-foreground hover:text-white transition"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/verification"
                  className="text-muted-foreground hover:text-white transition"
                >
                  Verification Process
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <Separator className="my-8 bg-gray-800" />
        <div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2024 LPX Collect. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-white transition"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-white transition"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-muted-foreground hover:text-white transition"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
