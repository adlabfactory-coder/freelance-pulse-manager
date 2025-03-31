
import { useState, useEffect, useCallback } from 'react';
import { contactService } from '@/services/contacts';
import { Contact } from '@/services/contacts/types';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

export function useFreelancerContacts(
  initialContacts?: Contact[],
  initialLoading?: boolean
) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts || []);
  const [loading, setLoading] = useState(initialLoading !== undefined ? initialLoading : true);
  const { user } = useAuth();

  const fetchContacts = useCallback(async () => {
    if (!user?.id) {
      toast.error("Impossible de charger les contacts", {
        description: "Vous devez être connecté pour voir vos contacts."
      });
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log("Récupération des contacts pour le freelance:", user.id);
      
      // Vérifier si l'utilisateur a des contacts via la table de liaison
      const { data: contactRelations, error: relationsError } = await supabase
        .from('freelancer_contacts')
        .select('contact_id')
        .eq('freelancer_id', user.id);
      
      if (relationsError) {
        console.warn("Erreur lors de la récupération des relations freelancer-contacts:", relationsError);
        // En cas d'erreur, on essaie la méthode alternative
      }
      
      if (contactRelations && contactRelations.length > 0) {
        // Récupérer les détails des contacts associés
        const contactIds = contactRelations.map(relation => relation.contact_id);
        console.log(`${contactIds.length} relations de contacts trouvées`);
        
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
    } catch (error) {
      console.error('Error fetching freelancer contacts:', error);
      toast.error("Impossible de charger vos contacts");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!initialContacts) {
      fetchContacts();
    }
  }, [fetchContacts, initialContacts]);

  return {
    contacts,
    loading,
    refresh: fetchContacts
  };
}
