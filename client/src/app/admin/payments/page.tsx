"use client";
import {
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/UI/tabs";
import PaymentApprovalDialog from "@/components/Payments/PaymentApprovalDialog";
import type {
  PaymentRequest,
  PaymentRequestStats,
  VendorPaymentSummary,
} from "@/lib/payment-request";
import { formatCurrency } from "@/lib/utils/helpers";
import AdminPaymentAnalytics from "@/components/Admin/Payments/AdminPaymentAnalytics";
import PaymentVendorAnalysis from "@/components/Admin/Payments/PaymentVendorAnalysis";
import AdminPaymentRequest from "@/components/Admin/Payments/AdminPaymentRequest";
import AdminPaymentLoader from "@/components/Admin/Payments/AdminPaymentLoader";

export default function AdminPaymentManagementPage() {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [vendorSummaries, setVendorSummaries] = useState<
    VendorPaymentSummary[]
  >([]);
  const [stats, setStats] = useState<PaymentRequestStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(
    null
  );
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

  const handleViewRequest = (request: PaymentRequest) => {
    setSelectedRequest(request);
    setShowApprovalDialog(true);
  };

  const handleApprovalUpdate = () => {
    setShowApprovalDialog(false);
    setSelectedRequest(null);
  };

  const handleExportData = () => {
    toast.info("Export functionality", {
      description: "Export feature would be implemented here",
    });
  };

  const dashboardStats = stats
    ? [
        {
          title: "Total Requests",
          value: stats.totalRequests,
          icon: CreditCard,
          color: "text-blue-600",
        },
        {
          title: "Pending Review",
          value: stats.pendingRequests,
          icon: Clock,
          color: "text-yellow-600",
        },
        {
          title: "Approved",
          value: stats.approvedRequests,
          icon: CheckCircle,
          color: "text-green-600",
        },
        {
          title: "Total Amount",
          value: formatCurrency(stats.totalAmount),
          icon: DollarSign,
          color: "text-purple-600",
        },
      ]
    : [];

  if (isLoading) {
    return <AdminPaymentLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Payment Management
          </h1>
          <p className="text-muted-foreground">
            Manage vendor payment requests and process payments
          </p>
        </div>
        <Button variant="outline" onClick={handleExportData}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, _index) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">Payment Requests</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Summaries</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <AdminPaymentRequest handleViewRequest={handleViewRequest} />

        {/* vendor request analysis */}
        <PaymentVendorAnalysis vendorSummaries={vendorSummaries} />

        <AdminPaymentAnalytics
          paymentRequests={paymentRequests}
          stats={stats}
        />
      </Tabs>

      {/* Payment Approval Dialog */}
      <PaymentApprovalDialog
        paymentRequest={selectedRequest}
        isOpen={showApprovalDialog}
        onClose={() => {
          setShowApprovalDialog(false);
          setSelectedRequest(null);
        }}
        onUpdate={handleApprovalUpdate}
      />
    </div>
  );
}
