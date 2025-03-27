
export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show"
}

export type AppointmentTitleOption = "consultation-initiale" | "session-suivi" | "demo-produit" | "revision-contrat" | "autre" | "";

export interface Appointment {
  id: string;
  title: string;
  description?: string | null;
  contactId: string;
  freelancerId: string;
  date: string;
  duration: number;
  status: AppointmentStatus;
  location?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  folder?: string;
  contactName?: string;
  freelancerName?: string;
  managerId?: string | null;
  managerName?: string | null;
  deleted_at?: string | null;
}

export function normalizeAppointmentData(appointment: any): Appointment {
  if (appointment.freelancerid && !appointment.freelancerId) {
    appointment.freelancerId = appointment.freelancerid;
  }
  
  if (appointment.contactid && !appointment.contactId) {
    appointment.contactId = appointment.contactid;
  }
  
  return appointment as Appointment;
}
