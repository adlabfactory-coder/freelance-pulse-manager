
import { ContactStatus as ContactStatusEnum } from "@/types/database/enums";
import { Commission, CommissionStatus, CommissionTier } from "./commissions";

export enum UserRole {
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
  FREELANCER = "freelancer",
  CLIENT = "client",
  ACCOUNT_MANAGER = "account_manager"
}

export enum QuoteStatus {
  DRAFT = "draft",
  SENT = "sent",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired"
}

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
  YEARLY = "yearly" // Alias pour ANNUAL
}

export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  PENDING = "pending",
  NO_SHOW = "no_show"
}

export enum ServiceType {
  SERVICE = "service",
  PRODUCT = "product",
  SUBSCRIPTION = "subscription"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  calendly_enabled: boolean;
  calendly_url: string;
  calendly_sync_email: string;
}

export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: SubscriptionInterval;
  clientId: string;
  clientName?: string;
  freelancerId: string;
  freelancerName?: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  renewalDate?: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  type: ServiceType;
  price: number;
  isActive: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  interval: SubscriptionInterval;
  price: number;
  isActive: boolean;
  code: string; 
  features: any; // Structure JSON pour les fonctionnalités
  created_at?: Date;
  updated_at?: Date;
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

export interface Quote {
  id?: string;
  contactId: string;
  freelancerId: string;
  totalAmount: number;
  validUntil: Date;
  status: QuoteStatus;
  notes?: string;
  items: QuoteItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<any>;
  children?: NavItem[];
  role?: UserRole;
  disabled?: boolean;  // Added disabled property
}

export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  // Ordre des rôles du plus élevé au plus bas
  const roles = [
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.ACCOUNT_MANAGER,
    UserRole.FREELANCER,
    UserRole.CLIENT
  ];
  
  const userRoleIndex = roles.indexOf(userRole);
  const requiredRoleIndex = roles.indexOf(requiredRole);
  
  // Plus l'index est bas, plus le rôle est élevé
  return userRoleIndex <= requiredRoleIndex && userRoleIndex !== -1 && requiredRoleIndex !== -1;
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
  status: ContactStatusEnum;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  subscriptionPlanId?: string;
}

export type { ContactStatusEnum as ContactStatus };
export type { Commission, CommissionStatus, CommissionTier };
