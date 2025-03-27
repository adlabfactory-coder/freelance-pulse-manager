
// Types d'utilisateur
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  FREELANCER = 'freelancer',
  ACCOUNT_MANAGER = 'account_manager',
  CLIENT = 'client'
}

// Type utilisateur
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  avatar?: string | null;
  calendly_url?: string;
  calendly_enabled?: boolean;
  calendly_sync_email?: string;
}

// Type devis
export interface Quote {
  id: string;
  contactId: string;
  freelancerId: string;
  totalAmount: number;
  status: string;
  validUntil: Date | string;
  notes?: string | null;
  items: QuoteItem[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  folder?: string;
}

// Type élément de devis
export interface QuoteItem {
  id?: string;
  quoteId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax?: number;
  discount?: number;
  serviceId?: string | null;
}

// Exporter d'autres types selon les besoins
