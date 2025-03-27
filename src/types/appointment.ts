
export interface Appointment {
  id: string;
  title: string;
  description?: string;
  date: Date;
  duration: number;
  status: AppointmentStatus;
  contactId: string;
  freelancerid?: string;
  freelancerId?: string; // Ajout pour compatibilité
  managerId?: string; // Ajout pour la gestion des managers
  location?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deleted_at?: Date;
  folder?: string;
  contactName?: string; // Ajout pour l'affichage du nom du contact
  freelancerName?: string; // Ajout pour l'affichage du nom du freelancer
  managerName?: string; // Ajout pour l'affichage du nom du manager
}

export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show"
}

export const getAppointmentStatusLabel = (status: AppointmentStatus): string => {
  const statusLabels: Record<AppointmentStatus, string> = {
    [AppointmentStatus.SCHEDULED]: "Planifié",
    [AppointmentStatus.PENDING]: "En attente",
    [AppointmentStatus.COMPLETED]: "Terminé",
    [AppointmentStatus.CANCELLED]: "Annulé",
    [AppointmentStatus.NO_SHOW]: "Absence"
  };
  
  return statusLabels[status] || "Inconnu";
};

export const getAppointmentStatusColor = (status: AppointmentStatus): string => {
  const statusColors: Record<AppointmentStatus, string> = {
    [AppointmentStatus.SCHEDULED]: "blue",
    [AppointmentStatus.PENDING]: "yellow",
    [AppointmentStatus.COMPLETED]: "green",
    [AppointmentStatus.CANCELLED]: "red",
    [AppointmentStatus.NO_SHOW]: "gray"
  };
  
  return statusColors[status] || "gray";
};

// Fonction pour normaliser les identifiants de freelancer
// Cette fonction résout les problèmes de casse dans les noms de champs entre freelancerid et freelancerId
export const normalizeFreelancerId = (appointment: any): Appointment => {
  // Si l'entrée n'est pas un objet valide
  if (!appointment || typeof appointment !== 'object') {
    console.warn('normalizeFreelancerId appelée avec un argument non valide:', appointment);
    return appointment;
  }
  
  const result = { ...appointment };
  
  // Normaliser freelancerId (si freelancerid existe mais pas freelancerId)
  if (appointment.freelancerid !== undefined && appointment.freelancerId === undefined) {
    result.freelancerId = appointment.freelancerid;
  }
  // Normaliser freelancerid (si freelancerId existe mais pas freelancerid)
  else if (appointment.freelancerId !== undefined && appointment.freelancerid === undefined) {
    result.freelancerid = appointment.freelancerId;
  }
  
  return result as Appointment;
};
