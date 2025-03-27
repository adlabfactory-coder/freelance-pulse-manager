
// Re-export properly to avoid ambiguity
import { ContactStatus } from './database/enums';
export { ContactStatus };

export * from './database';
export * from './database/enums';
export * from './user';
export * from './contact';
export * from './quote';
export * from './appointment';

// Création et exportation des types manquants
export enum UserRole {
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
  FREELANCER = "freelancer",
  ACCOUNT_MANAGER = "account_manager",
  CLIENT = "client"
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType; // Modifié pour accepter des éléments React (icônes)
  roles?: UserRole[];
  isActive?: boolean;
  disabled?: boolean; // Ajout de la propriété manquante
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  interval: SubscriptionInterval;
  features?: string[];
  isActive?: boolean;
  code: string;
}

export enum SubscriptionInterval {
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly",
  BIANNUAL = "biannual",
  ANNUAL = "annual"
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  PENDING = "pending",
  EXPIRED = "expired",
  INACTIVE = "inactive",
  TRIAL = "trial"
}

export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: SubscriptionInterval;
  startDate: Date;
  endDate?: Date;
  renewalDate?: Date;
  status: SubscriptionStatus;
  clientId: string;
  freelancerId: string;
  clientName?: string;
  freelancerName?: string;
}

export interface SearchOptions {
  query?: string;
  filters?: Record<string, any>;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Interface pour les éléments de la sidebar
export interface SidebarItem {
  title: string;
  href: string;
  icon: React.ElementType; // Modifié pour accepter des éléments React (icônes)
  roles?: UserRole[];
}

// Export des types du quote
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

export enum QuoteStatus {
  DRAFT = "draft",
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired",
  PAID = "paid",
  CANCELLED = "cancelled"
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
