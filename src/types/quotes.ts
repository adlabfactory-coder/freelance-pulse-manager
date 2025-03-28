
// Types pour les devis
export enum QuoteStatus {
  DRAFT = "draft",
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired"
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
