
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';

interface AppointmentInput {
  title: string;
  description?: string;
  date?: Date;
  time: string;
  duration: number;
  contactId: string;
  freelancerId?: string;
  folder?: string;
  autoAssign?: boolean;
}

export const useAppointmentOperations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitAppointment = useCallback(async (appointmentData: AppointmentInput) => {
    setIsSubmitting(true);
    try {
      console.log("Soumission du rendez-vous:", appointmentData);
      
      if (!appointmentData.date) {
        throw new Error("La date est requise");
      }
      
      // Convertir la date et l'heure en objet Date
      const [hours, minutes] = appointmentData.time.split(':').map(Number);
      const appointmentDate = new Date(appointmentData.date);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      // Construire l'objet à insérer
      const appointmentToInsert = {
        title: appointmentData.title,
        description: appointmentData.description || null,
        date: appointmentDate.toISOString(),
        duration: appointmentData.duration,
        contactId: appointmentData.contactId,
        freelancerId: appointmentData.freelancerId || null,
        status: 'pending',
        folder: appointmentData.folder || 'general',
        location: null,
        notes: null
      };
      
      console.log("Insertion du rendez-vous dans Supabase:", appointmentToInsert);
      
      // Insertion directe dans la table rendez-vous au lieu d'utiliser RPC
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentToInsert)
        .select('id')
        .single();
      
      if (error) {
        console.error("Erreur lors de la création du rendez-vous:", error);
        throw error;
      }
      
      console.log("Rendez-vous créé avec succès:", data);
      toast.success("Rendez-vous créé avec succès");
      
      return data;
    } catch (error: any) {
      console.error("Erreur lors de la création du rendez-vous:", error);
      toast.error("Erreur: " + (error.message || "Une erreur est survenue"));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    isSubmitting,
    submitAppointment
  };
};
