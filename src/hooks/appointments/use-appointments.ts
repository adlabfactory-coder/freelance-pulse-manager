
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase-client";
import { Appointment, AppointmentStatus } from "@/types/appointment";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Chargement des rendez-vous...");
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .is('deleted_at', null)
        .order('date', { ascending: true });
      
      if (error) {
        console.error("Erreur lors du chargement des rendez-vous:", error);
        setError("Impossible de charger les rendez-vous");
        return;
      }
      
      console.log(`${data.length} rendez-vous chargés`);
      setAppointments(data as Appointment[]);
    } catch (e) {
      console.error("Exception lors du chargement des rendez-vous:", e);
      setError("Une erreur est survenue lors du chargement des rendez-vous");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchAppointments();
    
    // Écouter les événements personnalisés
    const handleAppointmentCreated = () => {
      console.log("Événement appointment-created détecté");
      fetchAppointments();
    };
    
    const handleAppointmentUpdated = () => {
      console.log("Événement appointment-status-updated détecté");
      fetchAppointments();
    };
    
    window.addEventListener('appointment-created', handleAppointmentCreated);
    window.addEventListener('appointment-status-updated', handleAppointmentUpdated);
    
    return () => {
      window.removeEventListener('appointment-created', handleAppointmentCreated);
      window.removeEventListener('appointment-status-updated', handleAppointmentUpdated);
    };
  }, [fetchAppointments]);
  
  const refresh = useCallback(() => {
    console.log("Rafraîchissement manuel des rendez-vous");
    fetchAppointments();
  }, [fetchAppointments]);
  
  return {
    appointments,
    isLoading,
    error,
    refresh
  };
};
