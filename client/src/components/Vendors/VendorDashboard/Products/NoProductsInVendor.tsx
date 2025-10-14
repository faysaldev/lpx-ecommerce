import { Button } from "@/components/UI/button";
import { Package, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

function NoProductsInVendor() {
  return (
    <div className="text-center py-12">
      <div className="mx-auto bg-muted rounded-full flex items-center justify-center mb-6 w-24 h-24">
        <Package className="text-muted-foreground h-12 w-12" />
      </div>
      <h3 className="font-semibold mb-2 text-xl">No products found</h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        You haven&apos;t created any products yet. Start by adding your first
        product to your store.
      </p>
      <Button asChild>
        <Link href="/vendor/products/new">
          <Plus className="mr-2 h-4 w-4" />
          Create Your First Product
        </Link>
      </Button>
    </div>
  );
}

export default NoProductsInVendor;
