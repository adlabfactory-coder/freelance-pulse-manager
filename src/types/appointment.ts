
export interface Appointment {
  id: string;
  title: string;
  description: string | null;
  contactId: string;
  contactName?: string;
  freelancerId: string;
  managerId?: string;
  freelancerName?: string;
  managerName?: string;
  date: string;
  duration: number;
  status: AppointmentStatus;
  location: string | null;
  notes: string | null;
  folder?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum AppointmentStatus {
  PENDING = "pending",
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show"
}

export const normalizeFreelancerId = (appointment: Appointment) => {
  return {
    ...appointment,
    freelancerId: appointment.freelancerId || 'system'
  };
};
