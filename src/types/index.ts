
import { UserRole } from './roles';

// Définition des statuts pour les devis
export enum QuoteStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

// Définition des statuts pour les abonnements
export enum SubscriptionStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

// Définition des intervalles d'abonnement
export enum SubscriptionInterval {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  BIANNUAL = 'biannual',
  ANNUAL = 'annual'
}

// Définition des types de service
export enum ServiceType {
  SERVICE = 'service',
  PACK = 'pack'
}

// Définition des statuts pour les contacts
export enum ContactStatus {
  LEAD = 'lead',
  PROSPECT = 'prospect',
  NEGOTIATION = 'negotiation',
  SIGNED = 'signed',
  LOST = 'lost'
}

// Définition du type User
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  avatar: string | null;
  calendly_enabled: boolean;
  calendly_url: string;
  calendly_sync_email: string;
}

// Export de UserRole depuis roles.ts
export { UserRole, hasMinimumRole } from './roles';

// Item de navigation
export interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  disabled?: boolean;
}

// Contact
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  notes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  status: ContactStatus | string;
  subscription_plan_id?: string;
}

// Appointment (Rendez-vous)
export interface Appointment {
  id: string;
  title: string;
  description?: string;
  contactId: string;
  freelancerId: string;
  date: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Quote (Devis)
export interface Quote {
  id: string;
  contactId: string;
  freelancerId: string;
  totalAmount: number;
  status: QuoteStatus;
  validUntil: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  items: QuoteItem[];
  contact?: any;
  freelancer?: any;
}

// Quote Item (Élément de devis)
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

// Plan d'abonnement
export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  interval: SubscriptionInterval;
  features?: any[];
  isActive: boolean;
}

// Subscription (Abonnement)
export interface Subscription {
  id: string;
  name: string;
  description?: string;
  price: number;
  interval: SubscriptionInterval;
  clientId: string;
  freelancerId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  renewalDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Commission
export interface Commission {
  id: string;
  freelancerId: string;
  amount: number;
  tier: string;
  subscriptionId?: string;
  quoteId?: string;
  periodStart: string;
  periodEnd: string;
  status: 'pending' | 'paid' | 'cancelled';
  paidDate?: string;
  createdAt: string;
}

// Commission Rule
export interface CommissionRule {
  id: string;
  tier: string;
  minContracts: number;
  percentage: number;
}

// Service
export interface Service {
  id: string;
  name: string;
  description?: string;
  type: ServiceType;
  price: number;
  isActive: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter
export interface Filter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in';
  value: any;
}

// Sort
export interface Sort {
  field: string;
  direction: 'asc' | 'desc';
}

// Query Params
export interface QueryParams {
  page?: number;
  limit?: number;
  filters?: Filter[];
  sort?: Sort[];
  search?: string;
}
