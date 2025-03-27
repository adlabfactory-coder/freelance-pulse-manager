
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
  // Adapter le nom des champs freelancerid/contactid qui viennent de la DB
  if (appointment.freelancerid && !appointment.freelancerId) {
    appointment.freelancerId = appointment.freelancerid;
  }
  
  if (appointment.contactid && !appointment.contactId) {
    appointment.contactId = appointment.contactid;
  }
  
  // Adapter les autres noms de champs si nécessaire
  if (appointment.created_at && !appointment.createdAt) {
    appointment.createdAt = appointment.created_at;
  }
  
  if (appointment.updated_at && !appointment.updatedAt) {
    appointment.updatedAt = appointment.updated_at;
  }
  
  return appointment as Appointment;
}
