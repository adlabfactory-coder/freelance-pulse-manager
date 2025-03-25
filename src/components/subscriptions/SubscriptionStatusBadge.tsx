
import React from "react";
import { SubscriptionStatus } from "@/types";

interface SubscriptionStatusBadgeProps {
  status: SubscriptionStatus;
}

const SubscriptionStatusBadge: React.FC<SubscriptionStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case SubscriptionStatus.ACTIVE:
      return (
        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
          Actif
        </span>
      );
    case SubscriptionStatus.CANCELED:
      return (
        <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
          Annulé
        </span>
      );
    case SubscriptionStatus.EXPIRED:
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-700/10">
          Expiré
        </span>
      );
    case SubscriptionStatus.PENDING:
      return (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          En attente
        </span>
      );
    case SubscriptionStatus.TRIAL:
      return (
        <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
          Essai
        </span>
      );
    default:
      return null;
  }
};

export default SubscriptionStatusBadge;
