
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Appointment, AppointmentStatus, normalizeFreelancerId } from '@/types/appointment';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export const useAppointmentList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAppointments = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .is('deleted_at', null)
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      // Format appointments
      const formattedAppointments = data.map(appointment => {
        // Convert status string to AppointmentStatus enum
        const status = appointment.status as AppointmentStatus;
        
        // Use normalizeFreelancerId utility to handle inconsistent field names
        return normalizeFreelancerId({
          id: appointment.id,
          title: appointment.title,
          description: appointment.description,
          contactId: appointment.contactId,
          freelancerid: appointment.freelancerid, // This will be normalized
          date: appointment.date,
          duration: appointment.duration,
          status: status,
          location: appointment.location,
          notes: appointment.notes,
          folder: appointment.folder,
          createdAt: appointment.createdAt,
          updatedAt: appointment.updatedAt,
          managerId: null
        });
      });
      
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error("Erreur lors du chargement des rendez-vous");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    refetch: fetchAppointments
  };
};
