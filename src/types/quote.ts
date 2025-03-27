
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
  CANCELLED = "cancelled"
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
