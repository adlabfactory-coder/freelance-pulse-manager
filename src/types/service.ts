
export interface Service {
  id: string;
  name: string;
  description: string;
  type: ServiceType;
  price: number;
  isActive: boolean;
}

export enum ServiceType {
  SERVICE = "service",
  PRODUCT = "product",
  SUBSCRIPTION = "subscription",
  PACK = "pack"
}
