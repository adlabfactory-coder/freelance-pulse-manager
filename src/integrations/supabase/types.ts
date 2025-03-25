export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      "adlab hub freelancer": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      appointments: {
        Row: {
          contactId: string
          createdAt: string | null
          date: string
          description: string | null
          duration: number
          freelancerId: string
          id: string
          location: string | null
          notes: string | null
          status: string
          title: string
          updatedAt: string | null
        }
        Insert: {
          contactId: string
          createdAt?: string | null
          date: string
          description?: string | null
          duration: number
          freelancerId: string
          id?: string
          location?: string | null
          notes?: string | null
          status: string
          title: string
          updatedAt?: string | null
        }
        Update: {
          contactId?: string
          createdAt?: string | null
          date?: string
          description?: string | null
          duration?: number
          freelancerId?: string
          id?: string
          location?: string | null
          notes?: string | null
          status?: string
          title?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_freelancerId_fkey"
            columns: ["freelancerId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_rules: {
        Row: {
          id: string
          minContracts: number
          percentage: number
          tier: string
        }
        Insert: {
          id?: string
          minContracts: number
          percentage: number
          tier: string
        }
        Update: {
          id?: string
          minContracts?: number
          percentage?: number
          tier?: string
        }
        Relationships: []
      }
      commissions: {
        Row: {
          amount: number
          createdAt: string | null
          freelancerId: string
          id: string
          paidDate: string | null
          periodEnd: string
          periodStart: string
          quoteId: string | null
          status: string
          subscriptionId: string | null
          tier: string
        }
        Insert: {
          amount: number
          createdAt?: string | null
          freelancerId: string
          id?: string
          paidDate?: string | null
          periodEnd: string
          periodStart: string
          quoteId?: string | null
          status: string
          subscriptionId?: string | null
          tier: string
        }
        Update: {
          amount?: number
          createdAt?: string | null
          freelancerId?: string
          id?: string
          paidDate?: string | null
          periodEnd?: string
          periodStart?: string
          quoteId?: string | null
          status?: string
          subscriptionId?: string | null
          tier?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_freelancerId_fkey"
            columns: ["freelancerId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_quoteId_fkey"
            columns: ["quoteId"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_subscriptionId_fkey"
            columns: ["subscriptionId"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          address: string | null
          assignedTo: string | null
          company: string | null
          createdAt: string | null
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          position: string | null
          updatedAt: string | null
        }
        Insert: {
          address?: string | null
          assignedTo?: string | null
          company?: string | null
          createdAt?: string | null
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          updatedAt?: string | null
        }
        Update: {
          address?: string | null
          assignedTo?: string | null
          company?: string | null
          createdAt?: string | null
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_assignedTo_fkey"
            columns: ["assignedTo"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_items: {
        Row: {
          description: string
          discount: number | null
          id: string
          quantity: number
          quoteId: string
          tax: number | null
          unitPrice: number
        }
        Insert: {
          description: string
          discount?: number | null
          id?: string
          quantity: number
          quoteId: string
          tax?: number | null
          unitPrice: number
        }
        Update: {
          description?: string
          discount?: number | null
          id?: string
          quantity?: number
          quoteId?: string
          tax?: number | null
          unitPrice?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quoteId_fkey"
            columns: ["quoteId"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          contactId: string
          createdAt: string | null
          freelancerId: string
          id: string
          notes: string | null
          status: string
          totalAmount: number
          updatedAt: string | null
          validUntil: string
        }
        Insert: {
          contactId: string
          createdAt?: string | null
          freelancerId: string
          id?: string
          notes?: string | null
          status: string
          totalAmount: number
          updatedAt?: string | null
          validUntil: string
        }
        Update: {
          contactId?: string
          createdAt?: string | null
          freelancerId?: string
          id?: string
          notes?: string | null
          status?: string
          totalAmount?: number
          updatedAt?: string | null
          validUntil?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_contactId_fkey"
            columns: ["contactId"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_freelancerId_fkey"
            columns: ["freelancerId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          clientId: string
          createdAt: string | null
          description: string | null
          endDate: string | null
          freelancerId: string
          id: string
          interval: string
          name: string
          price: number
          renewalDate: string | null
          startDate: string
          status: string
          updatedAt: string | null
        }
        Insert: {
          clientId: string
          createdAt?: string | null
          description?: string | null
          endDate?: string | null
          freelancerId: string
          id?: string
          interval: string
          name: string
          price: number
          renewalDate?: string | null
          startDate: string
          status: string
          updatedAt?: string | null
        }
        Update: {
          clientId?: string
          createdAt?: string | null
          description?: string | null
          endDate?: string | null
          freelancerId?: string
          id?: string
          interval?: string
          name?: string
          price?: number
          renewalDate?: string | null
          startDate?: string
          status?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_clientId_fkey"
            columns: ["clientId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_freelancerId_fkey"
            columns: ["freelancerId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          calendly_enabled: boolean | null
          calendly_sync_email: string | null
          calendly_url: string | null
          email: string
          id: string
          name: string
          role: string
        }
        Insert: {
          avatar?: string | null
          calendly_enabled?: boolean | null
          calendly_sync_email?: string | null
          calendly_url?: string | null
          email: string
          id?: string
          name: string
          role: string
        }
        Update: {
          avatar?: string | null
          calendly_enabled?: boolean | null
          calendly_sync_email?: string | null
          calendly_url?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_table_exists: {
        Args: {
          table_name: string
        }
        Returns: boolean
      }
      execute_sql: {
        Args: {
          sql: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
