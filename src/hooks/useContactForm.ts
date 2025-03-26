
import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact } from '@/services/contacts/types';
import { contactCreateUpdateService } from '@/services/contacts/contact-create-update';
import { ContactStatus } from '@/types/database/enums';
import { contactSchema, ContactFormValues } from '@/components/contacts/schema/contactFormSchema';

interface UseContactFormProps {
  onSuccess?: (contactData?: {id: string, name: string}) => void;
  initialData?: Partial<ContactFormValues & { id?: string }>;
  isEditing?: boolean;
}

// Export as a named export to match the import in components
export const useContactForm = ({ onSuccess, initialData, isEditing = false }: UseContactFormProps = {}) => {
  const [loading, setLoading] = useState(false);
  
  // Add react-hook-form integration
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      company: initialData?.company || "",
      position: initialData?.position || "",
      address: initialData?.address || "",
      notes: initialData?.notes || "",
      status: initialData?.status || "lead" as ContactStatus,
      assignedTo: initialData?.assignedTo || ""
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  // Legacy state for backward compatibility
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [company, setCompany] = useState(initialData?.company || '');
  const [position, setPosition] = useState(initialData?.position || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [status, setStatus] = useState<ContactStatus>(initialData?.status || 'lead');
  const [assignedTo, setAssignedTo] = useState(initialData?.assignedTo || '');

  const resetForm = () => {
    form.reset();
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
      toast.error("Erreur", {
        description: 'Le nom et l\'email sont requis.'
      });
      return;
    }

    setLoading(true);

    try {
      const contactData = {
        name,
        email,
        phone,
        company,
        position,
        address,
        notes,
        status,
        assignedTo
      };
      
      const contactId = await contactCreateUpdateService.createContact(contactData);

      if (contactId) {
        toast.success("Succès", {
          description: 'Contact créé avec succès.'
        });
        resetForm();
        if (onSuccess) onSuccess({id: contactId, name});
      }
    } catch (error) {
      console.error('Erreur lors de la création du contact:', error);
      toast.error("Erreur", {
        description: 'Une erreur est survenue lors de la création du contact.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContact = async (contactId: string) => {
    if (!name || !email) {
      toast.error("Erreur", {
        description: 'Le nom et l\'email sont requis.'
      });
      return;
    }

    setLoading(true);

    try {
      const contactData = {
        name,
        email,
        phone,
        company,
        position,
        address,
        notes,
        status,
        assignedTo
      };
      
      const success = await contactCreateUpdateService.updateContact(contactId, contactData);

      if (success) {
        toast.success("Succès", {
          description: 'Contact mis à jour avec succès.'
        });
        if (onSuccess) onSuccess({id: contactId, name});
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du contact:', error);
      toast.error("Erreur", {
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
    
    // Also update form values
    form.reset({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      company: contact.company || '',
      position: contact.position || '',
      address: contact.address || '',
      notes: contact.notes || '',
      status: contact.status,
      assignedTo: contact.assignedTo || ''
    });
  };

  // New react-hook-form submit handler
  const onSubmit = async (data: ContactFormValues) => {
    try {
      setLoading(true);
      if (isEditing && initialData?.id) {
        const success = await contactCreateUpdateService.updateContact(initialData.id, data);
        if (success) {
          toast.success("Contact mis à jour avec succès");
          if (onSuccess) onSuccess({id: initialData.id, name: data.name});
        }
      } else {
        const contactId = await contactCreateUpdateService.createContact(data);
        if (contactId) {
          toast.success("Contact ajouté avec succès");
          form.reset();
          if (onSuccess) onSuccess({id: contactId, name: data.name});
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout/mise à jour du contact:", error);
      toast.error("Erreur lors de l'opération sur le contact");
    } finally {
      setLoading(false);
    }
  };

  return {
    // New form props
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
    
    // Legacy props for backward compatibility
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

// Also export as default to maintain backward compatibility
export default useContactForm;
