
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase-client";
import { Appointment, AppointmentStatus, normalizeAppointmentData } from "@/types/appointment";
import { toast } from "sonner";

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
        toast.error("Impossible de charger les rendez-vous");
        return;
      }
      
      console.log(`${data.length} rendez-vous chargés`);
      
      // Normaliser les données pour résoudre les différences de casse
      const normalizedData = data.map(normalizeAppointmentData);
      setAppointments(normalizedData as Appointment[]);
    } catch (e) {
      console.error("Exception lors du chargement des rendez-vous:", e);
      setError("Une erreur est survenue lors du chargement des rendez-vous");
      toast.error("Une erreur est survenue lors du chargement des rendez-vous");
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
      toast.success("Rendez-vous créé et ajouté à la liste");
    };
    
    const handleAppointmentUpdated = () => {
      console.log("Événement appointment-status-updated détecté");
      fetchAppointments();
      toast.success("Statut du rendez-vous mis à jour");
    };
    
    window.addEventListener('appointment-created', handleAppointmentCreated);
    window.addEventListener('appointment-status-updated', handleAppointmentUpdated);
    
    // Configurer un abonnement Supabase Realtime pour les mises à jour de rendez-vous
    const channel = supabase
      .channel('appointments-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'appointments' 
        }, 
        (payload) => {
          console.log("Changement détecté dans la table appointments:", payload);
          fetchAppointments();
        }
      )
      .subscribe();
    
    return () => {
      window.removeEventListener('appointment-created', handleAppointmentCreated);
      window.removeEventListener('appointment-status-updated', handleAppointmentUpdated);
      supabase.removeChannel(channel);
    };
  }, [fetchAppointments]);
  
  const refresh = useCallback(() => {
    console.log("Rafraîchissement manuel des rendez-vous");
    fetchAppointments();
    toast.info("Liste des rendez-vous rafraîchie");
  }, [fetchAppointments]);
  
  return {
    appointments,
    isLoading,
    error,
    refresh
  };
};
