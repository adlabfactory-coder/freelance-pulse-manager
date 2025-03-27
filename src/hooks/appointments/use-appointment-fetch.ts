
import { useState, useCallback } from 'react';
import { Appointment, normalizeFreelancerId } from '@/types/appointment';
import { appointmentsService } from '@/services/supabase/appointments';
import { toast } from 'sonner';
import { useAuth } from '../use-auth';
import { supabase } from '@/lib/supabase-client';

/**
 * Hook responsable de la récupération des rendez-vous avec logique de filtrage par rôle
 */
export function useAppointmentFetch(contactId?: string) {
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
        data = await appointmentsService.getAppointmentsByManager(user.id);
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
      
      // Récupérer les noms des freelancers et managers
      const userIds = [
        ...new Set([
          ...normalizedData.map(app => app.freelancerId).filter(Boolean),
          ...normalizedData.map(app => app.managerId).filter(Boolean)
        ])
      ];
      
      if (userIds.length > 0) {
        const { data: usersData } = await supabase
          .from('users')
          .select('id, name')
          .in('id', userIds);
          
        if (usersData) {
          // Créer un map des IDs d'utilisateurs vers leurs noms
          const usersMap = usersData.reduce((map, user) => {
            map[user.id] = user.name;
            return map;
          }, {} as Record<string, string>);
          
          // Ajouter les noms des utilisateurs à chaque rendez-vous
          normalizedData = normalizedData.map(appointment => ({
            ...appointment,
            freelancerName: appointment.freelancerId ? (usersMap[appointment.freelancerId] || 'Freelancer inconnu') : 'Non assigné',
            managerName: appointment.managerId ? (usersMap[appointment.managerId] || 'Manager inconnu') : 'Non assigné'
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

  return {
    appointments,
    isLoading,
    error,
    fetchAppointments
  };
}
