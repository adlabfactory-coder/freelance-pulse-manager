
export enum SubscriptionInterval {
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly",
  BIANNUAL = "biannual",
  ANNUAL = "annual",
  CUSTOM = "custom"
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  PENDING = "pending",
  EXPIRED = "expired",
  INACTIVE = "inactive",
  TRIAL = "trial"
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: SubscriptionInterval;
  features?: string[] | { features: string[] };
  is_active?: boolean;
  isActive?: boolean; // Pour la compatibilité avec le code existant
  code: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: SubscriptionInterval;
  startDate: Date | string;
  endDate?: Date | string;
  renewalDate?: Date | string;
  status: SubscriptionStatus;
  clientId: string;
  freelancerId: string;
  clientName?: string;
  freelancerName?: string;
}
