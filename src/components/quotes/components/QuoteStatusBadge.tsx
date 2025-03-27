
import React from "react";
import { Badge } from "@/components/ui/badge";
import { QuoteStatus } from "@/types/quote";

interface QuoteStatusBadgeProps {
  status: QuoteStatus;
}

export const getStatusLabel = (status: QuoteStatus) => {
  switch (status) {
    case QuoteStatus.DRAFT:
      return "Brouillon";
    case QuoteStatus.PENDING:
      return "En attente";
    case QuoteStatus.SENT:
      return "Envoyé";
    case QuoteStatus.ACCEPTED:
      return "Accepté";
    case QuoteStatus.REJECTED:
      return "Rejeté";
    case QuoteStatus.EXPIRED:
      return "Expiré";
    case QuoteStatus.PAID:
      return "Payé";
    case QuoteStatus.CANCELLED:
      return "Annulé";
    default:
      return status;
  }
};

export const getStatusVariant = (status: QuoteStatus) => {
  switch (status) {
    case QuoteStatus.DRAFT:
      return "outline";
    case QuoteStatus.PENDING:
      return "secondary";
    case QuoteStatus.SENT:
      return "default";
    case QuoteStatus.ACCEPTED:
      return "success";
    case QuoteStatus.REJECTED:
      return "destructive";
    case QuoteStatus.EXPIRED:
      return "destructive";
    case QuoteStatus.PAID:
      return "success";
    case QuoteStatus.CANCELLED:
      return "outline";
    default:
      return "default";
  }
};

const QuoteStatusBadge: React.FC<QuoteStatusBadgeProps> = ({ status }) => {
  return (
    <Badge variant={getStatusVariant(status)}>
      {getStatusLabel(status)}
    </Badge>
  );
};

export default QuoteStatusBadge;
