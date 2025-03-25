
import { ContactStatus } from "@/types/database/enums";
import { DatabaseTables } from "@/types/database/base";
import { ContactsTable } from "@/types/database/contacts";
import { Database } from "@/types/database";

// Database table types
export type ContactTable = ContactsTable['contacts'];
export type ContactRow = ContactTable['Row'];
export type ContactInsert = ContactTable['Insert'];
export type ContactUpdate = ContactTable['Update'];

// API response type
export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  notes?: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

// Our internal Contact type
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  notes?: string;
  assignedTo?: string;
  status: ContactStatus;
  subscriptionPlanId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Form input type for contact creation/update
export interface ContactFormInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  notes?: string;
  status: ContactStatus;
}

// Import/export types
export interface ContactImport {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  notes?: string;
  status?: string;
}

export interface ImportResult {
  success: number;
  errors: number;
  total: number;
  errorDetails?: string[];
}
