
import { Json } from './base';

export interface UsersTable {
  users: {
    Row: {
      id: string
      name: string
      email: string
      role: string
      avatar: string | null
      schedule_enabled: boolean
      daily_availability: Json | null
      weekly_availability: Json | null
      supervisor_id?: string | null
    }
    Insert: {
      id?: string
      name: string
      email: string
      role: string
      avatar?: string | null
      schedule_enabled?: boolean
      daily_availability?: Json | null
      weekly_availability?: Json | null
      supervisor_id?: string | null
    }
    Update: {
      id?: string
      name?: string
      email?: string
      role?: string
      avatar?: string | null
      schedule_enabled?: boolean
      daily_availability?: Json | null
      weekly_availability?: Json | null
      supervisor_id?: string | null
    }
  }
}
