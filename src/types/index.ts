export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  FREELANCER = "freelancer",
  ACCOUNT_MANAGER = "account_manager",
  CLIENT = "client"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  calendly_url?: string;
  calendly_enabled?: boolean;
  calendly_sync_email?: string;
}

export interface Appointment {
  id: string;
  title: string;
  description: string | null;
  contactId: string;
  contactName?: string;
  freelancerId: string;
  date: string;
  duration: number;
  status: AppointmentStatus;
  location: string | null;
  notes: string | null;
  folder?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum AppointmentStatus {
  PENDING = "pending",
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

export const normalizeFreelancerId = (appointment: Appointment) => {
  return {
    ...appointment,
    freelancerId: appointment.freelancerId || 'system'
  };
};

export enum QuoteStatus {
  DRAFT = "draft",
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired"
}

export interface Quote {
  id: string;
  contactId: string;
  freelancerId: string;
  totalAmount: number;
  validUntil: Date;
  status: QuoteStatus;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  items: QuoteItem[];
  folder?: string;
}

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

export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  clientId: string;
  freelancerId: string;
  status: string;
  startDate: Date;
  endDate?: Date;
  renewalDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Commission {
  id: string;
  freelancerId: string;
  amount: number;
  tier: string;
  subscriptionId?: string;
  quoteId?: string;
  periodStart: Date;
  periodEnd: Date;
  status: string;
  paidDate?: Date;
  createdAt: Date;
}

export interface CommissionRule {
  id: string;
  tier: string;
  minContracts: number;
  percentage: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}
