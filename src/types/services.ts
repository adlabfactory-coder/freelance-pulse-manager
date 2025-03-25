
import { ServiceType } from './index';

export interface Service {
  id: string;
  name: string;
  description: string;
  type: ServiceType;
  price: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
