
import { SupabaseClient } from '@supabase/supabase-js';
import { Appointment, AppointmentStatus } from '@/types/appointment';

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

    return data as Appointment[];
  };

  const getAppointmentsByFreelancer = async (freelancerId: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('freelancerId', freelancerId) // Updated from freelancerid to freelancerId
      .is('deleted_at', null)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching appointments by freelancer:', error);
      return [];
    }

    return data as Appointment[];
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

    return data as Appointment[];
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

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .rpc('create_appointment', {
          appointment_data: appointmentData
        });

      if (error) {
        console.error('Error creating appointment via RPC:', error);
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Error in createAppointment:', err);
      throw err;
    }
  };

  const createAutoAssignAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'freelancerId'>) => {
    try {
      const { data, error } = await supabase
        .rpc('create_auto_assign_appointment', {
          appointment_data: appointmentData
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

  const updateAppointment = async (appointmentId: string, updateData: Partial<Appointment>) => {
    const { error } = await supabase
      .from('appointments')
      .update(updateData)
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

// Export a simpler interface for usage in components
export const appointmentsService = {
  getAppointments: () => createAppointmentsService(supabase).getAppointments(),
  getAppointmentsByFreelancer: (freelancerId: string) => 
    createAppointmentsService(supabase).getAppointmentsByFreelancer(freelancerId),
  getAppointmentsByContact: (contactId: string) => 
    createAppointmentsService(supabase).getAppointmentsByContact(contactId),
  getPendingAppointments: () => createAppointmentsService(supabase).getPendingAppointments(),
  createAppointment: (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => 
    createAppointmentsService(supabase).createAppointment(appointmentData),
  createAutoAssignAppointment: (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'freelancerId'>) => 
    createAppointmentsService(supabase).createAutoAssignAppointment(appointmentData),
  acceptAppointment: (appointmentId: string, freelancerId: string) => 
    createAppointmentsService(supabase).acceptAppointment(appointmentId, freelancerId),
  updateAppointment: (appointmentId: string, updateData: Partial<Appointment>) => 
    createAppointmentsService(supabase).updateAppointment(appointmentId, updateData),
  deleteAppointment: (appointmentId: string) => 
    createAppointmentsService(supabase).deleteAppointment(appointmentId)
};

// Import necessary Supabase client
import { supabase } from '@/lib/supabase';
