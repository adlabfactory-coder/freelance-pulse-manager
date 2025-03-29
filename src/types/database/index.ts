import { PostgrestError } from '@supabase/supabase-js';
import { ContactStatus, AppointmentStatus, QuoteStatus, DatabaseEnums } from './enums';
import { QuotesTable } from './quotes';

// Types de base
export interface BaseResponse {
  data: any | null;
  error: PostgrestError | null;
}

// Export de la structure de la base de données
export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          created_at: string | null
          date: string | null
          description: string | null
          end_time: string | null
          id: string
          location: string | null
          start_time: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          start_time?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          start_time?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
      }
      contacts: {
        Row: {
          address: string | null
          assignedTo: string | null
          company: string | null
          created_at: string
          deleted_at: string | null
          email: string
          folder: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          position: string | null
          status: Database["public"]["Enums"]["contact_status"]
          subscriptionPlanId: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          assignedTo?: string | null
          company?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          folder?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          status?: Database["public"]["Enums"]["contact_status"]
          subscriptionPlanId?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          assignedTo?: string | null
          company?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          folder?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          status?: Database["public"]["Enums"]["contact_status"]
          subscriptionPlanId?: string | null
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
      }
      quote_items: {
        Row: {
          description: string
          discount: number | null
          id: string
          quantity: number
          quoteId: string
          serviceId: string | null
          tax: number | null
          unitPrice: number
        }
        Insert: {
          description: string
          discount?: number | null
          id?: string
          quantity: number
          quoteId: string
          serviceId?: string | null
          tax?: number | null
          unitPrice: number
        }
        Update: {
          description?: string
          discount?: number | null
          id?: string
          quantity?: number
          quoteId?: string
          serviceId?: string | null
          tax?: number | null
          unitPrice?: number
        }
      }
      quotes: {
        Row: {
          contactId: string
          createdAt: string
          folder: string | null
          freelancerId: string
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["quote_status"]
          totalAmount: number
          updatedAt: string
          validUntil: string
        }
        Insert: {
          contactId: string
          createdAt?: string
          folder?: string | null
          freelancerId: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          totalAmount: number
          updatedAt?: string
          validUntil: string
        }
        Update: {
          contactId?: string
          createdAt?: string
          folder?: string | null
          freelancerId?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          totalAmount?: number
          updatedAt?: string
          validUntil?: string
        }
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string | null
          price: number | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          price?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          price?: number | null
          type?: string | null
          updated_at?: string | null
        }
      }
      subscriptions: {
        Row: {
          clientId: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          ended_at: string | null
          id: string
          metadata: Json | null
          priceId: string | null
          status: string | null
          stripeSubscriptionId: string | null
        }
        Insert: {
          clientId?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          priceId?: string | null
          status?: string | null
          stripeSubscriptionId?: string | null
        }
        Update: {
          clientId?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          priceId?: string | null
          status?: string | null
          stripeSubscriptionId?: string | null
        }
      }
      users: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          role: string | null
          updated_at: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
          zip?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_quote_items: {
        Args: {
          items_data: Json
        }
        Returns: undefined
      }
      create_quote: {
        Args: {
          quote_data: Json
        }
        Returns: {
          id: string
        }
      }
      get_appointments_by_contact: {
        Args: {
          contact_id: string
        }
        Returns: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          date: string
          start_time: string
          end_time: string
          location: string
          status: string
          client_id: string
          assigned_to: string
        }[]
      }
    }
    Enums: {
      contact_status: ContactStatus;
      appointment_status: AppointmentStatus;
      quote_status: QuoteStatus;
    }
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
;

export { ContactStatus, AppointmentStatus, QuoteStatus, DatabaseEnums };
export type { QuotesTable };
