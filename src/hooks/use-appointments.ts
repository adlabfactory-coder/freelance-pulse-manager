
import { useState, useEffect, useCallback } from 'react';
import { appointmentsService } from '@/services/supabase/appointments';
import { Appointment, AppointmentStatus, normalizeFreelancerId } from '@/types/appointment';
import { toast } from 'sonner';
import { useAuth } from './use-auth';
import { supabase } from '@/lib/supabase';

export function useAppointments(contactId?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdminOrSuperAdmin, isAccountManager } = useAuth();

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let data: Appointment[];
      
      if (contactId) {
        // Fetch appointments for a specific contact
        data = await appointmentsService.getAppointmentsByContact(contactId);
      } else if (isAdminOrSuperAdmin) {
        // Admin and super admin see all appointments
        data = await appointmentsService.getAppointments();
      } else if (isAccountManager && user?.id) {
        // Account managers see appointments assigned to them
        data = await appointmentsService.getAppointmentsByFreelancer(user.id);
      } else if (user?.role === 'freelancer' && user?.id) {
        // Fetch appointments for the current freelancer
        data = await appointmentsService.getAppointmentsByFreelancer(user.id);
      } else {
        // Fetch all appointments
        data = await appointmentsService.getAppointments();
      }
      
      // Normaliser les données pour s'assurer que freelancerId est toujours avec I majuscule
      let normalizedData = data.map(normalizeFreelancerId);
      
      // Récupérer les noms des contacts pour améliorer l'affichage
      const contactIds = [...new Set(normalizedData.map(app => app.contactId))];
      if (contactIds.length > 0) {
        const { data: contactsData } = await supabase
          .from('contacts')
          .select('id, name')
          .in('id', contactIds);
        
        if (contactsData) {
          // Créer un map des IDs de contacts vers leurs noms
          const contactsMap = contactsData.reduce((map, contact) => {
            map[contact.id] = contact.name;
            return map;
          }, {} as Record<string, string>);
          
          // Ajouter le nom du contact à chaque rendez-vous
          normalizedData = normalizedData.map(appointment => ({
            ...appointment,
            contactName: contactsMap[appointment.contactId] || 'Contact inconnu'
          }));
        }
      }
      
      // Récupérer les noms des freelancers aussi
      const freelancerIds = [...new Set(normalizedData.map(app => app.freelancerId).filter(Boolean))];
      if (freelancerIds.length > 0) {
        const { data: freelancersData } = await supabase
          .from('users')
          .select('id, name')
          .in('id', freelancerIds);
          
        if (freelancersData) {
          // Créer un map des IDs de freelancers vers leurs noms
          const freelancersMap = freelancersData.reduce((map, freelancer) => {
            map[freelancer.id] = freelancer.name;
            return map;
          }, {} as Record<string, string>);
          
          // Ajouter le nom du freelancer à chaque rendez-vous
          normalizedData = normalizedData.map(appointment => ({
            ...appointment,
            freelancerName: appointment.freelancerId ? (freelancersMap[appointment.freelancerId] || 'Freelancer inconnu') : 'Non assigné'
          }));
        }
      }
      
      setAppointments(normalizedData);
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors du chargement des rendez-vous';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [contactId, user, isAdminOrSuperAdmin, isAccountManager]);

  useEffect(() => {
    fetchAppointments();
    
    // Configurer l'écouteur pour les mises à jour en temps réel
    let channel;
    
    if (user?.role === 'freelancer' && user?.id) {
      channel = supabase
        .channel('public:appointments-freelancer')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'appointments', filter: `freelancerid=eq.${user.id}` }, 
          () => fetchAppointments()
        )
        .subscribe();
    } else if (contactId) {
      channel = supabase
        .channel('public:appointments-contact')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'appointments', filter: `contactId=eq.${contactId}` }, 
          () => fetchAppointments()
        )
        .subscribe();
    } else {
      channel = supabase
        .channel('public:appointments')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'appointments' }, 
          () => fetchAppointments()
        )
        .subscribe();
    }
    
    // Configurer un écouteur d'événement personnalisé pour la création de rendez-vous
    const handleAppointmentCreated = () => {
      console.log("Événement de création de rendez-vous détecté");
      fetchAppointments();
    };

    window.addEventListener('appointment-created', handleAppointmentCreated);
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      window.removeEventListener('appointment-created', handleAppointmentCreated);
    };
  }, [fetchAppointments, user, contactId]);

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const result = await appointmentsService.createAppointment(appointmentData);
      
      if (result) {
        toast.success("Rendez-vous créé avec succès");
        await fetchAppointments(); // Refresh the list
        return result;
      }
      throw new Error("Échec de la création du rendez-vous");
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors de la création du rendez-vous';
      toast.error(errorMsg);
      throw err;
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: AppointmentStatus) => {
    try {
      const success = await appointmentsService.updateAppointment(appointmentId, { status });
      
      if (success) {
        toast.success(`Le rendez-vous a été marqué comme ${status}.`);
        await fetchAppointments(); // Refresh the list
        return true;
      }
      throw new Error("Échec de la mise à jour du statut");
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors de la mise à jour du statut';
      toast.error(errorMsg);
      return false;
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    try {
      const success = await appointmentsService.deleteAppointment(appointmentId);
      
      if (success) {
        toast.success("Rendez-vous supprimé avec succès");
        await fetchAppointments(); // Refresh the list
        return true;
      }
      throw new Error("Échec de la suppression du rendez-vous");
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors de la suppression du rendez-vous';
      toast.error(errorMsg);
      return false;
    }
  };

  return {
    appointments,
    isLoading,
    error,
    refresh: fetchAppointments,
    createAppointment,
    updateAppointmentStatus,
    deleteAppointment
  };
}
