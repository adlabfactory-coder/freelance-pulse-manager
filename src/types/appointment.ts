
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
