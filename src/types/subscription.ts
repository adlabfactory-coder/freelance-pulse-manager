
import { SubscriptionInterval, SubscriptionStatus } from './index';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: SubscriptionInterval;
  features?: string[];
  isActive?: boolean;
  code: string;
}

export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: SubscriptionInterval;
  startDate: Date;
  endDate?: Date;
  renewalDate?: Date;
  status: SubscriptionStatus;
  clientId: string;
  freelancerId: string;
  clientName?: string;
  freelancerName?: string;
}
