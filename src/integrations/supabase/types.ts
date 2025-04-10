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
      agency_settings: {
        Row: {
          bank_name: string | null
          capital: string | null
          created_at: string | null
          id: string
          if_number: string | null
          name: string
          rc: string | null
          rib: string | null
          updated_at: string | null
        }
        Insert: {
          bank_name?: string | null
          capital?: string | null
          created_at?: string | null
          id?: string
          if_number?: string | null
          name?: string
          rc?: string | null
          rib?: string | null
          updated_at?: string | null
        }
        Update: {
          bank_name?: string | null
          capital?: string | null
          created_at?: string | null
          id?: string
          if_number?: string | null
          name?: string
          rc?: string | null
          rib?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          api_key: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_name: string
          last_used: string | null
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name: string
          last_used?: string | null
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name?: string
          last_used?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          account_manager_id: string | null
          contact_id: string
          created_at: string | null
          date: string
          deleted_at: string | null
          description: string | null
          duration: number
          folder: string | null
          freelancer_id: string
          id: string
          location: string | null
          notes: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          account_manager_id?: string | null
          contact_id: string
          created_at?: string | null
          date: string
          deleted_at?: string | null
          description?: string | null
          duration: number
          folder?: string | null
          freelancer_id: string
          id?: string
          location?: string | null
          notes?: string | null
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          account_manager_id?: string | null
          contact_id?: string
          created_at?: string | null
          date?: string
          deleted_at?: string | null
          description?: string | null
          duration?: number
          folder?: string | null
          freelancer_id?: string
          id?: string
          location?: string | null
          notes?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_accountManagerId_fkey"
            columns: ["account_manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_contactId_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_freelancerId_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_rules: {
        Row: {
          id: string
          maxContracts: number | null
          minContracts: number
          percentage: number
          tier: string
          unit_amount: number | null
        }
        Insert: {
          id?: string
          maxContracts?: number | null
          minContracts: number
          percentage: number
          tier: string
          unit_amount?: number | null
        }
        Update: {
          id?: string
          maxContracts?: number | null
          minContracts?: number
          percentage?: number
          tier?: string
          unit_amount?: number | null
        }
        Relationships: []
      }
      commissions: {
        Row: {
          amount: number
          commission_amount: number | null
          contracts_count: number | null
          created_at: string | null
          deleted_at: string | null
          freelancer_id: string
          id: string
          paid_date: string | null
          payment_requested: boolean | null
          period_end: string
          period_start: string
          quote_id: string | null
          status: string
          subscription_id: string | null
          tier: string
        }
        Insert: {
          amount: number
          commission_amount?: number | null
          contracts_count?: number | null
          created_at?: string | null
          deleted_at?: string | null
          freelancer_id: string
          id?: string
          paid_date?: string | null
          payment_requested?: boolean | null
          period_end: string
          period_start: string
          quote_id?: string | null
          status: string
          subscription_id?: string | null
          tier: string
        }
        Update: {
          amount?: number
          commission_amount?: number | null
          contracts_count?: number | null
          created_at?: string | null
          deleted_at?: string | null
          freelancer_id?: string
          id?: string
          paid_date?: string | null
          payment_requested?: boolean | null
          period_end?: string
          period_start?: string
          quote_id?: string | null
          status?: string
          subscription_id?: string | null
          tier?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_freelancerId_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_quoteId_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_subscriptionId_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          address: string | null
          assigned_to: string | null
          company: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          folder: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          position: string | null
          status: Database["public"]["Enums"]["contact_status"]
          subscription_plan_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          assigned_to?: string | null
          company?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          folder?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          status?: Database["public"]["Enums"]["contact_status"]
          subscription_plan_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          assigned_to?: string | null
          company?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          folder?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          status?: Database["public"]["Enums"]["contact_status"]
          subscription_plan_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_assignedTo_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      freelancer_contacts: {
        Row: {
          contact_id: string
          created_at: string | null
          freelancer_id: string
          id: string
        }
        Insert: {
          contact_id: string
          created_at?: string | null
          freelancer_id: string
          id?: string
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          freelancer_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "freelancer_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freelancer_contacts_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      modification_history: {
        Row: {
          changes: Json
          entity_id: string
          entity_type: string
          id: string
          modification_date: string | null
          modified_by: string
          new_state: Json
          previous_state: Json
        }
        Insert: {
          changes: Json
          entity_id: string
          entity_type: string
          id?: string
          modification_date?: string | null
          modified_by: string
          new_state: Json
          previous_state: Json
        }
        Update: {
          changes?: Json
          entity_id?: string
          entity_type?: string
          id?: string
          modification_date?: string | null
          modified_by?: string
          new_state?: Json
          previous_state?: Json
        }
        Relationships: [
          {
            foreignKeyName: "modification_history_modified_by_fkey"
            columns: ["modified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_method: string
          quote_id: string
          validated_at: string | null
          validated_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_method: string
          quote_id: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_method?: string
          quote_id?: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_validated_by_fkey"
            columns: ["validated_by"]
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
          quote_id: string
          tax: number | null
          unit_price: number
        }
        Insert: {
          description: string
          discount?: number | null
          id?: string
          quantity: number
          quote_id: string
          tax?: number | null
          unit_price: number
        }
        Update: {
          description?: string
          discount?: number | null
          id?: string
          quantity?: number
          quote_id?: string
          tax?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quoteId_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          contact_id: string
          created_at: string | null
          deleted_at: string | null
          folder: string | null
          freelancer_id: string
          id: string
          notes: string | null
          status: string
          subscription_id: string | null
          total_amount: number
          updated_at: string | null
          valid_until: string
        }
        Insert: {
          contact_id: string
          created_at?: string | null
          deleted_at?: string | null
          folder?: string | null
          freelancer_id: string
          id?: string
          notes?: string | null
          status: string
          subscription_id?: string | null
          total_amount: number
          updated_at?: string | null
          valid_until: string
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          deleted_at?: string | null
          folder?: string | null
          freelancer_id?: string
          id?: string
          notes?: string | null
          status?: string
          subscription_id?: string | null
          total_amount?: number
          updated_at?: string | null
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_contactId_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_freelancerId_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_subscriptionId_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          interval: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          interval?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          interval?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          client_id: string
          created_at: string | null
          deleted_at: string | null
          description: string | null
          end_date: string | null
          freelancer_id: string
          id: string
          interval: string
          name: string
          price: number
          renewal_date: string | null
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          end_date?: string | null
          freelancer_id: string
          id?: string
          interval: string
          name: string
          price: number
          renewal_date?: string | null
          start_date: string
          status: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          end_date?: string | null
          freelancer_id?: string
          id?: string
          interval?: string
          name?: string
          price?: number
          renewal_date?: string | null
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_clientId_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_freelancerId_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          priority: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assignedto_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          id: string
          name: string
          password: string | null
          role: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          id?: string
          name: string
          password?: string | null
          role: string
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          id?: string
          name?: string
          password?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_appointment: {
        Args: {
          appointment_id: string
          freelancer_id: string
        }
        Returns: undefined
      }
      add_quote_items: {
        Args: {
          items_data: Json[]
        }
        Returns: undefined
      }
      check_table_exists: {
        Args: {
          table_name: string
        }
        Returns: boolean
      }
      clean_old_soft_deleted_records: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_appointment: {
        Args: {
          appointment_data: Json
        }
        Returns: Json
      }
      create_auto_assign_appointment: {
        Args: {
          appointment_data: Json
        }
        Returns: Json
      }
      create_contact: {
        Args: {
          contact_data: Json
        }
        Returns: Json
      }
      create_quote: {
        Args: {
          quote_data: Json
        }
        Returns: Json
      }
      decline_appointment: {
        Args: {
          appointment_id: string
        }
        Returns: undefined
      }
      delete_expired_soft_deleted_records: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_quote: {
        Args: {
          quote_id: string
        }
        Returns: undefined
      }
      delete_quote_items: {
        Args: {
          item_ids: string[]
        }
        Returns: undefined
      }
      execute_sql: {
        Args: {
          sql: string
        }
        Returns: undefined
      }
      initialize_freelancer_contacts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      quote_id_literal: {
        Args: {
          v: string
        }
        Returns: string
      }
      soft_delete_user: {
        Args: {
          user_id: string
          current_user_role: string
        }
        Returns: Json
      }
      update_quote: {
        Args: {
          quote_id: string
          quote_updates: Json
        }
        Returns: undefined
      }
      update_quote_item: {
        Args: {
          item_id: string
          item_updates: Json
        }
        Returns: undefined
      }
      update_quote_status: {
        Args: {
          quote_id: string
          new_status: string
        }
        Returns: undefined
      }
    }
    Enums: {
      contact_status: "lead" | "prospect" | "negotiation" | "signed" | "lost"
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
