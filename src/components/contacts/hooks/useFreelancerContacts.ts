
import { useState, useEffect, useCallback } from 'react';
import { contactService } from '@/services/contacts';
import { Contact } from '@/services/contacts/types';
import { ContactStatus } from '@/types/database/enums';
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
      
      // Vérifier si l'ID utilisateur est un UUID valide
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
      
      if (!isValidUUID) {
        console.log("ID utilisateur non valide pour UUID, utilisation des données simulées:", user.id);
        // Pour les utilisateurs de démo avec des ID non UUID, retourner des données simulées
        setContacts([
          {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Contact Demo 1',
            email: 'contact1@example.com',
            status: ContactStatus.LEAD,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '00000000-0000-0000-0000-000000000002',
            name: 'Contact Demo 2',
            email: 'contact2@example.com',
            status: ContactStatus.PROSPECT,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
        setLoading(false);
        return;
      }
      
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
