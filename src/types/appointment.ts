
export interface Appointment {
  id: string;
  title: string;
  description: string | null;
  date: string;
  duration: number;
  status: AppointmentStatus;
  contactId: string;
  freelancerId: string;
  location: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  deleted_at?: string | null;
  // Propriétés dérivées pour l'affichage
  contactName?: string;
  freelancerName?: string;
  currentUserId?: string;
  
  // Support pour la propriété freelancerid (legacy de la base de données)
  freelancerid?: string;
}

// Type pour les statuts de rendez-vous venant de la base de données
export type AppointmentStatusFromDB = string;

// Enum pour les statuts de rendez-vous
export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
  PENDING = "pending",
  NO_SHOW = "no_show"
}

// Fonction utilitaire pour normaliser le champ freelancerId/freelancerid
export function normalizeFreelancerId(appointment: Appointment): Appointment {
  const normalized = { ...appointment };
  
  // Si freelancerid existe mais pas freelancerId, on le copie
  if (appointment.freelancerid !== undefined && appointment.freelancerId === undefined) {
    normalized.freelancerId = appointment.freelancerid;
  }
  // Si freelancerId existe mais pas freelancerid, on le copie aussi (pour la cohérence)
  else if (appointment.freelancerId !== undefined && appointment.freelancerid === undefined) {
    normalized.freelancerid = appointment.freelancerId;
  }
  
  return normalized;
}
