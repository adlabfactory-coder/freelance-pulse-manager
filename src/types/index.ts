// User related types
export enum UserRole {
  ADMIN = "admin",
  FREELANCER = "freelancer",
  CLIENT = "client"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  calendly_url?: string;
  calendly_sync_email?: string;
  calendly_enabled?: boolean;
}

// Contact related types
export enum ContactStatus {
  LEAD = "lead",
  PROSPECT = "prospect",
  NEGOTIATION = "negotiation",
  SIGNED = "signed",
  LOST = "lost"
}

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
  status: ContactStatus;
  subscriptionPlanId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Appointment related types
export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  RESCHEDULED = "rescheduled"
}

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  contactId: string;
  freelancerId: string;
  date: Date;
  duration: number; // in minutes
  status: AppointmentStatus;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Quote related types
export enum QuoteStatus {
  DRAFT = "draft",
  SENT = "sent",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired"
}

export interface QuoteItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number | null;
  tax?: number | null;
  serviceId?: string | null;
}

export interface Quote {
  id?: string;
  contactId: string;
  freelancerId: string;
  totalAmount: number;
  status: QuoteStatus;
  validUntil: Date;
  notes?: string;
  items: QuoteItem[];
  createdAt?: Date;
  updatedAt?: Date;
  contact?: Contact;
  freelancer?: User;
}

// Subscription related types
export enum SubscriptionInterval {
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly"
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELED = "canceled",
  EXPIRED = "expired",
  PENDING = "pending",
  TRIAL = "trial"
}

export interface Subscription {
  id: string;
  name: string;
  description?: string;
  price: number;
  interval: SubscriptionInterval;
  clientId: string;
  freelancerId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  renewalDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Commission related types
export enum CommissionTier {
  TIER_1 = "tier_1",
  TIER_2 = "tier_2",
  TIER_3 = "tier_3",
  TIER_4 = "tier_4"
}

export interface CommissionRule {
  tier: CommissionTier;
  minContracts: number;
  percentage: number;
}

export interface Commission {
  id: string;
  freelancerId: string;
  amount: number;
  tier: CommissionTier;
  subscriptionId?: string;
  quoteId?: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  status: "pending" | "paid";
  paidDate?: Date;
  createdAt: Date;
}

// Dashboard related types
export interface DashboardStats {
  totalContractsSigned: number;
  totalCommissions: number;
  pendingAppointments: number;
  activeSubscriptions: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
}

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType;
  disabled?: boolean;
}

// Subscription plan related types
export interface SubscriptionPlan {
  id: string;
  name: string;
  code: string;
  description: string;
  price: number;
  interval: SubscriptionInterval;
  features: {
    website: boolean;
    social_media: boolean;
    features: string[];
  };
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Update Service type with proper ServiceType enum
export type ServiceType = 'service' | 'pack';

// Service interface
export interface Service {
  id: string;
  name: string;
  description: string;
  type: ServiceType;
  price: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
