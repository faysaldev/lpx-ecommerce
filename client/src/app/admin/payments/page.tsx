"use client";
import { CheckCircle, Clock, CreditCard, DollarSign } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/UI/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/UI/tabs";
import PaymentApprovalDialog from "@/components/Payments/PaymentApprovalDialog";
import type { PaymentRequest } from "@/lib/payment-request";
import AdminPaymentAnalytics from "@/components/Admin/Payments/AdminPaymentAnalytics";
import PaymentVendorAnalysis from "@/components/Admin/Payments/PaymentVendorAnalysis";
import AdminPaymentRequest from "@/components/Admin/Payments/AdminPaymentRequest";
import AdminPaymentLoader from "@/components/Admin/Payments/AdminPaymentLoader";
import { useAdminPaymentStatsQuery } from "@/redux/features/admin/adminPaymentrequest";

export default function AdminPaymentManagementPage() {
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(
    null
  );
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

  const { data: paymentManageMentStats, isLoading } = useAdminPaymentStatsQuery(
    {}
  );

  const handleViewRequest = (request: PaymentRequest) => {
    setSelectedRequest(request);
    setShowApprovalDialog(true);
  };

  const handleApprovalUpdate = () => {
    setShowApprovalDialog(false);
    setSelectedRequest(null);
  };

  // Dynamically set stats from the paymentManageMentStats data
  const dashboardStats = paymentManageMentStats?.data
    ? [
        {
          title: "Total Requests",
          value: paymentManageMentStats.data.attributes.totalRequests,
          icon: CreditCard,
          color: "text-blue-600",
        },
        {
          title: "Pending Requests",
          value: paymentManageMentStats.data.attributes.pendingRequests,
          icon: Clock,
          color: "text-yellow-600",
        },
        {
          title: "Approved Requests",
          value: paymentManageMentStats.data.attributes.approvedRequests,
          icon: CheckCircle,
          color: "text-green-600",
        },
        {
          title: "Total Amount",
          value: paymentManageMentStats.data.attributes.totalAmount,
          icon: DollarSign,
          color: "text-purple-600",
        },
      ]
    : []; // In case the data is not yet available, default to an empty array

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
        {/* <Button variant="outline" onClick={handleExportData}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, _index) => (
          <Card key={_index}>
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
        <PaymentVendorAnalysis />

        <AdminPaymentAnalytics />
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
