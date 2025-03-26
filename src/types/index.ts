import { ContactStatus, ContactType } from "./contacts";
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

// Ré-exporter les types des autres fichiers pour centraliser l'accès
export type { ContactStatus, ContactType };
export type { Commission, CommissionStatus, CommissionTier };
