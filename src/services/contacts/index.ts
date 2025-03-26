
import { contactCrudService } from './contact-crud';
import { contactSubscriptionService } from './contact-subscriptions';
import { contactExcelService } from './contact-excel';
import { contactOperationsService } from './contact-operations';
import { contactCreateUpdateService } from './contact-create-update';
import { Contact, ContactFormInput, ContactUpdate, ContactInsert } from './types';

// Implement missing methods for filter and search operations
const filterContacts = async (criteria: any) => {
  console.log("Filtering contacts by criteria:", criteria);
  // For now, just return all contacts
  return await contactOperationsService.getContacts();
};

const searchContacts = async (query: string) => {
  console.log("Searching contacts for:", query);
  // For now, just return all contacts
  return await contactOperationsService.getContacts();
};

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
  getContactSubscriptions: async (contactId: string) => {
    // Implement the getContactSubscriptions method
    console.log("Fetching subscriptions for contact:", contactId);
    return [];
  },
  
  // Import/Export
  importContactsFromExcel: contactExcelService.importContactsFromExcel,
  exportContactsToExcel: contactExcelService.exportContactsToExcel,
  
  // Advanced filtering/search
  filterContacts,
  searchContacts
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
