
import { ContactStatus as ContactStatusUnion } from "@/types/database/enums";

// Définir un enum pour le statut des contacts
export enum ContactStatusEnum {
  LEAD = "lead",
  PROSPECT = "prospect",
  NEGOTIATION = "negotiation",
  SIGNED = "signed",
  LOST = "lost"
}

/**
 * This helper function converts between the two types of ContactStatus used in the application.
 * Use this to ensure type consistency when needed.
 */
export function normalizeContactStatus(status: ContactStatusEnum | ContactStatusUnion | string): ContactStatusUnion {
  if (typeof status === 'string') {
    // Check if it's already a valid ContactStatusUnion
    const validStatuses: ContactStatusUnion[] = ['lead', 'prospect', 'negotiation', 'signed', 'lost'];
    if (validStatuses.includes(status as ContactStatusUnion)) {
      return status as ContactStatusUnion;
    }
    
    // Convert from enum string representation to union type
    switch (status.toUpperCase()) {
      case 'LEAD':
      case ContactStatusEnum.LEAD:
        return 'lead';
      case 'PROSPECT':
      case ContactStatusEnum.PROSPECT:
        return 'prospect';
      case 'NEGOTIATION':
      case ContactStatusEnum.NEGOTIATION:
        return 'negotiation';
      case 'SIGNED':
      case ContactStatusEnum.SIGNED:
        return 'signed';
      case 'LOST':
      case ContactStatusEnum.LOST:
        return 'lost';
      default:
        return 'lead';
    }
  }
  
  // Convert from enum to string
  switch (status) {
    case ContactStatusEnum.LEAD:
      return 'lead';
    case ContactStatusEnum.PROSPECT:
      return 'prospect';
    case ContactStatusEnum.NEGOTIATION:
      return 'negotiation';
    case ContactStatusEnum.SIGNED:
      return 'signed';
    case ContactStatusEnum.LOST:
      return 'lost';
    default:
      return 'lead';
  }
}

/**
 * Maps from string union type to enum
 */
export function contactStatusToEnum(status: ContactStatusUnion): ContactStatusEnum {
  switch (status) {
    case 'lead':
      return ContactStatusEnum.LEAD;
    case 'prospect':
      return ContactStatusEnum.PROSPECT;
    case 'negotiation':
      return ContactStatusEnum.NEGOTIATION;
    case 'signed':
      return ContactStatusEnum.SIGNED;
    case 'lost':
      return ContactStatusEnum.LOST;
    default:
      return ContactStatusEnum.LEAD;
  }
}
