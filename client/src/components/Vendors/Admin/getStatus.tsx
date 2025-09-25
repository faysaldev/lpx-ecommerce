import { Badge } from "@/components/UI/badge";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

export const getStatusBadge = (status: string) => {
  const variants: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    verified: "default",
    pending: "secondary",
    suspended: "destructive",
  };

  const colors: Record<string, string> = {
    verified: "text-green-600",
    pending: "text-yellow-600",
    suspended: "text-red-600",
  };

  return (
    <Badge variant={variants[status] || "outline"} className={colors[status]}>
      {status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
      {status === "pending" && <AlertCircle className="h-3 w-3 mr-1" />}
      {status === "suspended" && <XCircle className="h-3 w-3 mr-1" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
