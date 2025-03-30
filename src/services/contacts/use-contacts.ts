
import { useState, useEffect, useCallback } from 'react';
import { contactService } from './index';
import { Contact } from './types';
import { useAuth } from '@/hooks/use-auth';
import { fetchContactsByFreelancer } from '@/services/user-service';
import { toast } from 'sonner';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, role } = useAuth();
  
  const isAdmin = role === 'admin' || role === 'super_admin';
  
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Si l'utilisateur est admin, récupérer tous les contacts
      if (isAdmin) {
        // Utiliser getContacts au lieu de getAllContacts (qui n'existe pas)
        const allContacts = await contactService.getContacts();
        setContacts(allContacts);
      } 
      // Sinon, récupérer les contacts associés au freelance
      else if (user?.id) {
        // Utiliser la nouvelle méthode avec la table freelancer_contacts
        const contactIds = await fetchContactsByFreelancer(user.id);
        
        if (contactIds.length > 0) {
          const contactsData = await Promise.all(
            contactIds.map(id => contactService.getContactById(id))
          );
          // S'assurer que tous les éléments sont bien du type Contact
          const validContacts = contactsData.filter((contact): contact is Contact => contact !== null);
          setContacts(validContacts);
        } else {
          // Fallback sur l'ancienne méthode pour compatibilité
          const fallbackContacts = await contactService.getContactsByFreelancer(user.id);
          setContacts(fallbackContacts);
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      console.error('Error fetching contacts:', error);
      setError(error);
      toast.error('Erreur lors du chargement des contacts');
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);
  
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);
  
  const addContact = useCallback(async (contact: Omit<Contact, 'id'>) => {
    try {
      // Assignation automatique du contact au freelance si c'est un freelance qui crée le contact
      if (user?.id && role === 'freelancer' && !contact.assignedTo) {
        contact.assignedTo = user.id;
      }
      
      const newContact = await contactService.createContact(contact);
      
      // Vérifier que newContact n'est pas une chaîne de caractères mais bien un objet Contact
      if (typeof newContact === 'string') {
        // Si c'est juste l'ID qui est retourné, récupérer le contact complet
        const fullContact = await contactService.getContactById(newContact);
        if (fullContact) {
          setContacts(prev => [...prev, fullContact]);
          toast.success('Contact ajouté avec succès');
          return fullContact;
        }
      } else if (newContact) {
        // Si c'est déjà un objet Contact complet
        setContacts(prev => [...prev, newContact]);
        toast.success('Contact ajouté avec succès');
        return newContact;
      }
      return null;
    } catch (err) {
      console.error('Error adding contact:', err);
      toast.error('Erreur lors de l\'ajout du contact');
      throw err;
    }
  }, [user, role]);
  
  const updateContact = useCallback(async (id: string, contact: Partial<Contact>) => {
    try {
      const updatedContact = await contactService.updateContact(id, contact);
      if (updatedContact) {
        setContacts(prev => prev.map(c => c.id === id ? updatedContact : c));
        toast.success('Contact mis à jour avec succès');
        return updatedContact;
      }
      return null;
    } catch (err) {
      console.error('Error updating contact:', err);
      toast.error('Erreur lors de la mise à jour du contact');
      throw err;
    }
  }, []);
  
  const deleteContact = useCallback(async (id: string) => {
    try {
      await contactService.deleteContact(id);
      setContacts(prev => prev.filter(c => c.id !== id));
      toast.success('Contact supprimé avec succès');
    } catch (err) {
      console.error('Error deleting contact:', err);
      toast.error('Erreur lors de la suppression du contact');
      throw err;
    }
  }, []);
  
  return {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact,
    refetch: fetchContacts
  };
};
