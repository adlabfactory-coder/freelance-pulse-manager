
export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  type: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
