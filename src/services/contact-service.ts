
// This file re-exports everything from the new services structure
// This is for backward compatibility so we don't have to update imports in all files

export { contactService } from './contacts';
export type { Contact, ContactFormInput, ContactInsert, ContactUpdate } from './contacts/types';
