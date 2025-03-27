
import { SupabaseClient } from '@supabase/supabase-js';
import { AppointmentStatus } from '@/types/appointment';

/**
 * Fonctions de récupération des rendez-vous
 */
export const createAppointmentsFetchService = (supabase: SupabaseClient) => {
  /**
   * Récupère tous les rendez-vous
   */
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

  /**
   * Récupère les rendez-vous d'un freelancer spécifique
   */
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

  /**
   * Récupère les rendez-vous d'un contact spécifique
   */
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

  /**
   * Récupère les rendez-vous en attente d'attribution
   */
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

  return {
    getAppointments,
    getAppointmentsByFreelancer,
    getAppointmentsByContact,
    getPendingAppointments
  };
};
