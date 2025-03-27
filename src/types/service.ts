
export enum ServiceType {
  SERVICE = "service",
  PRODUCT = "product",
  SUBSCRIPTION = "subscription",
  PACK = "pack"
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  type: ServiceType;
  is_active?: boolean;
  isActive?: boolean; // For backward compatibility
  created_at?: string;
  updated_at?: string;
}
