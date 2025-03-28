
export * from './navigation';
export * from './roles';
export * from './audit';
export * from './quotes';

// Interfaces de base
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  supervisor_id?: string | null;
  schedule_enabled?: boolean;
  daily_availability?: Record<string, any> | null;
  weekly_availability?: Record<string, any> | null;
}

export interface UserAuthData extends User {
  accessToken?: string;
  refreshToken?: string;
}

export interface UserProfile extends User {
  bio?: string;
  position?: string;
  company?: string;
  location?: string;
  skills?: string[];
}

// Types pour les abonnements
export enum SubscriptionStatus {
  ACTIVE = "active",
  PENDING = "pending",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  TRIAL = "trial"
}

export enum SubscriptionInterval {
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly",
  CUSTOM = "custom"
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  interval: SubscriptionInterval;
  features?: Record<string, any>[];
  is_active?: boolean;
  code: string;
}

export interface Subscription {
  id: string;
  name: string;
  description?: string;
  price: number;
  status: SubscriptionStatus;
  interval: SubscriptionInterval;
  clientId: string;
  freelancerId: string;
  startDate: Date | string;
  endDate?: Date | string;
  renewalDate?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deleted_at?: Date | string;
}
