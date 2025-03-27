
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../use-auth';

/**
 * Hook responsable des écouteurs d'événements en temps réel pour les rendez-vous
 */
export function useAppointmentListeners(
  fetchCallback: () => Promise<void>, 
  contactId?: string
) {
  const { user } = useAuth();

  useEffect(() => {
    // Configurer l'écouteur pour les mises à jour en temps réel
    let channel;
    
    if (user?.role === 'freelancer' && user?.id) {
      channel = supabase
        .channel('public:appointments-freelancer')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'appointments', filter: `freelancerid=eq.${user.id}` }, 
          () => fetchCallback()
        )
        .subscribe();
    } else if (contactId) {
      channel = supabase
        .channel('public:appointments-contact')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'appointments', filter: `contactId=eq.${contactId}` }, 
          () => fetchCallback()
        )
        .subscribe();
    } else {
      channel = supabase
        .channel('public:appointments')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'appointments' }, 
          () => fetchCallback()
        )
        .subscribe();
    }
    
    // Configurer un écouteur d'événement personnalisé pour la création de rendez-vous
    const handleAppointmentCreated = () => {
      console.log("Événement de création de rendez-vous détecté");
      fetchCallback();
    };

    window.addEventListener('appointment-created', handleAppointmentCreated);
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      window.removeEventListener('appointment-created', handleAppointmentCreated);
    };
  }, [fetchCallback, user, contactId]);
}
