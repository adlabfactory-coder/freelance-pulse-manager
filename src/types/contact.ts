
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
  createdAt?: Date;
  updatedAt?: Date;
  folder?: string;
  subscription_plan_id?: string;
  deleted_at?: Date; 
}

export enum ContactStatus {
  LEAD = "lead",
  PROSPECT = "prospect",
  NEGOTIATION = "negotiation",
  SIGNED = "signed",
  LOST = "lost"
}
