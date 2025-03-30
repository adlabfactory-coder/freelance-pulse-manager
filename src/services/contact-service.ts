
import { contactOperationsService } from './contacts/contact-operations';
import { contactCreateUpdateService } from './contacts/contact-create-update';
import { contactExcelService } from './contacts/contact-excel';
import { Contact, ContactFormInput, ContactUpdate } from './contacts/types';

export const contactService = {
  // Récupérer tous les contacts avec gestion des rôles
  async getContacts(userId?: string, userRole?: string, includeDeleted: boolean = false): Promise<Contact[]> {
    return contactOperationsService.getContacts(userId, userRole, includeDeleted);
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

  // Suppression d'un contact (déplace vers trash)
  async deleteContact(contactId: string): Promise<boolean> {
    return contactOperationsService.deleteContact(contactId);
  },

  // Restauration d'un contact depuis trash
  async restoreContact(contactId: string): Promise<boolean> {
    return contactOperationsService.restoreContact(contactId);
  },

  // Suppression définitive d'un contact
  async permanentlyDeleteContact(contactId: string): Promise<boolean> {
    return contactOperationsService.permanentlyDeleteContact(contactId);
  },

  // Création d'un contact
  async createContact(contactData: ContactFormInput): Promise<Contact | null> {
    return contactCreateUpdateService.createContact(contactData);
  },

  // Export des contacts en Excel
  async exportContactsToExcel(): Promise<Blob | null> {
    return contactExcelService.exportContactsToExcel();
  },

  // Import des contacts depuis Excel
  async importContactsFromExcel(file: File): Promise<{success: boolean, message?: string}> {
    return contactExcelService.importContactsFromExcel(file);
  }
};

// Exportation directe pour faciliter l'import
export { contactService as default };
export type { Contact, ContactFormInput, ContactUpdate };
