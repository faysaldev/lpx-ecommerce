"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/UI/button";
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
import { useVendorCreateMutation } from "@/redux/features/vendors/vendor";

export default function BecomeVendorPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vendorCreationApplication] = useVendorCreateMutation();

  const handleApplicationSubmit = async (e: any) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setIsSubmitting(true); // Set submission state to true

    const form = e.target; // Get the form element

    // Get form values
    const firstName = form.firstUserName.value;
    const lastName = form.lastName.value;
    const storeName = form.storeName.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const category = form.category.value;
    const website = form.website.value;
    const description = form.description.value;
    const experience = form.experience.value;
    const terms = form.terms.checked;

    const data = {
      firstName,
      lastName,
      storeName,
      email,
      phone,
      category,
      website,
      description,
      experience,
      terms,
    };

    console.log("all form data show ", data);

    // You can now call the mutation to create a vendor or process the data
    try {
      const res = await vendorCreationApplication(data);

      toast.success(
        "Application submitted successfully! We'll review it within 24-48 hours."
      );
      router.push("/"); // Redirect after submission
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }

    setIsSubmitting(false); // Reset submission state
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
                <Input
                  name="firstUserName"
                  id="firstName"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  name="lastName"
                  id="lastName"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="storeName">Store Name *</Label>
              <Input
                name="storeName"
                id="storeName"
                placeholder="Your store name"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                name="email"
                id="email"
                type="email"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input name="phone" id="phone" type="tel" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="category">Primary Category *</Label>
              <Select name="category" required>
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
                name="website"
                id="website"
                type="url"
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Tell us about your business *</Label>
              <Textarea
                name="description"
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
              <Select name="experience">
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
              <Checkbox name="terms" id="terms" required />
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
