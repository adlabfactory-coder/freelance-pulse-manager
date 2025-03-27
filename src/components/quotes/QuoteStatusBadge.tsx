
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { QuoteStatus, getQuoteStatusLabel } from '@/types/quote';

interface QuoteStatusBadgeProps {
  status: QuoteStatus | string;
}

const QuoteStatusBadge: React.FC<QuoteStatusBadgeProps> = ({ status }) => {
  // Conversion de variant vers Type pour Badge
  const getVariant = (): "default" | "destructive" | "outline" | "secondary" | "success" | "warning" | null | undefined => {
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
      case QuoteStatus.DRAFT:
        return "outline";
      case QuoteStatus.PENDING:
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <Badge variant={getVariant()} className="capitalize">
      {getQuoteStatusLabel(status as QuoteStatus)}
    </Badge>
  );
};

export default QuoteStatusBadge;
