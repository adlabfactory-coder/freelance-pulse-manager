
import { Json } from './base';

export interface AppointmentsTable {
  appointments: {
    Row: {
      id: string
      title: string
      description: string | null
      contactId: string
      freelancerId: string
      date: string
      duration: number
      status: string
      location: string | null
      notes: string | null
      createdAt: string
      updatedAt: string
    }
    Insert: {
      id?: string
      title: string
      description?: string | null
      contactId: string
      freelancerId: string
      date: string
      duration: number
      status: string
      location?: string | null
      notes?: string | null
      createdAt?: string
      updatedAt?: string
    }
    Update: {
      id?: string
      title?: string
      description?: string | null
      contactId?: string
      freelancerId?: string
      date?: string
      duration?: number
      status?: string
      location?: string | null
      notes?: string | null
      createdAt?: string
      updatedAt?: string
    }
  }
}
