
export enum QuoteStatus {
  DRAFT = "draft",
  PENDING = "pending",
  SENT = "sent",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired"
}

export interface Quote {
  id: string;
  contactId: string;
  freelancerId: string;
  totalAmount: number;
  status: QuoteStatus;
  validUntil: Date;
  createdAt?: Date;
  updatedAt?: Date;
  notes?: string;
  items?: QuoteItem[];
  folder?: string;
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

/**
 * Renvoie le libellé correspondant à un statut de devis
 */
export const getQuoteStatusLabel = (status: QuoteStatus): string => {
  const statusLabels: Record<QuoteStatus, string> = {
    [QuoteStatus.DRAFT]: "Brouillon",
    [QuoteStatus.PENDING]: "En attente",
    [QuoteStatus.SENT]: "Envoyé",
    [QuoteStatus.ACCEPTED]: "Accepté",
    [QuoteStatus.REJECTED]: "Rejeté",
    [QuoteStatus.EXPIRED]: "Expiré"
  };
  
  return statusLabels[status] || "Inconnu";
};

/**
 * Renvoie la couleur correspondant à un statut de devis
 */
export const getQuoteStatusColor = (status: QuoteStatus): string => {
  const statusColors: Record<QuoteStatus, string> = {
    [QuoteStatus.DRAFT]: "gray",
    [QuoteStatus.PENDING]: "yellow",
    [QuoteStatus.SENT]: "blue",
    [QuoteStatus.ACCEPTED]: "green",
    [QuoteStatus.REJECTED]: "red",
    [QuoteStatus.EXPIRED]: "gray"
  };
  
  return statusColors[status] || "gray";
};
