
import { contactCrudService } from './contact-crud';
import { contactSubscriptionService } from './contact-subscriptions';
import { contactExcelService } from './contact-excel';
import { contactOperationsService } from './contact-operations';
import { contactCreateUpdateService } from './contact-create-update';
import { Contact, ContactFormInput, ContactUpdate, ContactInsert } from './types';

// Implémentation simplifiée des opérations de filtrage et recherche
const filterContacts = async (criteria: any) => {
  return await contactOperationsService.getContacts();
};

const searchContacts = async (query: string) => {
  return await contactOperationsService.getContacts();
};

// Service principal pour la gestion des contacts
export const contactService = {
  // Opérations CRUD
  getContacts: contactOperationsService.getContacts,
  getContactById: contactOperationsService.getContactById,
  getContactsByFreelancer: contactOperationsService.getContactsByFreelancer,
  createContact: contactCreateUpdateService.createContact,
  addContact: contactCreateUpdateService.addContact,
  updateContact: contactCreateUpdateService.updateContact,
  deleteContact: contactOperationsService.deleteContact,
  
  // Abonnements
  linkSubscriptionPlan: contactCrudService.linkSubscriptionPlan,
  getContactSubscriptions: async (contactId: string) => [],
  
  // Import/Export
  importContactsFromExcel: contactExcelService.importContactsFromExcel,
  exportContactsToExcel: contactExcelService.exportContactsToExcel,
  
  // Filtrage et recherche
  filterContacts,
  searchContacts
};

// Export des types
export type { Contact, ContactFormInput, ContactUpdate, ContactInsert };

// Export des services individuels
export {
  contactCrudService,
  contactSubscriptionService,
  contactExcelService,
  contactOperationsService,
  contactCreateUpdateService
};
