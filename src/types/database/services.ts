
import { Json } from './base';

export interface ServicesTable {
  services: {
    Row: {
      id: string
      name: string
      description: string | null
      type: 'service' | 'pack'
      price: number
      is_active: boolean
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      name: string
      description?: string | null
      type: 'service' | 'pack'
      price: number
      is_active?: boolean
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      name?: string
      description?: string | null
      type?: 'service' | 'pack'
      price?: number
      is_active?: boolean
      created_at?: string
      updated_at?: string
    }
  }
}
