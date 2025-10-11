import { toast } from "sonner";

export const downloadInvoiceHealper = async ({
  token,
  orderId,
}: {
  token: string;
  orderId: string;
}) => {
  if (!token) {
    toast.error("No authorization token found.");
    return;
  }

  try {
    // Fetch request with the Authorization token in headers
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/orders/invoice/${orderId}`,
      {
        method: "GET", // Ensure GET method
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      }
    );

    if (!res.ok) {
      // Handle error in case the response is not OK
      toast.error("Failed to download the invoice.");
      return;
    }

    const blob = await res.blob(); // Get the response as a Blob (Binary Large Object)
    const link = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = `invoice-${orderId}.pdf`; // Set the filename dynamically
    link.click(); // Trigger the download
    window.URL.revokeObjectURL(url); // Clean up after download

    toast.success("Invoice downloaded successfully!");
  } catch (error) {
    console.error("Error downloading invoice:", error);
    toast.error("An error occurred while downloading the invoice.");
  }
};
