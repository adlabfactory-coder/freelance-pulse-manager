
export enum ServiceType {
  SERVICE = "service",
  PRODUCT = "product",
  SUBSCRIPTION = "subscription",
  PACK = "pack"
}

export interface Service {
  id: string;
  name: string;
  description: string; // Obligatoire pour être compatible avec les deux usages
  price: number;
  type: ServiceType | string; // Accepte à la fois l'enum et les chaînes directes
  is_active?: boolean;
  isActive?: boolean; // Pour la rétrocompatibilité
  created_at?: string;
  updated_at?: string;
}
