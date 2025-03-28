
// Types for quotes
export enum QuoteStatus {
  DRAFT = "draft",
  PENDING = "pending",
  SENT = "sent",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired",
  PAID = "paid",
  CANCELLED = "cancelled"
}

export interface QuoteItem {
  id?: string;
  quoteId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
  serviceId?: string;
  toDelete?: boolean; // Used for tracking items to be deleted during edit
}

export interface Quote {
  id: string;
  contactId: string;
  freelancerId: string;
  totalAmount: number;
  status: QuoteStatus;
  validUntil: Date | string;
  notes?: string;
  folder?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  items?: QuoteItem[];
}

/**
 * Retourne le libellé français correspondant au statut d'un devis
 */
export function getQuoteStatusLabel(status: QuoteStatus): string {
  const statusLabels: Record<QuoteStatus, string> = {
    [QuoteStatus.DRAFT]: "Brouillon",
    [QuoteStatus.PENDING]: "En attente",
    [QuoteStatus.SENT]: "Envoyé",
    [QuoteStatus.ACCEPTED]: "Accepté",
    [QuoteStatus.REJECTED]: "Rejeté",
    [QuoteStatus.EXPIRED]: "Expiré",
    [QuoteStatus.PAID]: "Payé",
    [QuoteStatus.CANCELLED]: "Annulé"
  };
  
  return statusLabels[status] || "Inconnu";
}
