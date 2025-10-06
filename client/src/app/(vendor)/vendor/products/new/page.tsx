"use client";
import PageLayout from "@/components/layout/PageLayout";
import AddNewProductForm from "@/components/Vendors/AddnewProduct/AddNewProductForm";

export default function NewProductPage() {
  return (
    // <ProtectedRoute>
    <PageLayout
      title="Add New Product"
      description="Create a new product listing for your store"
      breadcrumbs={[
        { label: "Dashboard", href: "/vendor/dashboard" },
        { label: "Products", href: "/vendor/dashboard" },
        { label: "New Product" },
      ]}
    >
      <AddNewProductForm />
    </PageLayout>
    // </ProtectedRoute>
  );
}
