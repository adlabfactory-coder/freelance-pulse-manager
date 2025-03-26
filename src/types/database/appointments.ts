
import { Json } from './base';

export interface AppointmentsTable {
  appointments: {
    Row: {
      id: string
      title: string
      description: string | null
      contactId: string
      freelancerId: string // Changed from freelancerid to freelancerId for consistency
      date: string
      duration: number
      status: string
      location: string | null
      notes: string | null
      createdAt: string
      updatedAt: string
      deleted_at?: string | null
    }
    Insert: {
      id?: string
      title: string
      description?: string | null
      contactId: string
      freelancerId: string // Changed from freelancerid to freelancerId for consistency
      date: string
      duration: number
      status: string
      location?: string | null
      notes?: string | null
      createdAt?: string
      updatedAt?: string
      deleted_at?: string | null
    }
    Update: {
      id?: string
      title?: string
      description?: string | null
      contactId?: string
      freelancerId?: string // Changed from freelancerid to freelancerId for consistency
      date?: string
      duration?: number
      status?: string
      location?: string | null
      notes?: string | null
      createdAt?: string
      updatedAt?: string
      deleted_at?: string | null
    }
  }
}
