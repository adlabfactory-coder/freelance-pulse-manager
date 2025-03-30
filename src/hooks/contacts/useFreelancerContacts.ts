
import { useState, useEffect, useCallback } from 'react';
import { Contact } from '@/services/contacts/types';
import { contactService } from '@/services/contacts';
import { fetchContactsByFreelancer } from '@/services/user-service';
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
      
      // Récupérer les IDs des contacts associés au freelance
      const contactIds = await fetchContactsByFreelancer(user.id);
      
      if (contactIds.length === 0) {
        // Si aucun contact associé, utiliser la méthode legacy pour compatibilité
        const allContacts = await contactService.getContactsByFreelancer(user.id);
        setContacts(allContacts);
      } else {
        // Récupérer les détails des contacts associés
        const contactsDetails = await Promise.all(
          contactIds.map(id => contactService.getContactById(id))
        );
        
        // Filtrer les contacts null (qui n'ont pas été trouvés)
        setContacts(contactsDetails.filter((contact): contact is Contact => contact !== null));
      }
    } catch (err) {
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
