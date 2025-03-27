
import { Contact } from "./contact";
import { User } from "./user";

export enum QuoteStatus {
  DRAFT = "draft",
  SENT = "sent",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired",
  CANCELLED = "cancelled"
}

export interface QuoteItem {
  id?: string;
  quoteId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax?: number;
  discount?: number;
  serviceId?: string;
  // Internal state properties (not stored in DB)
  isNew?: boolean;
  toDelete?: boolean;
}

export interface Quote {
  id: string;
  contactId: string;
  freelancerId: string;
  totalAmount: number;
  validUntil: Date;
  status: QuoteStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  folder?: string;
  items: QuoteItem[];
  
  // Additional properties for UI display
  contactName?: string;
  freelancerName?: string;
}

export interface QuoteFormData {
  contactId: string;
  freelancerId: string;
  validUntil: Date;
  status: QuoteStatus;
  notes?: string;
  folder?: string;
  items: QuoteItem[];
}

export const getQuoteStatusLabel = (status: QuoteStatus): string => {
  switch (status) {
    case QuoteStatus.DRAFT:
      return "Brouillon";
    case QuoteStatus.SENT:
      return "Envoyé";
    case QuoteStatus.ACCEPTED:
      return "Accepté";
    case QuoteStatus.REJECTED:
      return "Refusé";
    case QuoteStatus.EXPIRED:
      return "Expiré";
    case QuoteStatus.CANCELLED:
      return "Annulé";
    default:
      return status;
  }
};

export const getQuoteStatusColor = (status: QuoteStatus): string => {
  switch (status) {
    case QuoteStatus.DRAFT:
      return "gray";
    case QuoteStatus.SENT:
      return "blue";
    case QuoteStatus.ACCEPTED:
      return "green";
    case QuoteStatus.REJECTED:
      return "red";
    case QuoteStatus.EXPIRED:
      return "yellow";
    case QuoteStatus.CANCELLED:
      return "orange";
    default:
      return "gray";
  }
};
