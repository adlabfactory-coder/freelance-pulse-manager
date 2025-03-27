
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
    case QuoteStatus.ACCEPTED:
      return "Accepté";
    case QuoteStatus.REJECTED:
      return "Rejeté";
    case QuoteStatus.EXPIRED:
      return "Expiré";
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
    case QuoteStatus.ACCEPTED:
      return "success";
    case QuoteStatus.REJECTED:
      return "destructive";
    case QuoteStatus.EXPIRED:
      return "destructive";
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
