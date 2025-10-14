/* eslint-disable @typescript-eslint/no-explicit-any */
import { Package, Star, Shield } from "lucide-react"; // Importing Lucide icons

const ConditionBadgeComponent = ({ condition }: { condition: any }) => {
  const getConditionUI = () => {
    switch (condition) {
      case "CGC Graded":
      case "PSA Graded":
      case "BGS Graded":
        return (
          <div className="flex gap-1 h-7 items-center my-2">
            <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs flex items-center">
              <Star className="h-3 w-3 mr-1" />
              {condition}
            </div>
          </div>
        );
      case "Mint":
      case "Near Mint":
      case "Excellent":
      case "Very Good":
      case "Good":
      case "Fair":
      case "Poor":
        return (
          <div className="flex gap-1 h-7 items-center my-2">
            <div className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              {condition}
            </div>
          </div>
        );
      case "Sealed":
        return (
          <div className="flex gap-1 h-7 items-center my-2">
            <div className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs flex items-center">
              <Package className="h-3 w-3 mr-1" />
              Sealed
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return getConditionUI();
};

export default ConditionBadgeComponent;
