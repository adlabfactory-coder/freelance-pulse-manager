
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

/**
 * Normalise les données d'un rendez-vous pour gérer les différences de casse et de nommage
 * entre la base de données et le code TypeScript
 */
export function normalizeAppointmentData(appointment: any): Appointment {
  // Adaptation maintenue pour les cas spéciaux où des noms de champs différents peuvent exister
  // Par exemple avec created_at et updated_at
  if (appointment.created_at && !appointment.createdAt) {
    appointment.createdAt = appointment.created_at;
  }
  
  if (appointment.updated_at && !appointment.updatedAt) {
    appointment.updatedAt = appointment.updated_at;
  }
  
  return appointment as Appointment;
}
