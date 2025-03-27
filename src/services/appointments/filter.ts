
import { Appointment, AppointmentStatus } from "@/types/appointment";

// Fonction pour filtrer les rendez-vous à venir
export const filterUpcomingAppointments = (appointments: Appointment[]): Appointment[] => {
  const now = new Date();
  return appointments
    .filter(appointment => 
      new Date(appointment.date) > now && 
      appointment.status !== AppointmentStatus.CANCELLED &&
      appointment.status !== AppointmentStatus.COMPLETED
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Fonction pour filtrer les rendez-vous passés
export const filterPastAppointments = (appointments: Appointment[]): Appointment[] => {
  const now = new Date();
  return appointments
    .filter(appointment => 
      new Date(appointment.date) < now || 
      appointment.status === AppointmentStatus.COMPLETED ||
      appointment.status === AppointmentStatus.CANCELLED
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Fonction pour filtrer les rendez-vous en attente d'attribution
export const filterPendingAssignmentAppointments = (appointments: Appointment[]): Appointment[] => {
  return appointments
    .filter(appointment => appointment.status === AppointmentStatus.PENDING)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Fonction pour logger les changements de statut des contacts pour débogage
export const logContactStatusChange = (contactId: string, oldStatus: string, newStatus: string) => {
  console.log(`[CONTACT STATUS] ID: ${contactId} | ${oldStatus} -> ${newStatus}`);
};
