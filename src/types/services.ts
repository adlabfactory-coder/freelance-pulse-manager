
import { ServiceType } from "./index";

export interface Service {
  id: string;
  name: string;
  description?: string;
  type: ServiceType;
  price: number;
  isActive: boolean;
  created_at?: Date;
  updated_at?: Date;
}
