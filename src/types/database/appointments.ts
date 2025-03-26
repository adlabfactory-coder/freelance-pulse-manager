
import { Json } from './base';

export interface AppointmentsTable {
  appointments: {
    Row: {
      id: string
      title: string
      description: string | null
      contactId: string
      freelancerid: string // Utilisation cohérente de freelancerid (tout en minuscule)
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
      freelancerid: string
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
      freelancerid?: string
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
