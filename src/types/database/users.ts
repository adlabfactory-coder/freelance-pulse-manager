
import { Json } from './base';

export interface UsersTable {
  users: {
    Row: {
      id: string
      name: string
      email: string
      role: string
      avatar: string | null
      calendly_url: string | null
      calendly_sync_email: string | null
      calendly_enabled: boolean
    }
    Insert: {
      id?: string
      name: string
      email: string
      role: string
      avatar?: string | null
      calendly_url?: string | null
      calendly_sync_email?: string | null
      calendly_enabled?: boolean
    }
    Update: {
      id?: string
      name?: string
      email?: string
      role?: string
      avatar?: string | null
      calendly_url?: string | null
      calendly_sync_email?: string | null
      calendly_enabled?: boolean
    }
  }
}
