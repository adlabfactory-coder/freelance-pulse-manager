import { contactOperationsService } from './contact-operations';
import { Contact, ContactFormInput } from './types';
import { UserRole } from '@/types';

export const contactService = {
  // Récupérer tous les contacts avec gestion des rôles
  async getContacts(userId?: string, userRole?: string): Promise<Contact[]> {
    return contactOperationsService.getContacts(userId, userRole);
  },

  // Récupérer un contact par son ID
  async getContactById(contactId: string): Promise<Contact | null> {
    return contactOperationsService.getContactById(contactId);
  },

  // Récupérer les contacts d'un freelancer spécifique
  async getContactsByFreelancer(freelancerId: string): Promise<Contact[]> {
    return contactOperationsService.getContactsByFreelancer(freelancerId);
  },

  // Mise à jour d'un contact
  async updateContact(contactId: string, contactData: Partial<Contact>): Promise<Contact | null> {
    return contactOperationsService.updateContact(contactId, contactData);
  },

  // Suppression d'un contact
  async deleteContact(contactId: string): Promise<boolean> {
    return contactOperationsService.deleteContact(contactId);
  },

  // Méthodes supplémentaires pour la création et l'import de contacts omises pour concision
};
