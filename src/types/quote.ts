
export enum QuoteStatus {
  DRAFT = "draft",
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
  SENT = "sent"
}

export interface Quote {
  id: string;
  contactId: string;
  freelancerId: string;
  totalAmount: number;
  validUntil: Date | string;
  status: QuoteStatus;
  notes?: string | null;
  folder: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  items?: QuoteItem[];
}

export interface QuoteItem {
  id: string;
  quoteId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax?: number;
  discount?: number;
  serviceId?: string;
}

export const getQuoteStatusLabel = (status: QuoteStatus): string => {
  switch (status) {
    case QuoteStatus.DRAFT:
      return "Brouillon";
    case QuoteStatus.PENDING:
      return "En attente";
    case QuoteStatus.ACCEPTED:
      return "Accepté";
    case QuoteStatus.REJECTED:
      return "Refusé";
    case QuoteStatus.EXPIRED:
      return "Expiré";
    case QuoteStatus.CANCELLED:
      return "Annulé";
    case QuoteStatus.SENT:
      return "Envoyé";
    default:
      return "Inconnu";
  }
};

export const getQuoteStatusColor = (status: QuoteStatus): string => {
  switch (status) {
    case QuoteStatus.ACCEPTED:
      return "green";
    case QuoteStatus.REJECTED:
    case QuoteStatus.CANCELLED:
      return "red";
    case QuoteStatus.SENT:
    case QuoteStatus.PENDING:
      return "blue";
    case QuoteStatus.EXPIRED:
      return "orange";
    case QuoteStatus.DRAFT:
    default:
      return "gray";
  }
};
