
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { QuoteStatus, getQuoteStatusLabel, getQuoteStatusColor } from '@/types/quote';

interface QuoteStatusBadgeProps {
  status: QuoteStatus;
}

const QuoteStatusBadge: React.FC<QuoteStatusBadgeProps> = ({ status }) => {
  const getVariant = () => {
    switch (status) {
      case QuoteStatus.ACCEPTED:
        return "success";
      case QuoteStatus.REJECTED:
      case QuoteStatus.CANCELLED:
        return "destructive";
      case QuoteStatus.SENT:
        return "default";
      case QuoteStatus.EXPIRED:
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <Badge variant={getVariant()} className="capitalize">
      {getQuoteStatusLabel(status)}
    </Badge>
  );
};

export default QuoteStatusBadge;
