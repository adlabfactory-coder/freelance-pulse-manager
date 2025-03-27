
import { useState, useEffect, useCallback } from 'react';
import { Contact } from '@/types';
import { contactService } from '@/services/contacts';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export function useFreelancerContacts(
  initialContacts?: Contact[],
  initialLoading?: boolean
) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts || []);
  const [loading, setLoading] = useState(initialLoading !== undefined ? initialLoading : true);
  const { user } = useAuth();

  const fetchContacts = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const fetchedContacts = await contactService.getContactsByFreelancer(user.id);
      setContacts(fetchedContacts);
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
