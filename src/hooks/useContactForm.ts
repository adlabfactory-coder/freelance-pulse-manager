
import { useState } from 'react';
import { useToast } from './use-toast';
import { Contact } from '@/services/contacts/types';
import { contactCreateUpdateService } from '@/services/contacts/contact-create-update';

const useContactForm = (onSuccess?: (contactId: string) => void) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'lead' | 'prospect' | 'negotiation' | 'signed' | 'lost'>('lead');
  const [assignedTo, setAssignedTo] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setPosition('');
    setAddress('');
    setNotes('');
    setStatus('lead');
    setAssignedTo('');
  };

  const handleCreateContact = async () => {
    if (!name || !email) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le nom et l\'email sont requis.'
      });
      return;
    }

    setLoading(true);

    try {
      const contactId = await contactCreateUpdateService.createContact({
        name,
        email,
        phone,
        company,
        position,
        address,
        notes,
        status,
        assignedTo
      });

      if (contactId) {
        toast({
          title: 'Succès',
          description: 'Contact créé avec succès.'
        });
        resetForm();
        if (onSuccess) onSuccess(contactId);
      }
    } catch (error) {
      console.error('Erreur lors de la création du contact:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la création du contact.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContact = async (contactId: string) => {
    if (!name || !email) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le nom et l\'email sont requis.'
      });
      return;
    }

    setLoading(true);

    try {
      const success = await contactCreateUpdateService.updateContact(contactId, {
        name,
        email,
        phone,
        company,
        position,
        address,
        notes,
        status,
        assignedTo
      });

      if (success) {
        toast({
          title: 'Succès',
          description: 'Contact mis à jour avec succès.'
        });
        if (onSuccess) onSuccess(contactId);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du contact:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la mise à jour du contact.'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadContactData = (contact: Contact) => {
    setName(contact.name);
    setEmail(contact.email);
    setPhone(contact.phone || '');
    setCompany(contact.company || '');
    setPosition(contact.position || '');
    setAddress(contact.address || '');
    setNotes(contact.notes || '');
    setStatus(contact.status);
    setAssignedTo(contact.assignedTo || '');
  };

  return {
    loading,
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    company,
    setCompany,
    position,
    setPosition,
    address,
    setAddress,
    notes,
    setNotes,
    status,
    setStatus,
    assignedTo,
    setAssignedTo,
    handleCreateContact,
    handleUpdateContact,
    loadContactData,
    resetForm
  };
};

export default useContactForm;
