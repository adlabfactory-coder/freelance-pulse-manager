
import { contactCrudService } from './contact-crud';
import { contactSubscriptionService } from './contact-subscriptions';
import { contactExcelService } from './contact-excel';
import { contactOperationsService } from './contact-operations';
import { contactCreateUpdateService } from './contact-create-update';
import { Contact, ContactFormInput, ContactUpdate, ContactInsert } from './types';

// Combine all services into one main service
export const contactService = {
  ...contactCrudService,
  ...contactSubscriptionService,
  ...contactExcelService,
  
  // Assurer que les méthodes essentielles sont correctement définies
  getContacts: contactOperationsService.getContacts,
  getContactById: contactOperationsService.getContactById,
  createContact: contactCreateUpdateService.createContact,
  addContact: contactCreateUpdateService.addContact,
  updateContact: contactCreateUpdateService.updateContact,
  deleteContact: contactOperationsService.deleteContact,
  linkSubscriptionPlan: contactCrudService.linkSubscriptionPlan
};

// Re-export types
export type { Contact, ContactFormInput, ContactUpdate, ContactInsert };

// Re-export individual services for direct import
export {
  contactCrudService,
  contactSubscriptionService,
  contactExcelService,
  contactOperationsService,
  contactCreateUpdateService
};
