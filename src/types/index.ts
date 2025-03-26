import { UserRole } from './roles';

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
  status: 'lead' | 'prospect' | 'negotiation' | 'signed' | 'lost';
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
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: QuoteItem[];
}

// Quote Item (Élément de devis)
export interface QuoteItem {
  id: string;
  quoteId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
}

// Subscription (Abonnement)
export interface Subscription {
  id: string;
  name: string;
  description?: string;
  price: number;
  interval: 'monthly' | 'quarterly' | 'biannual' | 'annual';
  clientId: string;
  freelancerId: string;
  status: 'active' | 'pending' | 'cancelled' | 'expired';
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
  type: 'service' | 'pack';
  price: number;
  isActive: boolean;
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
