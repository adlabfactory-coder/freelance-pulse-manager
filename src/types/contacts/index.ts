
import { ContactStatus } from "@/types/database/enums";

export enum ContactStatusEnum {
  LEAD = "lead",
  PROSPECT = "prospect",
  NEGOTIATION = "negotiation",
  SIGNED = "signed",
  LOST = "lost"
}

export function normalizeContactStatus(status: ContactStatusEnum | ContactStatus | string): ContactStatus {
  if (typeof status === 'string') {
    switch (status.toUpperCase()) {
      case 'LEAD':
      case ContactStatusEnum.LEAD:
        return ContactStatus.LEAD;
      case 'PROSPECT':
      case ContactStatusEnum.PROSPECT:
        return ContactStatus.PROSPECT;
      case 'NEGOTIATION':
      case ContactStatusEnum.NEGOTIATION:
        return ContactStatus.NEGOTIATION;
      case 'SIGNED':
      case ContactStatusEnum.SIGNED:
        return ContactStatus.SIGNED;
      case 'LOST':
      case ContactStatusEnum.LOST:
        return ContactStatus.LOST;
      default:
        return ContactStatus.LEAD;
    }
  }
  
  return status as ContactStatus;
}

export function contactStatusToEnum(status: ContactStatus): ContactStatusEnum {
  switch (status) {
    case ContactStatus.LEAD:
      return ContactStatusEnum.LEAD;
    case ContactStatus.PROSPECT:
      return ContactStatusEnum.PROSPECT;
    case ContactStatus.NEGOTIATION:
      return ContactStatusEnum.NEGOTIATION;
    case ContactStatus.SIGNED:
      return ContactStatusEnum.SIGNED;
    case ContactStatus.LOST:
      return ContactStatusEnum.LOST;
    default:
      return ContactStatusEnum.LEAD;
  }
}
