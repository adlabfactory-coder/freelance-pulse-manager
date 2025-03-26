
export interface Appointment {
  id: string;
  title: string;
  description: string | null;
  date: string;
  duration: number;
  status: "scheduled" | "cancelled" | "completed" | "pending" | "no_show";
  contactId: string;
  freelancerId: string; // Consistent naming
  location: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  deleted_at?: string | null;
}

// Add a type to bridge between DB string status and our TypeScript enum
export type AppointmentStatusFromDB = string;

// Enum pour les statuts de rendez-vous
export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
  PENDING = "pending",
  NO_SHOW = "no_show"
}
