
import { useState, useEffect, useCallback } from "react";
import { Appointment, AppointmentStatus } from "@/types/appointment";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const usePendingAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [contacts, setContacts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const { user } = useAuth();

  const fetchPendingAppointments = useCallback(async () => {
    try {
      setLoading(true);
      
      // Récupérer les rendez-vous en attente
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('status', AppointmentStatus.PENDING)
        .is('deleted_at', null)
        .order('date');
      
      if (appointmentsError) {
        console.error("Erreur lors de la récupération des rendez-vous en attente:", appointmentsError);
        return;
      }
      
      // Récupérer tous les IDs de contacts associés aux rendez-vous
      const contactIds = [...new Set((appointmentsData || []).map(a => a.contactId))];
      
      if (contactIds.length > 0) {
        // Récupérer les noms des contacts
        const { data: contactsData, error: contactsError } = await supabase
          .from('contacts')
          .select('id, name')
          .in('id', contactIds)
          .is('deleted_at', null);
        
        if (contactsError) {
          console.error("Erreur lors de la récupération des contacts:", contactsError);
        } else {
          // Créer un dictionnaire contactId -> contactName
          const contactsDict: Record<string, string> = {};
          (contactsData || []).forEach(contact => {
            contactsDict[contact.id] = contact.name;
          });
          
          setContacts(contactsDict);
        }
      }
      
      setAppointments(appointmentsData || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des rendez-vous en attente:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchPendingAppointments();
    
    // Écouter les événements de création ou de mise à jour des rendez-vous
    const handleAppointmentCreated = () => {
      console.log("Événement de création de rendez-vous détecté, rafraîchissement des données");
      fetchPendingAppointments();
    };
    
    const handleAppointmentStatusUpdated = () => {
      console.log("Événement de mise à jour de statut de rendez-vous détecté, rafraîchissement des données");
      fetchPendingAppointments();
    };
    
    window.addEventListener('appointment-created', handleAppointmentCreated);
    window.addEventListener('appointment-status-updated', handleAppointmentStatusUpdated);
    
    return () => {
      window.removeEventListener('appointment-created', handleAppointmentCreated);
      window.removeEventListener('appointment-status-updated', handleAppointmentStatusUpdated);
    };
  }, [fetchPendingAppointments]);
  
  const handleAcceptAppointment = async (appointmentId: string, contactId: string) => {
    if (!user?.id) return;
    
    try {
      setProcessingIds(prev => [...prev, appointmentId]);
      console.log(`Acceptation du rendez-vous ${appointmentId} par ${user.id} pour le contact ${contactId}`);
      
      // Récupérer un freelancer disponible (ici, on prend simplement le premier disponible)
      const { data: freelancers, error: freelancersError } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'freelancer')
        .limit(1);
      
      if (freelancersError) {
        console.error("Erreur lors de la récupération d'un freelancer:", freelancersError);
        toast.error("Impossible de trouver un freelancer disponible.");
        return;
      }
      
      if (!freelancers || freelancers.length === 0) {
        toast.error("Aucun freelancer disponible pour accepter ce rendez-vous.");
        return;
      }
      
      const freelancerId = freelancers[0].id;
      
      // Appeler la procédure pour accepter le rendez-vous
      const { error } = await supabase.rpc('accept_appointment', {
        appointment_id: appointmentId,
        freelancer_id: freelancerId
      });
      
      if (error) {
        console.error("Erreur lors de l'acceptation du rendez-vous:", error);
        toast.error("Erreur lors de l'acceptation du rendez-vous.");
        return;
      }
      
      console.log(`Rendez-vous ${appointmentId} accepté avec succès et assigné au freelancer ${freelancerId}`);
      toast.success("Rendez-vous accepté et assigné avec succès!");
      
      // Déclencher l'événement pour mettre à jour les listes
      window.dispatchEvent(new CustomEvent('appointment-status-updated'));
      
      // Rafraîchir la liste des rendez-vous en attente
      fetchPendingAppointments();
    } catch (error) {
      console.error("Erreur lors de l'acceptation du rendez-vous:", error);
      toast.error("Une erreur est survenue lors de l'acceptation du rendez-vous.");
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== appointmentId));
    }
  };
  
  const handleDeclineAppointment = async (appointmentId: string) => {
    try {
      setProcessingIds(prev => [...prev, appointmentId]);
      console.log(`Refus du rendez-vous ${appointmentId}`);
      
      // Appeler la procédure pour refuser le rendez-vous
      const { error } = await supabase.rpc('decline_appointment', {
        appointment_id: appointmentId
      });
      
      if (error) {
        console.error("Erreur lors du refus du rendez-vous:", error);
        toast.error("Erreur lors du refus du rendez-vous.");
        return;
      }
      
      console.log(`Rendez-vous ${appointmentId} refusé avec succès`);
      toast.success("Rendez-vous refusé.");
      
      // Déclencher l'événement pour mettre à jour les listes
      window.dispatchEvent(new CustomEvent('appointment-status-updated'));
      
      // Rafraîchir la liste des rendez-vous en attente
      fetchPendingAppointments();
    } catch (error) {
      console.error("Erreur lors du refus du rendez-vous:", error);
      toast.error("Une erreur est survenue lors du refus du rendez-vous.");
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== appointmentId));
    }
  };
  
  return {
    appointments,
    contacts,
    loading,
    processingIds,
    handleAcceptAppointment,
    handleDeclineAppointment
  };
};
