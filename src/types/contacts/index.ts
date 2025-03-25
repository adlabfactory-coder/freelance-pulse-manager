
import { ContactStatus as ContactStatusEnum } from "@/types/index";
import { ContactStatus as ContactStatusUnion } from "@/types/database/enums";

/**
 * This helper function converts between the two types of ContactStatus used in the application.
 * Use this to ensure type consistency when needed.
 */
export function normalizeContactStatus(status: ContactStatusEnum | ContactStatusUnion): ContactStatusUnion {
  if (typeof status === 'string') {
    return status as ContactStatusUnion;
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
