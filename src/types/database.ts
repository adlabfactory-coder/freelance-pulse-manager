
import { ContactStatus, AppointmentStatus, QuoteStatus } from './database/enums';

// Define the Database type that's imported in various services
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          avatar: string | null;
          schedule_enabled: boolean;
          daily_availability: any | null;
          weekly_availability: any | null;
          supervisor_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role: string;
          avatar?: string | null;
          schedule_enabled?: boolean;
          daily_availability?: any | null;
          weekly_availability?: any | null;
          supervisor_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: string;
          avatar?: string | null;
          schedule_enabled?: boolean;
          daily_availability?: any | null;
          weekly_availability?: any | null;
          supervisor_id?: string | null;
        };
      };
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          status: ContactStatus;
          created_at: string;
          updated_at: string;
          assigned_to: string | null;
        };
        Insert: {
          // Insert definitions
        };
        Update: {
          // Update definitions
        };
      };
      // Add more tables as needed
    };
    // Add functions, enums, etc.
  };
}
