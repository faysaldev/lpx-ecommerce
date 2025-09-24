"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/UI/card";
import { Checkbox } from "@/components/UI/checkbox";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { Textarea } from "@/components/UI/textarea";

export default function BecomeVendorPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(
      "Application submitted successfully! We'll review it within 24-48 hours."
    );
    router.push("/");
    setIsSubmitting(false);
  };

  return (
    <PageLayout
      title="Vendor Application"
      description="Complete this form to apply for a vendor account. We'll review your application within 24-48 hours."
      breadcrumbs={[{ label: "Become a Seller" }]}
    >
      <Card>
        <CardContent>
          <form onSubmit={handleApplicationSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" required className="mt-1" />
              </div>
            </div>

            <div>
              <Label htmlFor="storeName">Store Name *</Label>
              <Input
                id="storeName"
                placeholder="Your store name"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" required className="mt-1" />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="category">Primary Category *</Label>
              <Select required>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trading-cards">Trading Cards</SelectItem>
                  <SelectItem value="comics">Comics</SelectItem>
                  <SelectItem value="coins">Coins</SelectItem>
                  <SelectItem value="stamps">Stamps</SelectItem>
                  <SelectItem value="toys">Vintage Toys</SelectItem>
                  <SelectItem value="sports">Sports Memorabilia</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="website">Website / Social Media</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Tell us about your business *</Label>
              <Textarea
                id="description"
                placeholder="What types of items do you plan to sell? How long have you been in business?"
                className="min-h-[120px] mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="experience">
                Experience selling collectibles
              </Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New to selling</SelectItem>
                  <SelectItem value="1-2">1-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5+">5+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the terms and conditions and the 3% transaction fee
              </label>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
