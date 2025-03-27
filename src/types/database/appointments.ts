
import { Json } from './base';

export interface AppointmentsTable {
  appointments: {
    Row: {
      id: string
      title: string
      description: string | null
      contactId: string
      freelancerId: string  // Utilisée de manière cohérente à travers l'application
      date: string
      duration: number
      status: string
      location: string | null
      notes: string | null
      createdAt: string
      updatedAt: string
      deleted_at?: string | null
      folder?: string
    }
    Insert: {
      id?: string
      title: string
      description?: string | null
      contactId: string
      freelancerId: string  // Utilisée de manière cohérente
      date: string
      duration: number
      status: string
      location?: string | null
      notes?: string | null
      createdAt?: string
      updatedAt?: string
      deleted_at?: string | null
      folder?: string
    }
    Update: {
      id?: string
      title?: string
      description?: string | null
      contactId?: string
      freelancerId?: string  // Utilisée de manière cohérente
      date?: string
      duration?: number
      status?: string
      location?: string | null
      notes?: string | null
      createdAt?: string
      updatedAt?: string
      deleted_at?: string | null
      folder?: string
    }
  }
}
