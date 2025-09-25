/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Calendar,
  CheckCircle,
  MapPin,
  Package,
  Star,
  XCircle,
} from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../UI/button";
import { Avatar, AvatarFallback, AvatarImage } from "../UI/avatar";
import { Label } from "../UI/label";
import { Textarea } from "../UI/textarea";

function VendorReviewDialog({
  setIsReviewDialogOpen,
  isReviewDialogOpen,
  reviewAction,
  selectedVendor,
  setReviewNotes,
  reviewNotes,
  handleReviewSubmit,
  formatDate,
}: any) {
  return (
    <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {reviewAction === "approve" ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            {reviewAction === "approve"
              ? "Approve Vendor"
              : "Reject Application"}
          </DialogTitle>
          <DialogDescription>
            {reviewAction === "approve"
              ? `You are about to approve ${selectedVendor?.storeName}'s vendor application. This will allow them to start selling on the platform.`
              : `You are about to reject ${selectedVendor?.storeName}'s vendor application. Please provide a reason for the rejection.`}
          </DialogDescription>
        </DialogHeader>

        {selectedVendor && (
          <div className="grid gap-4 py-4">
            {/* Vendor Info */}
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedVendor.storeName} />
                  <AvatarFallback>{selectedVendor.storeName}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedVendor.storeName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Owner: {selectedVendor.ownerName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedVendor.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {/* {selectedVendor.location.city},{" "} */}
                    {/* {selectedVendor.location.country} */}
                    Dhaka Chottogram
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Applied {formatDate(selectedVendor.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {/* {selectedVendor.products}  */}
                    345 products ready
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedVendor.ratings} rating</span>
                </div>
              </div>
            </div>

            {/* Review Notes */}
            <div className="grid gap-2">
              <Label htmlFor="review-notes">
                {reviewAction === "approve"
                  ? "Approval Notes (Optional)"
                  : "Rejection Reason"}
                {reviewAction === "reject" && (
                  <span className="text-red-500"> *</span>
                )}
              </Label>
              <Textarea
                id="review-notes"
                placeholder={
                  reviewAction === "approve"
                    ? "Add any notes for the vendor or internal records..."
                    : "Please explain why this application is being rejected..."
                }
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {reviewAction === "approve" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-green-800">
                      Approval Effects
                    </p>
                    <ul className="mt-1 text-green-700 list-disc list-inside space-y-1">
                      <li>Vendor can start listing products</li>
                      <li>Profile becomes visible to customers</li>
                      <li>Can receive and process orders</li>
                      <li>Gets access to vendor dashboard</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {reviewAction === "reject" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-red-800">
                      Rejection Effects
                    </p>
                    <ul className="mt-1 text-red-700 list-disc list-inside space-y-1">
                      <li>Application will be marked as rejected</li>
                      <li>Vendor will be notified via email</li>
                      <li>They can reapply after addressing issues</li>
                      <li>Account remains inactive</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsReviewDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReviewSubmit}
            disabled={reviewAction === "reject" && !reviewNotes.trim()}
            className={
              reviewAction === "approve"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }
          >
            {reviewAction === "approve"
              ? "Approve Vendor"
              : "Reject Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default VendorReviewDialog;
