
// Types d'utilisateur
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  FREELANCER = 'freelancer',
  ACCOUNT_MANAGER = 'account_manager',
  CLIENT = 'client'
}

// Interface utilisateur
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  avatar?: string | null;
  supervisor_id?: string | null;
  calendly_url?: string;
  calendly_enabled?: boolean;
  calendly_sync_email?: string;
}

// Interface devis
export interface Quote {
  id: string;
  contactId: string;
  freelancerId: string;
  totalAmount: number;
  status: string;
  validUntil: Date | string;
  notes?: string | null;
  items?: QuoteItem[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  folder?: string;
}

// Interface élément de devis
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

// Interface élément de navigation
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ElementType;
  submenu?: NavItem[];
  permission?: string[];
  disabled?: boolean;
}

// Types pour les abonnements
export enum SubscriptionStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  TRIAL = "trial"
}

export enum SubscriptionInterval {
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  BIANNUAL = "biannual",
  ANNUAL = "annual",
  YEARLY = "yearly"
}

export interface Subscription {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: SubscriptionInterval;
  clientId: string;
  clientName?: string;
  freelancerId: string;
  freelancerName?: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date | null;
  renewalDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  code: string;
  description: string | null;
  price: number;
  interval: SubscriptionInterval;
  features: any | null;
  is_active: boolean | null;
  created_at?: Date;
  updated_at?: Date;
}

// Export from quote.ts
export { QuoteStatus } from './quote';

// Exporter d'autres types selon les besoins
export type { Contact } from './contact';
