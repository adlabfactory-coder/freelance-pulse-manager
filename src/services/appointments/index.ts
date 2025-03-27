
// Re-export all appointment-related functions
import { fetchAppointments, fetchAppointmentById } from './fetch';
import { updateAppointmentStatus } from './update';
import { deleteAppointment } from './update';
import { createAppointment } from './create';

// Export all functions with proper names to avoid ambiguity
export {
  fetchAppointments,
  fetchAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
  createAppointment
};
