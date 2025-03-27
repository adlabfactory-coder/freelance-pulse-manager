
export interface Appointment {
  id: string;
  title: string;
  description?: string;
  date: Date;
  duration: number;
  status: AppointmentStatus;
  contactId: string;
  freelancerid?: string;
  location?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deleted_at?: Date;
  folder?: string;
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
