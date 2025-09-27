"use client";

import {
  ArrowRight,
  Award,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  Lock,
  Package,
  Search,
  Shield,
  Sparkles,
  Store,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SimplePageLayout } from "@/components/layout/PageLayout";
import ProductCard from "@/components/shared/ProductCard";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import { Product } from "@/lib/types";
import { QuickView } from "@/components/Browse/QuickView";
// import { useCart } from "@/context/CartContext";
// import { useWishlist } from "@/context/WishlistContext";
// import { QuickView } from "@/features/browse/components/QuickView";
// import { getProductAPI } from "@/lib/api/client";
// import { toDomainProduct } from "@/lib/api/product-adapters";
// import type { Product } from "@/lib/api/types";

export default function Home() {
  // const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        // const api = getProductAPI();
        // const response = await api.getFeaturedProducts(12);
        // if (response.success) {
        //   setFeaturedProducts(response.data);
        // }
      } catch (error) {
        if (process.env.NODE_ENV !== "production")
          console.error("Failed to fetch featured products:", error);
      }
    }
    fetchFeaturedProducts();
  }, []);
  // const { addToWishlist } = useWishlist();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  const handleAddToCart = (product: Product) => {
    // const domainProduct = toDomainProduct(product);
    // addToCart(domainProduct, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleAddToWishlist = (product: Product) => {
    // const domainProduct = toDomainProduct(product);
    // addToWishlist(domainProduct);
    toast.success(`${product.name} added to wishlist`);
  };

  const handleBuyNow = (product: Product) => {
    // TODO: Implement buy now functionality
    if (process.env.NODE_ENV !== "production")
      console.log("Buy now clicked for:", product.id);
  };

  const handleShare = (product: Product) => {
    // TODO: Implement share functionality
    if (process.env.NODE_ENV !== "production")
      console.log("Share clicked for:", product.id);
  };

  return (
    <SimplePageLayout
      className="h-screen"
      containerClassName="p-0"
      fullWidth={true}
    >
      <div className="flex-1 overflow-y-auto">
        <main>
          {/* Hero Section with Carousel */}
          <section className="relative bg-gradient-to-br from-background via-muted/20 to-background">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="max-w-7xl mx-auto px-6 relative py-16">
              {/* Hero Content */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-sm mb-6">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium">
                    Trusted by 50,000+ collectors worldwide
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight mb-6">
                  Discover Rare &
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                    {" "}
                    Authentic
                  </span>
                  <br />
                  Collectibles
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
                  The premier marketplace for serious collectors. Find verified
                  treasures, connect with trusted vendors, and build your dream
                  collection.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12"
                  >
                    <Link href="/browse">
                      <Search className="mr-2 h-5 w-5" />
                      Start Exploring
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-2 font-semibold px-8 h-12 hover:bg-accent"
                  >
                    <Link href="/vendors">
                      <Store className="mr-2 h-5 w-5" />
                      View Vendors
                    </Link>
                  </Button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t">
                  <div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      50K+
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Active Collectors
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      100K+
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Verified Items
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      99.9%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Satisfaction
                    </p>
                  </div>
                </div>
              </div>

              {/* Featured Products Carousel */}
              <div className="mt-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">
                    Featured Collectibles
                  </h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/browse">
                      View All
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-6 pb-4">
                      {featuredProducts.map((product, index) => (
                        <div
                          key={product.id || `product-${index}`}
                          className="w-[320px] min-w-[320px] max-w-[320px] flex-shrink-0"
                        >
                          <ProductCard
                            product={product}
                            viewMode="grid"
                            onQuickView={setQuickViewProduct}
                            onAddToCart={handleAddToCart}
                            onAddToWishlist={handleAddToWishlist}
                            onBuyNow={handleBuyNow}
                            onShare={handleShare}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scroll Indicators */}
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 hidden lg:block">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full bg-background/80 backdrop-blur-sm shadow-lg"
                      onClick={() => {
                        const container =
                          document.querySelector(".overflow-x-auto");
                        if (container) {
                          container.scrollBy({
                            left: -320,
                            behavior: "smooth",
                          });
                        }
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden lg:block">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full bg-background/80 backdrop-blur-sm shadow-lg"
                      onClick={() => {
                        const container =
                          document.querySelector(".overflow-x-auto");
                        if (container) {
                          container.scrollBy({ left: 320, behavior: "smooth" });
                        }
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Features - Modern Card Design */}
          <section className="py-20 bg-muted/30">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="group hover:shadow-lg transition-all duration-300 border-muted">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Shield className="h-6 w-6 text-green-500" />
                    </div>
                    <h3 className="font-semibold mb-2">100% Authenticated</h3>
                    <p className="text-sm text-muted-foreground">
                      Every item verified by certified experts before listing
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 border-muted">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Lock className="h-6 w-6 text-blue-500" />
                    </div>
                    <h3 className="font-semibold mb-2">Secure Payments</h3>
                    <p className="text-sm text-muted-foreground">
                      Protected transactions with buyer guarantee
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 border-muted">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Truck className="h-6 w-6 text-purple-500" />
                    </div>
                    <h3 className="font-semibold mb-2">Global Shipping</h3>
                    <p className="text-sm text-muted-foreground">
                      Insured worldwide delivery with real-time tracking
                    </p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 border-muted">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Award className="h-6 w-6 text-yellow-500" />
                    </div>
                    <h3 className="font-semibold mb-2">Premium Vendors</h3>
                    <p className="text-sm text-muted-foreground">
                      Hand-picked sellers with proven track records
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section - Modern Gradient */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
            <div className="max-w-7xl mx-auto px-6 relative text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-sm mb-6">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">
                  Join 50,000+ collectors worldwide
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Start Your Collection Journey Today
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Connect with passionate collectors, discover rare treasures, and
                build your dream collection with confidence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12"
                >
                  <Link href="/register">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 font-semibold px-8 h-12"
                >
                  <Link href="/how-it-works">Learn How It Works</Link>
                </Button>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Free to join</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>No listing fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Secure payments</span>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section - Modern Design */}
          <section className="py-20 bg-muted/30">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  Trusted by Collectors Worldwide
                </h2>
                <p className="text-muted-foreground">
                  Our platform{`'`}s impact in numbers
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <Card className="text-center p-6 hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                      $5M+
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Monthly Volume
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Package className="h-6 w-6 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                      100K+
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Listed Items
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                      50K+
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Active Users
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Award className="h-6 w-6 text-yellow-500" />
                    </div>
                    <p className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
                      99.9%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Satisfaction
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
      />
    </SimplePageLayout>
  );
}
