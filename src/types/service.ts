
export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  type: ServiceType;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export enum ServiceType {
  SUBSCRIPTION = 'subscription',
  ONE_TIME = 'one_time',
  RECURRING = 'recurring',
  CONSULTING = 'consulting',
  OTHER = 'other'
}
