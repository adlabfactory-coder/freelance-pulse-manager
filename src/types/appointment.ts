
export interface Appointment {
  id: string;
  title: string;
  description: string | null;
  date: string;
  duration: number;
  status: "scheduled" | "cancelled" | "completed" | "pending" | "no_show";
  contactId: string;
  freelancerId: string;
  location: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  deleted_at?: string | null;
}

// Add a type to bridge between DB string status and our TypeScript enum
export type AppointmentStatusFromDB = string;
