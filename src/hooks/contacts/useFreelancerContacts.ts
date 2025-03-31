
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
      
      // Validation de l'UUID pour éviter les erreurs SQL
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
      
      if (!isValidUUID) {
        console.log("ID utilisateur non valide pour UUID, utilisation des données simulées:", user.id);
        // Pour les démonstrations avec des ID non valides, utiliser des données simulées
        setContacts([
          {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Contact Demo 1',
            email: 'contact1@example.com',
            status: 'lead',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '00000000-0000-0000-0000-000000000002',
            name: 'Contact Demo 2',
            email: 'contact2@example.com',
            status: 'prospect',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]);
        setLoading(false);
        return;
      }
      
      // Récupération des contacts à partir du service
      console.log("Tentative de récupération des contacts pour le freelance:", user.id);
      const contactsData = await contactService.getContactsByFreelancer(user.id);
      
      if (contactsData && contactsData.length > 0) {
        console.log(`${contactsData.length} contacts récupérés avec succès`);
        setContacts(contactsData);
      } else {
        console.log("Aucun contact trouvé pour ce freelance");
        setContacts([]);
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
