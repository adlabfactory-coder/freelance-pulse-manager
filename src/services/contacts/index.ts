
import { contactCrudService } from './contact-crud';
import { contactSubscriptionService } from './contact-subscriptions';
import { contactExcelService } from './contact-excel';
import { contactOperationsService } from './contact-operations';
import { contactCreateUpdateService } from './contact-create-update';
import { Contact, ContactFormInput, ContactUpdate, ContactInsert } from './types';

// Combine all services into one main service with a clear interface
export const contactService = {
  // Basic CRUD operations
  getContacts: contactOperationsService.getContacts,
  getContactById: contactOperationsService.getContactById,
  createContact: contactCreateUpdateService.createContact,
  addContact: contactCreateUpdateService.addContact,
  updateContact: contactCreateUpdateService.updateContact,
  deleteContact: contactOperationsService.deleteContact,
  
  // Subscription related
  linkSubscriptionPlan: contactCrudService.linkSubscriptionPlan,
  getContactSubscriptions: contactSubscriptionService.getContactSubscriptions,
  
  // Import/Export
  importContacts: contactExcelService.importContacts,
  exportContacts: contactExcelService.exportContacts,
  
  // Advanced filtering/search
  filterContacts: contactOperationsService.filterContacts,
  searchContacts: contactOperationsService.searchContacts
};

// Re-export types
export type { Contact, ContactFormInput, ContactUpdate, ContactInsert };

// Re-export individual services for direct import if needed
export {
  contactCrudService,
  contactSubscriptionService,
  contactExcelService,
  contactOperationsService,
  contactCreateUpdateService
};
