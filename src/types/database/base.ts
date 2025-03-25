
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface DatabaseTables {
  Tables: {
    contacts: {
      Row: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        company: string | null;
        position: string | null;
        address: string | null;
        notes: string | null;
        assignedTo: string | null;
        createdAt: string;
        updatedAt: string;
        status: string;
        subscription_plan_id: string | null;
      };
      Insert: {
        id?: string;
        name: string;
        email: string;
        phone?: string | null;
        company?: string | null;
        position?: string | null;
        address?: string | null;
        notes?: string | null;
        assignedTo?: string | null;
        createdAt?: string;
        updatedAt?: string;
        status?: string;
        subscription_plan_id?: string | null;
      };
      Update: {
        id?: string;
        name?: string;
        email?: string;
        phone?: string | null;
        company?: string | null;
        position?: string | null;
        address?: string | null;
        notes?: string | null;
        assignedTo?: string | null;
        createdAt?: string;
        updatedAt?: string;
        status?: string;
        subscription_plan_id?: string | null;
      };
    };
    [key: string]: {
      Row: Record<string, any>;
      Insert: Record<string, any>;
      Update: Record<string, any>;
    };
  };
}
