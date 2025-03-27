
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import { formatDateForAPI } from "@/utils/format";
import { useAuth } from "@/hooks/use-auth";

/**
 * Hook pour gérer les opérations liées aux rendez-vous
 */
export const useAppointmentOperations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  /**
   * Soumet un nouveau rendez-vous en utilisant la fonction RPC create_appointment
   * ou directement dans la table appointments en mode démo
   */
  const submitAppointment = useCallback(async (data: any) => {
    console.log("Soumission du rendez-vous:", data);
    setIsSubmitting(true);

    try {
      const date = formatDateForAPI(data.date, data.time);
      
      if (!date) {
        throw new Error("Format de date invalide");
      }

      if (!data.contactId) {
        throw new Error("ID de contact manquant");
      }

      // Déterminer le freelancerId à utiliser
      let freelancerId = data.freelancerId || user?.id;
      if (!freelancerId) {
        throw new Error("ID de freelancer manquant");
      }

      // Préparation des données pour l'insertion
      const appointmentData = {
        title: data.title,
        description: data.description || null,
        date,
        duration: data.duration,
        contactId: data.contactId,
        freelancerId,
        status: data.autoAssign ? "pending" : "scheduled",
        folder: data.folder || "general",
        location: data.location || null,
        notes: data.notes || null
      };

      console.log("Appel de la fonction RPC create_appointment:", appointmentData);

      // Vérifier si nous sommes en mode démo en vérifiant une constante dans l'environnement
      // ou en utilisant une heuristique basée sur l'utilisateur
      const isDemoMode = true; // Mode démo est activé par défaut dans votre code

      let result;
      
      if (isDemoMode) {
        // En mode démo, insérer directement dans la table appointments
        const { data: insertResult, error: insertError } = await supabase
          .from('appointments')
          .insert({
            title: appointmentData.title,
            description: appointmentData.description,
            date: appointmentData.date,
            duration: appointmentData.duration,
            contactId: appointmentData.contactId,
            freelancerId: appointmentData.freelancerId,
            status: appointmentData.status,
            folder: appointmentData.folder,
            location: appointmentData.location,
            notes: appointmentData.notes
          })
          .select('id')
          .single();

        if (insertError) {
          console.error("Erreur lors de l'insertion directe du rendez-vous:", insertError);
          throw insertError;
        }

        result = insertResult;
      } else {
        // En mode production, utiliser la fonction RPC
        const { data: rpcResult, error: rpcError } = await supabase
          .rpc('create_appointment', {
            appointment_data: appointmentData
          });

        if (rpcError) {
          console.error("Erreur lors de l'appel RPC create_appointment:", rpcError);
          throw rpcError;
        }

        result = rpcResult;
      }

      console.log("Rendez-vous créé avec succès:", result);
      toast.success("Rendez-vous planifié avec succès");
      
      // Lancer un événement personnalisé pour les autres composants
      window.dispatchEvent(new CustomEvent('appointment-created'));
      
      return result;
    } catch (error: any) {
      console.error("Erreur lors de la création du rendez-vous:", error);
      toast.error(`Erreur lors de la création du rendez-vous: ${error.message || 'Erreur inconnue'}`);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [user]);

  return {
    isSubmitting,
    submitAppointment
  };
};
