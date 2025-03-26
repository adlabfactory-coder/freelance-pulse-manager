
export interface Service {
  id: string;
  name: string;
  description?: string;
  type: 'service' | 'pack';
  price: number;
  isActive: boolean;
  created_at?: Date;
  updated_at?: Date;
}
