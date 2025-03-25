
import { contactCrudService } from './contact-crud';
import { contactSubscriptionService } from './contact-subscriptions';
import { contactExcelService } from './contact-excel';
import { Contact, ContactFormInput, ContactInsert, ContactUpdate } from './types';

// Combine all services into one main service
export const contactService = {
  ...contactCrudService,
  ...contactSubscriptionService,
  ...contactExcelService
};

// Re-export types
export type { Contact, ContactFormInput, ContactInsert, ContactUpdate };
