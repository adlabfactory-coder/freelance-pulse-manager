
// Définition des statuts possibles pour un rendez-vous
export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show"
}

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
 * Fonction utilitaire pour normaliser les données de rendez-vous
 */
export function normalizeAppointmentData(appointment: any): Appointment {
  // Si freelancerid existe (minuscules), le copier dans freelancerId (I majuscule)
  if (appointment.freelancerid && !appointment.freelancerId) {
    appointment.freelancerId = appointment.freelancerid;
  }
  
  // Si contactid existe (minuscules), le copier dans contactId (I majuscule)
  if (appointment.contactid && !appointment.contactId) {
    appointment.contactId = appointment.contactid;
  }
  
  return appointment as Appointment;
}

// Pour maintenir la compatibilité pendant la transition
export const normalizeFreelancerId = normalizeAppointmentData;
