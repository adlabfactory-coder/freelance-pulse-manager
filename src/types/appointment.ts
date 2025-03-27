export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  PENDING = "pending",
  RESCHEDULED = "rescheduled",
  NO_SHOW = "no_show"
}

export interface Appointment {
  id: string;
  title: string;
  description: string;
  contactId: string;
  contactName?: string;
  freelancerId: string;
  freelancerName?: string;
  managerId?: string;
  managerName?: string;
  date: string;
  duration: number;
  status: AppointmentStatus;
  location: string | null;
  notes: string | null;
  folder: string;
  createdAt: string;
  updatedAt: string;
}

// Utility function to normalize freelancerId from database (handling inconsistent naming)
export const normalizeFreelancerId = (appointment: any): Appointment => {
  // Handle case where the property is named 'freelancerid' instead of 'freelancerId'
  if (appointment.freelancerid && !appointment.freelancerId) {
    return {
      ...appointment,
      freelancerId: appointment.freelancerid
    };
  }
  return appointment as Appointment;
};
