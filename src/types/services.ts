
export interface Service {
  id: string;
  name: string;
  description: string;
  type: "service" | "product" | "subscription" | "pack";
  price: number;
  isActive: boolean;
}
