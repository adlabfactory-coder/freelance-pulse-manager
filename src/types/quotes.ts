
// Importons les types de base de l'application
import { QuoteStatus } from "./quote";

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
