import { PaymentCards } from "@/lib/types";
import {
  useAddBankCardMutation,
  useRemoveBankCardMutation,
} from "@/redux/features/vendors/paymentRequest";
import { XIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function PaymentMethods({ payMathods }: { payMathods: PaymentCards[] }) {
  console.log(payMathods, "paymentods");
  const [deletePayMethods] = useRemoveBankCardMutation();
  const [addNewPayMethods] = useAddBankCardMutation();

  const handleAddNewCard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = {
      accountType: formData.get("accountType") as string,
      bankName: formData.get("bankName") as string,
      accountNumber: formData.get("accountNumber") as string,
      phoneNumber: formData.get("phoneNumber") as string,
    };

    try {
      await addNewPayMethods(data);

      // Close the form section
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {payMathods.map((method) => (
          <div
            key={method._id}
            className="relative p-6 rounded-xl text-white shadow-lg transition-all duration-300 hover:shadow-xl"
            style={{ backgroundColor: "#2D3748" }}
          >
            {/* Delete Button */}
            <button
              onClick={() => handleDeleteCard(method._id)}
              className="absolute top-3 right-3 p-1 "
              title="Delete card"
            >
              <XIcon />
            </button>

            {/* Card Content */}
            <div className="space-y-3">
              {/* Account Type */}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-blue-300">
                  {method.accountType}
                </h3>
              </div>

              {/* Bank Name */}
              <div>
                <p className="text-sm text-gray-400">Bank Name</p>
                <p className="font-semibold">{method.bankName}</p>
              </div>

              {/* Account Number */}
              <div>
                <p className="text-sm text-gray-400">Account Number</p>
                <p className="font-mono font-semibold tracking-wide">
                  {method.accountNumber}
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <p className="text-sm text-gray-400">Phone Number</p>
                <p className="font-semibold">{method.phoneNumber}</p>
              </div>

              {/* Created Date */}
              <div className="pt-2 border-t border-gray-600">
                <p className="text-xs text-gray-400">
                  Added: {new Date(method.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card Button - Only show if less than 3 cards */}
        {payMathods.length < 3 && (
          <div
            className="flex flex-col items-center justify-center p-6 rounded-xl text-white cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl min-h-[200px]"
            style={{ backgroundColor: "#2D3748" }}
            onClick={showAddCardForm}
          >
            <div className="text-4xl mb-3 text-blue-400">+</div>
            <p className="text-lg font-semibold">Add New Card</p>
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
                htmlFor="accountType"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Account Type
              </label>
              <select
                id="accountType"
                name="accountType"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Account Type</option>
                <option value="Savings">Savings Account</option>
                <option value="Current">Current Account</option>
                <option value="Checking">Checking</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="bankName"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter bank name"
              />
            </div>

            <div>
              <label
                htmlFor="accountNumber"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter account number"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />
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

// import { PaymentCards } from "@/lib/types";
// import React from "react";

// function PaymentMethods({ payMathods }: { payMathods: PaymentCards[] }) {
//   console.log(payMathods, "paymentods");

//   const handleAddNewCard = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const formData = new FormData(event.currentTarget);
//     const data = {
//       accountType: formData.get("accountType") as string,
//       bankName: formData.get("bankName") as string,
//       accountNumber: formData.get("accountNumber") as string,
//       phoneNumber: formData.get("phoneNumber") as string,
//     };

//     console.log("New card data:", data);

//     // Close the form section
//     const formSection = document.getElementById("add-card-form");
//     if (formSection) {
//       formSection.style.display = "none";
//     }

//     // Reset the form
//     event.currentTarget.reset();
//   };

//   const showAddCardForm = () => {
//     const formSection = document.getElementById("add-card-form");
//     if (formSection) {
//       formSection.style.display = "block";
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>

//       <div className="grid gap-4 mb-6">
//         {payMathods.map((method) => (
//           <div
//             key={method._id}
//             className="p-4 rounded-lg text-white"
//             style={{ backgroundColor: "#252D3D" }}
//           >
//             <div className="flex justify-between items-start">
//               <div>
//                 <h3 className="font-semibold text-lg">{method.accountType}</h3>
//                 <p className="text-gray-300">Bank: {method.bankName}</p>
//                 <p className="text-gray-300">Account: {method.accountNumber}</p>
//                 <p className="text-gray-300">Phone: {method.phoneNumber}</p>
//               </div>
//               <span className="text-sm text-gray-400">
//                 {new Date(method.createdAt).toLocaleDateString()}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {payMathods.length === 0 && (
//         <div
//           className="p-8 rounded-lg text-center text-white mb-6"
//           style={{ backgroundColor: "#252D3D" }}
//         >
//           <p className="mb-4">No payment methods added yet</p>
//           {payMathods.length < 3 && (
//             <button
//               onClick={showAddCardForm}
//               className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
//             >
//               Add New Card
//             </button>
//           )}
//         </div>
//       )}

//       {payMathods.length > 0 && payMathods.length < 3 && (
//         <div
//           className="p-6 rounded-lg text-center text-white mb-6 cursor-pointer hover:opacity-90 transition-opacity"
//           style={{ backgroundColor: "#252D3D" }}
//           onClick={showAddCardForm}
//         >
//           <div className="text-2xl mb-2">+</div>
//           <p>Add New Card</p>
//         </div>
//       )}

//       <div id="add-card-form" style={{ display: "none" }} className="mb-6">
//         <form
//           onSubmit={handleAddNewCard}
//           className="space-y-4 p-6 rounded-lg"
//           style={{ backgroundColor: "#252D3D" }}
//         >
//           <h3 className="text-xl font-semibold text-white mb-4">
//             Add New Payment Method
//           </h3>

//           <div>
//             <label
//               htmlFor="accountType"
//               className="block text-sm font-medium text-gray-300 mb-1"
//             >
//               Account Type
//             </label>
//             <input
//               type="text"
//               id="accountType"
//               name="accountType"
//               required
//               className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="e.g., Savings, Current"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="bankName"
//               className="block text-sm font-medium text-gray-300 mb-1"
//             >
//               Bank Name
//             </label>
//             <input
//               type="text"
//               id="bankName"
//               name="bankName"
//               required
//               className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter bank name"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="accountNumber"
//               className="block text-sm font-medium text-gray-300 mb-1"
//             >
//               Account Number
//             </label>
//             <input
//               type="text"
//               id="accountNumber"
//               name="accountNumber"
//               required
//               className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter account number"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="phoneNumber"
//               className="block text-sm font-medium text-gray-300 mb-1"
//             >
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               id="phoneNumber"
//               name="phoneNumber"
//               required
//               className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter phone number"
//             />
//           </div>

//           <div className="flex gap-3 pt-2">
//             <button
//               type="submit"
//               className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
//             >
//               Add Card
//             </button>
//             <button
//               type="button"
//               onClick={() => {
//                 const formSection = document.getElementById("add-card-form");
//                 if (formSection) {
//                   formSection.style.display = "none";
//                 }
//               }}
//               className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default PaymentMethods;
