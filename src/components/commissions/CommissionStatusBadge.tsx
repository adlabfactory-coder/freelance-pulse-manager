
import React from "react";

interface CommissionStatusBadgeProps {
  status: string;
  paymentRequested?: boolean;
}

const CommissionStatusBadge: React.FC<CommissionStatusBadgeProps> = ({ 
  status, 
  paymentRequested = false 
}) => {
  switch (status) {
    case "paid":
      return (
        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
          Payé
        </span>
      );
    case "pending":
      if (paymentRequested) {
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Demande envoyée
          </span>
        );
      }
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-700/10">
          En attente
        </span>
      );
    default:
      return null;
  }
};

export default CommissionStatusBadge;
