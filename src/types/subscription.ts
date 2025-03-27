
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
  YEARLY = "yearly"
}

export interface Subscription {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: SubscriptionInterval;
  clientId: string;
  clientName?: string;
  freelancerId: string;
  freelancerName?: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date | null;
  renewalDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  code: string;
  description: string | null;
  price: number;
  interval: SubscriptionInterval;
  features: any | null;
  isActive: boolean;
  created_at?: Date;
  updated_at?: Date;
}
