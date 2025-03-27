
import { Json } from './base';

export interface AppointmentsTable {
  appointments: {
    Row: {
      id: string
      title: string
      description: string | null
      contactId: string
      freelancerId?: string // Support pour la compatibilité avec l'application
      freelancerid: string  // Champ actuel dans la base de données
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
      freelancerId?: string // Support à la compatibilité avec l'application
      freelancerid?: string  // Champ actuel dans la base de données
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
      freelancerId?: string // Support à la compatibilité avec l'application
      freelancerid?: string // Champ actuel dans la base de données
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
