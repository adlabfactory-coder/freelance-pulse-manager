
import { SupabaseClient } from '@supabase/supabase-js';
import { createAppointmentsFetchService } from './fetch';
import { createAppointmentsCreateService } from './create';
import { createAppointmentsUpdateService } from './update';
import { createAppointmentsDeleteService } from './delete';

/**
 * Service centralisé pour la gestion des rendez-vous
 */
export const createAppointmentsService = (supabase: SupabaseClient) => {
  const fetchService = createAppointmentsFetchService(supabase);
  const createService = createAppointmentsCreateService(supabase);
  const updateService = createAppointmentsUpdateService(supabase);
  const deleteService = createAppointmentsDeleteService(supabase);

  return {
    // Récupération de rendez-vous
    getAppointments: fetchService.getAppointments,
    getAppointmentsByFreelancer: fetchService.getAppointmentsByFreelancer,
    getAppointmentsByContact: fetchService.getAppointmentsByContact,
    getPendingAppointments: fetchService.getPendingAppointments,
    
    // Création de rendez-vous
    createAppointment: createService.createAppointment,
    createAutoAssignAppointment: createService.createAutoAssignAppointment,
    
    // Mise à jour de rendez-vous
    acceptAppointment: updateService.acceptAppointment,
    updateAppointment: updateService.updateAppointment,
    
    // Suppression de rendez-vous
    deleteAppointment: deleteService.deleteAppointment
  };
};

// Import necessary Supabase client
import { supabase } from '@/lib/supabase';

// Export a simpler interface for usage in components
export const appointmentsService = {
  getAppointments: () => createAppointmentsService(supabase).getAppointments(),
  getAppointmentsByFreelancer: (freelancerId: string) => 
    createAppointmentsService(supabase).getAppointmentsByFreelancer(freelancerId),
  getAppointmentsByContact: (contactId: string) => 
    createAppointmentsService(supabase).getAppointmentsByContact(contactId),
  getPendingAppointments: () => createAppointmentsService(supabase).getPendingAppointments(),
  createAppointment: (appointmentData: any) => 
    createAppointmentsService(supabase).createAppointment(appointmentData),
  createAutoAssignAppointment: (appointmentData: any) => 
    createAppointmentsService(supabase).createAutoAssignAppointment(appointmentData),
  acceptAppointment: (appointmentId: string, freelancerId: string) => 
    createAppointmentsService(supabase).acceptAppointment(appointmentId, freelancerId),
  updateAppointment: (appointmentId: string, updateData: any) => 
    createAppointmentsService(supabase).updateAppointment(appointmentId, updateData),
  deleteAppointment: (appointmentId: string) => 
    createAppointmentsService(supabase).deleteAppointment(appointmentId)
};
