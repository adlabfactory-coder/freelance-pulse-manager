
// Assurez-vous que ce fichier contient la normalisation de l'ID du freelancer

export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

export interface Appointment {
  id: string;
  title: string;
  description?: string | null;
  contactId: string;  // Utiliser le I majuscule pour être cohérent
  freelancerId?: string;  // Utiliser le I majuscule pour être cohérent
  freelancerid?: string;  // Garder le champ en minuscules pour la compatibilité
  managerId?: string;
  date: string;
  duration: number;
  status: AppointmentStatus;
  location?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  folder?: string;
  contactName?: string;  // Champ supplémentaire pour l'affichage
  freelancerName?: string;  // Champ supplémentaire pour l'affichage
  managerName?: string;  // Champ supplémentaire pour l'affichage
}

/**
 * Fonction utilitaire pour normaliser les IDs de freelancer
 * Résout les différences de casse entre freelancerId et freelancerid
 */
export function normalizeFreelancerId(appointment: any): Appointment {
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
