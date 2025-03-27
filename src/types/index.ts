
export * from './database';
export * from './database/enums';
export * from './user';
export * from './contact';
export { QuoteStatus, getQuoteStatusLabel, getQuoteStatusColor } from './quote';

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
  icon: string;
  roles?: UserRole[];
  isActive?: boolean;
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
  YEARLY = "yearly"
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  PENDING = "pending",
  EXPIRED = "expired"
}

export interface Subscription {
  id: string;
  name: string;
  description?: string;
  price: number;
  interval: SubscriptionInterval;
  startDate: Date;
  endDate?: Date;
  renewalDate?: Date;
  status: SubscriptionStatus;
  clientId: string;
  freelancerId: string;
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
  icon: string;
  roles?: UserRole[];
}
