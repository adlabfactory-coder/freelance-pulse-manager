
export enum ContactStatus {
  LEAD = "lead",
  PROSPECT = "prospect",
  NEGOTIATION = "negotiation",
  SIGNED = "signed",
  LOST = "lost"
}

export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show"
}

export enum QuoteStatus {
  DRAFT = "draft",
  PENDING = "pending",
  SENT = "sent",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired",
  PAID = "paid",
  CANCELLED = "cancelled"
}

// Export interface for database enums
export interface DatabaseEnums {
  Enums: {
    contact_status: ContactStatus;
    appointment_status: AppointmentStatus;
    quote_status: QuoteStatus;
  }
}
