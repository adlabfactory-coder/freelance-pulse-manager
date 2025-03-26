
import { Appointment } from "@/types/appointment";

// Fonction pour filtrer les rendez-vous à venir
export const filterUpcomingAppointments = (appointments: Appointment[]): Appointment[] => {
  const now = new Date();
  return appointments
    .filter(appointment => new Date(appointment.date) > now && appointment.status !== 'cancelled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Fonction pour filtrer les rendez-vous passés
export const filterPastAppointments = (appointments: Appointment[]): Appointment[] => {
  const now = new Date();
  return appointments
    .filter(appointment => new Date(appointment.date) < now || appointment.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Fonction pour filtrer les rendez-vous en attente d'attribution
export const filterPendingAssignmentAppointments = (appointments: Appointment[]): Appointment[] => {
  return appointments
    .filter(appointment => appointment.status === 'pending')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
