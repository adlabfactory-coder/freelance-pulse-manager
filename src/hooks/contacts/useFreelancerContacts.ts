
import { useState, useEffect, useCallback } from 'react';
import { Contact } from '@/services/contacts/types';
import { contactService } from '@/services/contacts';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export const useFreelancerContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchContacts = useCallback(async () => {
    if (!user?.id) {
      setError("Utilisateur non connecté");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Utilisation de l'ID réel de l'utilisateur, pas une chaîne statique
      console.log("Tentative de récupération des contacts pour le freelance:", user.id);
      
      // Vérifier si l'utilisateur a des contacts via la table de liaison
      const { data: contactRelations, error: relationsError } = await supabase
        .from('freelancer_contacts')
        .select('contact_id')
        .eq('freelancer_id', user.id);
      
      if (relationsError) {
        console.error("Erreur lors de la récupération des relations freelancer-contacts:", relationsError);
        // En cas d'erreur, on essaie la méthode alternative
      }
      
      if (contactRelations && contactRelations.length > 0) {
        // Récupérer les détails des contacts associés
        const contactIds = contactRelations.map(relation => relation.contact_id);
        console.log(`${contactIds.length} relations de contacts trouvées pour le freelance`);
        
        const { data: contactsData, error: contactsError } = await supabase
          .from('contacts')
          .select('*')
          .in('id', contactIds)
          .is('deleted_at', null);
        
        if (contactsError) {
          throw contactsError;
        }
        
        setContacts(contactsData || []);
      } else {
        // Méthode alternative: rechercher les contacts avec assignedTo
        console.log("Aucune relation trouvée, utilisation de la méthode assignedTo");
        const { data: assignedContacts, error: assignedError } = await supabase
          .from('contacts')
          .select('*')
          .eq('assignedTo', user.id)
          .is('deleted_at', null);
        
        if (assignedError) {
          throw assignedError;
        }
        
        setContacts(assignedContacts || []);
      }
    } catch (err: any) {
      console.error('Erreur lors de la récupération des contacts du freelance:', err);
      setError("Impossible de charger les contacts");
      toast.error("Impossible de charger vos contacts");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    contacts,
    loading,
    error,
    refresh: fetchContacts
  };
};
