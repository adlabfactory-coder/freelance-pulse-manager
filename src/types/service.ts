
export enum ServiceType {
  SERVICE = "service",
  PRODUCT = "product",
  SUBSCRIPTION = "subscription",
  PACK = "pack"
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  type: ServiceType | string;
  is_active?: boolean;
  isActive?: boolean; // Pour compatibilité avec les deux conventions de nommage
  created_at?: string;
  updated_at?: string;
}
