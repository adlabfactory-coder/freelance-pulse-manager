
export interface Quote {
  id: string;
  contactId: string;
  freelancerId: string;
  validUntil: Date | string;
  status: QuoteStatus;
  totalAmount: number;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  folder?: string;
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

export enum QuoteStatus {
  DRAFT = "draft",
  SENT = "sent",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
  PENDING = "pending"
}

export interface QuoteContact {
  id: string;
  name: string;
  email: string;
  company?: string;
}

export interface QuoteFreelancer {
  id: string;
  name: string;
  email: string;
}

export interface QuoteService {
  id: string;
  name: string;
  description?: string;
  price: number;
}

// Fonction utilitaire pour obtenir un libellé lisible du statut
export const getQuoteStatusLabel = (status: QuoteStatus): string => {
  switch (status) {
    case QuoteStatus.DRAFT:
      return "Brouillon";
    case QuoteStatus.SENT:
      return "Envoyé";
    case QuoteStatus.ACCEPTED:
      return "Accepté";
    case QuoteStatus.REJECTED:
      return "Rejeté";
    case QuoteStatus.EXPIRED:
      return "Expiré";
    case QuoteStatus.CANCELLED:
      return "Annulé";
    case QuoteStatus.PENDING:
      return "En attente";
    default:
      return status;
  }
};

// Fonction utilitaire pour obtenir une couleur CSS selon le statut
export const getQuoteStatusColor = (status: QuoteStatus): string => {
  switch (status) {
    case QuoteStatus.DRAFT:
      return "text-gray-500";
    case QuoteStatus.SENT:
      return "text-blue-500";
    case QuoteStatus.ACCEPTED:
      return "text-green-500";
    case QuoteStatus.REJECTED:
      return "text-red-500";
    case QuoteStatus.EXPIRED:
      return "text-amber-500";
    case QuoteStatus.CANCELLED:
      return "text-red-300";
    case QuoteStatus.PENDING:
      return "text-purple-500";
    default:
      return "text-gray-700";
  }
};
