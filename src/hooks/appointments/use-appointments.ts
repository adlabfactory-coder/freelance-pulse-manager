
import { useEffect } from 'react';
import { useAppointmentFetch } from './use-appointment-fetch';
import { useAppointmentOperations } from './use-appointment-operations';
import { useAppointmentListeners } from './use-appointment-listeners';

/**
 * Hook principal pour la gestion des rendez-vous
 * Combine les fonctionnalités de récupération, opérations et écouteurs
 */
export function useAppointments(contactId?: string) {
  // Récupérer les fonctionnalités de récupération des rendez-vous
  const { 
    appointments, 
    isLoading, 
    error, 
    fetchAppointments 
  } = useAppointmentFetch(contactId);
  
  // Récupérer les fonctionnalités d'opérations CRUD
  const { 
    createAppointment, 
    updateAppointmentStatus, 
    deleteAppointment 
  } = useAppointmentOperations(fetchAppointments);
  
  // Configurer les écouteurs d'événements en temps réel
  useAppointmentListeners(fetchAppointments, contactId);
  
  // Charger les rendez-vous au montage du composant
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    // État
    appointments,
    isLoading,
    error,
    
    // Actions
    refresh: fetchAppointments,
    createAppointment,
    updateAppointmentStatus,
    deleteAppointment
  };
}
