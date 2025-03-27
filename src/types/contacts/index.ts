
import { ContactStatus as ContactStatusUnion } from "@/types/database/enums";

export enum ContactStatusEnum {
  LEAD = "lead",
  PROSPECT = "prospect",
  NEGOTIATION = "negotiation",
  SIGNED = "signed",
  LOST = "lost"
}

export function normalizeContactStatus(status: ContactStatusEnum | ContactStatusUnion | string): ContactStatusUnion {
  if (typeof status === 'string') {
    const validStatuses: ContactStatusUnion[] = ['lead', 'prospect', 'negotiation', 'signed', 'lost'];
    if (validStatuses.includes(status as ContactStatusUnion)) {
      return status as ContactStatusUnion;
    }
    
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
