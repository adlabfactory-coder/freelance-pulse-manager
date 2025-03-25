
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
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
        }
      }
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
      quotes: {
        Row: {
          id: string
          contactId: string
          freelancerId: string
          totalAmount: number
          status: string
          validUntil: string
          notes: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          contactId: string
          freelancerId: string
          totalAmount: number
          status: string
          validUntil: string
          notes?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          contactId?: string
          freelancerId?: string
          totalAmount?: number
          status?: string
          validUntil?: string
          notes?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      quote_items: {
        Row: {
          id: string
          quoteId: string
          description: string
          quantity: number
          unitPrice: number
          discount: number | null
          tax: number | null
        }
        Insert: {
          id?: string
          quoteId: string
          description: string
          quantity: number
          unitPrice: number
          discount?: number | null
          tax?: number | null
        }
        Update: {
          id?: string
          quoteId?: string
          description?: string
          quantity?: number
          unitPrice?: number
          discount?: number | null
          tax?: number | null
        }
      }
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
      commissions: {
        Row: {
          id: string
          freelancerId: string
          amount: number
          tier: string
          subscriptionId: string | null
          quoteId: string | null
          periodStart: string
          periodEnd: string
          status: string
          paidDate: string | null
          createdAt: string
        }
        Insert: {
          id?: string
          freelancerId: string
          amount: number
          tier: string
          subscriptionId?: string | null
          quoteId?: string | null
          periodStart: string
          periodEnd: string
          status: string
          paidDate?: string | null
          createdAt?: string
        }
        Update: {
          id?: string
          freelancerId?: string
          amount?: number
          tier?: string
          subscriptionId?: string | null
          quoteId?: string | null
          periodStart?: string
          periodEnd?: string
          status?: string
          paidDate?: string | null
          createdAt?: string
        }
      }
      commission_rules: {
        Row: {
          id: string
          tier: string
          minContracts: number
          percentage: number
        }
        Insert: {
          id?: string
          tier: string
          minContracts: number
          percentage: number
        }
        Update: {
          id?: string
          tier?: string
          minContracts?: number
          percentage?: number
        }
      }
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
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
