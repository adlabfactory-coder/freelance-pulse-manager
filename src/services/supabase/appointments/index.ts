
import { SupabaseClient } from '@supabase/supabase-js';
import { AppointmentStatus } from '@/types/appointment';

export const createAppointmentsService = (supabase: SupabaseClient) => {
  const getAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .is('deleted_at', null)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }

    return data;
  };

  const getAppointmentsByFreelancer = async (freelancerId: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('freelancerid', freelancerId)  // Utiliser le nom exact de la colonne dans la DB
      .is('deleted_at', null)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching appointments by freelancer:', error);
      return [];
    }

    return data;
  };

  const getAppointmentsByContact = async (contactId: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('contactId', contactId)
      .is('deleted_at', null)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching appointments by contact:', error);
      return [];
    }

    return data;
  };

  const getPendingAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, contacts(*)')
      .eq('status', AppointmentStatus.PENDING)
      .is('deleted_at', null)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching pending appointments:', error);
      return [];
    }

    return data;
  };

  const createAppointment = async (appointmentData) => {
    try {
      // S'assurer que nous utilisons freelancerid pour la base de données
      const dataToSend = { 
        ...appointmentData 
      };
      
      // Si freelancerId est fourni, le copier vers freelancerid pour la DB
      if (appointmentData.freelancerId !== undefined) {
        dataToSend.freelancerid = appointmentData.freelancerId;
        // Supprimer freelancerId pour éviter les conflits
        delete dataToSend.freelancerId;
      }
      
      const { data, error } = await supabase
        .rpc('create_appointment', {
          appointment_data: dataToSend
        });

      if (error) {
        console.error('Error creating appointment via RPC:', error);
        throw error;
      }

      // Normaliser la réponse pour l'application
      if (data && data.freelancerid) {
        data.freelancerId = data.freelancerid;
      }

      return data;
    } catch (err) {
      console.error('Error in createAppointment:', err);
      throw err;
    }
  };

  const createAutoAssignAppointment = async (appointmentData) => {
    try {
      // S'assurer que nous utilisons freelancerid pour la base de données
      const dataToSend = { 
        ...appointmentData
      };
      
      // Supprimer freelancerId pour la base de données
      if (dataToSend.freelancerId !== undefined) {
        delete dataToSend.freelancerId;
      }
      
      const { data, error } = await supabase
        .rpc('create_auto_assign_appointment', {
          appointment_data: dataToSend
        });

      if (error) {
        console.error('Error creating auto-assign appointment via RPC:', error);
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Error in createAutoAssignAppointment:', err);
      throw err;
    }
  };

  const acceptAppointment = async (appointmentId: string, freelancerId: string) => {
    try {
      const { error } = await supabase
        .rpc('accept_appointment', {
          appointment_id: appointmentId,
          freelancer_id: freelancerId
        });

      if (error) {
        console.error('Error accepting appointment:', error);
        throw error;
      }

      return true;
    } catch (err) {
      console.error('Error in acceptAppointment:', err);
      throw err;
    }
  };

  const updateAppointment = async (appointmentId: string, updateData) => {
    // Si updateData contient freelancerId, le convertir en freelancerid pour la DB
    const dataToUpdate = { ...updateData };
    if (dataToUpdate.freelancerId !== undefined) {
      dataToUpdate.freelancerid = dataToUpdate.freelancerId;
      delete dataToUpdate.freelancerId;
    }
    
    const { error } = await supabase
      .from('appointments')
      .update(dataToUpdate)
      .eq('id', appointmentId);

    if (error) {
      console.error('Error updating appointment:', error);
      return false;
    }

    return true;
  };

  const deleteAppointment = async (appointmentId: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', appointmentId);

    if (error) {
      console.error('Error deleting appointment:', error);
      return false;
    }

    return true;
  };

  return {
    getAppointments,
    getAppointmentsByFreelancer,
    getAppointmentsByContact,
    getPendingAppointments,
    createAppointment,
    createAutoAssignAppointment,
    acceptAppointment,
    updateAppointment,
    deleteAppointment
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
  createAppointment: (appointmentData) => 
    createAppointmentsService(supabase).createAppointment(appointmentData),
  createAutoAssignAppointment: (appointmentData) => 
    createAppointmentsService(supabase).createAutoAssignAppointment(appointmentData),
  acceptAppointment: (appointmentId: string, freelancerId: string) => 
    createAppointmentsService(supabase).acceptAppointment(appointmentId, freelancerId),
  updateAppointment: (appointmentId: string, updateData) => 
    createAppointmentsService(supabase).updateAppointment(appointmentId, updateData),
  deleteAppointment: (appointmentId: string) => 
    createAppointmentsService(supabase).deleteAppointment(appointmentId)
};
