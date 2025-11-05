import { PaymentCards } from "@/lib/types";
import {
  useAddBankCardMutation,
  useRemoveBankCardMutation,
} from "@/redux/features/vendors/paymentRequest";
import { XIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function PaymentMethods({ payMathods }: { payMathods: PaymentCards[] }) {
  const [deletePayMethods] = useRemoveBankCardMutation();
  const [addNewPayMethods] = useAddBankCardMutation();

  const handleAddNewCard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = {
      Currency: formData.get("Currency") as string,
      bankName: formData.get("bankName") as string,
      IBAN: formData.get("IBAN") as string,
      SWIFT: formData.get("SWIFT") as string,
    };

    try {
      const res = await addNewPayMethods(data);
      const formSection = document.getElementById("add-card-form");
      if (formSection) {
        formSection.style.display = "none";
      }
    } catch (error) {
      toast.error("Error To set Cards");
    }

    // Reset the form
    event.currentTarget.reset();
  };

  const showAddCardForm = () => {
    const formSection = document.getElementById("add-card-form");
    if (formSection) {
      formSection.style.display = "block";
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await deletePayMethods(cardId);
    } catch (error) {
      toast.error("Error to delete Cards");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {payMathods?.map((method) => (
          <div
            key={method._id}
            className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-slate-700/50"
          >
            {/* Delete Button */}
            {payMathods.length > 1 && (
              <button
                onClick={() => handleDeleteCard(method._id)}
                className="absolute top-1 right-4 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200"
                title="Delete card"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}

            {/* Card Content */}
            <div className="space-y-4">
              {/* Account Type Header */}
              {/* <div className="mb-4">
                <h3 className="font-bold text-xl text-blue-400 mb-1">
                  {method.accountType}
                </h3>
                <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              </div> */}

              {/* Bank Name */}
              <div className="flex  justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400 text-sm">Bank Name</span>
                <span className="text-base">{method.bankName}</span>
              </div>

              {/* Currency */}
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400 text-sm">Currency</span>
                <span className="font-mono text-base tracking-wide">
                  {method.Currency}
                </span>
              </div>

              {/* SWIFT */}
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400 text-sm">SWIFT</span>
                <span className="font-mono text-sm tracking-wider">
                  {method.SWIFT}
                </span>
              </div>

              {/* IBAN */}
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400 text-sm">IBAN</span>
                <span className="font-mono text-xs tracking-wider break-all">
                  {method.IBAN}
                </span>
              </div>

              {/* Phone Number */}
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400 text-sm">Phone Number</span>
                <span className="text-base">{method.phoneNumber}</span>
              </div>

              {/* Created Date */}
              <div className="pt-3 mt-2">
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Added {new Date(method.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card Button - Only show if less than 3 cards */}
        {payMathods?.length < 3 && (
          <div
            className="flex flex-col items-center justify-center p-6 rounded-xl text-white cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl min-h-[200px]"
            style={{ backgroundColor: "#2D3748" }}
            onClick={showAddCardForm}
          >
            <div className="text-4xl mb-3 text-blue-400">+</div>
            <p className="text-lg font-semibold">Add Bank Account</p>
            <p className="text-sm text-gray-400 mt-2 text-center">
              Add a new payment method to your account
            </p>
          </div>
        )}
      </div>

      {/* Add Card Form */}
      <div id="add-card-form" style={{ display: "none" }} className="mb-6">
        <form
          onSubmit={handleAddNewCard}
          className="max-w-2xl mx-auto p-8 rounded-xl shadow-lg"
          style={{ backgroundColor: "#2D3748" }}
        >
          <h3 className="text-2xl font-semibold text-white mb-6 text-center">
            Add New Payment Method
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label
                htmlFor="bankName"
                className="block text-sm  text-gray-300 mb-2"
              >
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white "
                placeholder="Enter bank name"
              />
            </div>
            <div>
              <label
                htmlFor="IBAN"
                className="block text-sm  text-gray-300 mb-2"
              >
                IBAN
              </label>
              <input
                type="text"
                id="IBAN"
                name="IBAN"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white "
                placeholder="e.g., GB29XABC10161234567801"
              />
            </div>
            <div>
              <label
                htmlFor="SWIFT"
                className="block text-sm  text-gray-300 mb-2"
              >
                SWIFT/BIC Code
              </label>
              <input
                type="text"
                id="SWIFT"
                name="SWIFT"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white"
                placeholder="e.g., ABCDGB2L"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="Currency"
                className="block text-sm  text-gray-300 mb-2"
              >
                Currency
              </label>
              <select
                id="Currency"
                name="Currency"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white "
              >
                <option value="">Select Currency</option>
                <option value="USD">USD - US </option>
                <option value="AED">AED - UAE</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-6 justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
            >
              Add Card
            </button>
            <button
              type="button"
              onClick={() => {
                const formSection = document.getElementById("add-card-form");
                if (formSection) {
                  formSection.style.display = "none";
                }
              }}
              className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentMethods;
