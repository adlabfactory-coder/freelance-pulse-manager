
export type ContactStatus = 'lead' | 'prospect' | 'negotiation' | 'signed' | 'lost';

export interface DatabaseEnums {
  Enums: {
    contact_status: ContactStatus
  }
}
