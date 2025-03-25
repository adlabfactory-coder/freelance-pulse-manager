
import { Json } from './base';

export interface ContactsTable {
  contacts: {
    Row: {
      id: string
      name: string
      email: string
      phone: string | null
      company: string | null
      position: string | null
      address: string | null
      notes: string | null
      assignedTo: string | null
      createdAt: string
      updatedAt: string
      status: string
      subscription_plan_id: string | null
    }
    Insert: {
      id?: string
      name: string
      email: string
      phone?: string | null
      company?: string | null
      position?: string | null
      address?: string | null
      notes?: string | null
      assignedTo?: string | null
      createdAt?: string
      updatedAt?: string
      status?: string
      subscription_plan_id?: string | null
    }
    Update: {
      id?: string
      name?: string
      email?: string
      phone?: string | null
      company?: string | null
      position?: string | null
      address?: string | null
      notes?: string | null
      assignedTo?: string | null
      createdAt?: string
      updatedAt?: string
      status?: string
      subscription_plan_id?: string | null
    }
  }
}
