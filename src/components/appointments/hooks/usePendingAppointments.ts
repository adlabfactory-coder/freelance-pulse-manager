
import { useState, useEffect } from "react";
import { Appointment } from "@/types/appointment";
import { fetchAppointments } from "@/services/appointments";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export const usePendingAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<{[key: string]: string}>({});
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const { user } = useAuth();

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const allAppointments = await fetchAppointments();
      
      // Filtrer les rendez-vous en attente
      const pendingApps = allAppointments
        .filter(app => app.status === 'pending')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setAppointments(pendingApps);
      
      // Récupérer les noms des contacts associés
      if (pendingApps.length > 0) {
        const contactIds = [...new Set(pendingApps.map(app => app.contactId))];
        const { supabase } = await import('@/lib/supabase');
        
        const { data: contactsData } = await supabase
          .from('contacts')
          .select('id, name')
          .in('id', contactIds);
          
        if (contactsData) {
          const contactMap = contactsData.reduce((acc, contact) => {
            acc[contact.id] = contact.name;
            return acc;
          }, {} as {[key: string]: string});
          setContacts(contactMap);
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des rendez-vous en attente:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAppointment = async (appointmentId: string, contactId: string) => {
    setProcessingIds(prev => [...prev, appointmentId]);
    
    try {
      const { supabase } = await import('@/lib/supabase');
      
      if (!user?.id) {
        toast.error("Vous devez être connecté pour accepter un rendez-vous");
        return;
      }
      
      const userId = user.id;
      
      // Utiliser la procédure stockée pour accepter le rendez-vous et mettre à jour le contact
      const { error } = await supabase
        .rpc('accept_appointment', {
          appointment_id: appointmentId,
          manager_id: userId
        });
      
      if (error) {
        throw new Error(`Erreur lors de l'acceptation du rendez-vous: ${error.message}`);
      }
      
      toast.success("Rendez-vous accepté avec succès");
      
      // Mettre à jour la liste
      setAppointments(prev => prev.filter(app => app.id !== appointmentId));
      
      // Déclencher un événement pour mettre à jour les autres composants
      window.dispatchEvent(new CustomEvent('appointment-status-updated'));
      
    } catch (error) {
      console.error("Erreur lors de l'acceptation du rendez-vous:", error);
      toast.error("Impossible d'accepter le rendez-vous. Veuillez réessayer.");
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== appointmentId));
    }
  };

  const handleDeclineAppointment = async (appointmentId: string) => {
    setProcessingIds(prev => [...prev, appointmentId]);
    
    try {
      const { supabase } = await import('@/lib/supabase');
      
      // Utiliser la procédure stockée pour refuser le rendez-vous
      const { error } = await supabase
        .rpc('decline_appointment', {
          appointment_id: appointmentId
        });
      
      if (error) {
        throw new Error(`Erreur lors du refus du rendez-vous: ${error.message}`);
      }
      
      toast.success("Rendez-vous refusé");
      
      // Mettre à jour la liste
      setAppointments(prev => prev.filter(app => app.id !== appointmentId));
      
      // Déclencher un événement pour mettre à jour les autres composants
      window.dispatchEvent(new CustomEvent('appointment-status-updated'));
      
    } catch (error) {
      console.error("Erreur lors du refus du rendez-vous:", error);
      toast.error("Impossible de refuser le rendez-vous. Veuillez réessayer.");
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== appointmentId));
    }
  };

  useEffect(() => {
    loadAppointments();
    
    // Écouter les événements de mise à jour des rendez-vous
    const handleAppointmentUpdated = () => {
      loadAppointments();
    };
    
    window.addEventListener('appointment-created', handleAppointmentUpdated);
    window.addEventListener('appointment-status-updated', handleAppointmentUpdated);
    
    return () => {
      window.removeEventListener('appointment-created', handleAppointmentUpdated);
      window.removeEventListener('appointment-status-updated', handleAppointmentUpdated);
    };
  }, []);

  return {
    appointments,
    contacts,
    loading,
    processingIds,
    handleAcceptAppointment,
    handleDeclineAppointment
  };
};
