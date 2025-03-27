import { ContactStatus } from '@/types/database/enums';

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
  createdAt: string;
  updatedAt: string;
  status: ContactStatus;
  subscriptionPlanId?: string;
  deleted_at?: string; // Ajout du champ deleted_at
}

export interface ContactInsert {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  notes?: string;
  assignedTo?: string;
  status?: ContactStatus;
}

export interface ContactUpdate {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  notes?: string;
  assignedTo?: string;
  status?: ContactStatus;
  subscriptionPlanId?: string;
}

export interface ContactFilterOptions {
  search?: string;
  status?: ContactStatus[];
  assignedTo?: string;
}

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
