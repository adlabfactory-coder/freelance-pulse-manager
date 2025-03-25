
import { Json } from './base';

export interface SubscriptionsTable {
  subscriptions: {
    Row: {
      id: string
      name: string
      description: string | null
      price: number
      interval: string
      clientId: string
      freelancerId: string
      status: string
      startDate: string
      endDate: string | null
      renewalDate: string | null
      createdAt: string
      updatedAt: string
    }
    Insert: {
      id?: string
      name: string
      description?: string | null
      price: number
      interval: string
      clientId: string
      freelancerId: string
      status: string
      startDate: string
      endDate?: string | null
      renewalDate?: string | null
      createdAt?: string
      updatedAt?: string
    }
    Update: {
      id?: string
      name?: string
      description?: string | null
      price?: number
      interval?: string
      clientId?: string
      freelancerId?: string
      status?: string
      startDate?: string
      endDate?: string | null
      renewalDate?: string | null
      createdAt?: string
      updatedAt?: string
    }
  }
  subscription_plans: {
    Row: {
      id: string
      name: string
      code: string
      description: string | null
      price: number
      interval: string
      features: Json | null
      is_active: boolean | null
      created_at: string | null
      updated_at: string | null
    }
    Insert: {
      id?: string
      name: string
      code: string
      description?: string | null
      price: number
      interval?: string
      features?: Json | null
      is_active?: boolean | null
      created_at?: string | null
      updated_at?: string | null
    }
    Update: {
      id?: string
      name?: string
      code?: string
      description?: string | null
      price?: number
      interval?: string
      features?: Json | null
      is_active?: boolean | null
      created_at?: string | null
      updated_at?: string | null
    }
  }
}
