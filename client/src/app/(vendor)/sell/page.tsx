"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import PageLayout from "@/components/layout/PageLayout";

import { Card, CardContent } from "@/components/UI/card";
import ProtectedRoute from "@/Provider/ProtectedRoutes";
import RequestVendorForm from "@/components/Vendors/RequestForVendor/RequestVendorForm";

export default function BecomeVendorPage() {
  return (
    <ProtectedRoute allowedTypes={["customer", "admin"]}>
      <PageLayout
        title="Vendor Application"
        description="Complete this form to apply for a vendor account. We'll review your application within 24-48 hours."
        breadcrumbs={[{ label: "Become a Seller" }]}
      >
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <RequestVendorForm />
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
