
// Export direct des fonctions liées aux rendez-vous
import { fetchAppointments, fetchAppointmentById } from './fetch';
import { updateAppointmentStatus, deleteAppointment } from './update';
import { createAppointment, createAutoAssignAppointment } from './create';

export {
  fetchAppointments,
  fetchAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
  createAppointment,
  createAutoAssignAppointment
};
