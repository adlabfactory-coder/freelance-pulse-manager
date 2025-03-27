
export enum NotificationType {
  LEAD_CREATED = "lead_created",
  LEAD_CONVERTED = "lead_converted",
  QUOTE_CREATED = "quote_created",
  QUOTE_ACCEPTED = "quote_accepted",
  QUOTE_REJECTED = "quote_rejected",
  APPOINTMENT_CREATED = "appointment_created",
  APPOINTMENT_UPDATED = "appointment_updated",
  APPOINTMENT_REMINDER = "appointment_reminder",
  APPOINTMENT_PENDING_ASSIGNMENT = "appointment_pending_assignment",
  APPOINTMENT_COMPLETED = "appointment_completed",
  APPOINTMENT_CANCELLED = "appointment_cancelled",
  APPOINTMENT_NO_SHOW = "appointment_no_show",
  SUBSCRIPTION_RENEWED = "subscription_renewed",
  SUBSCRIPTION_CREATED = "subscription_created",
  SUBSCRIPTION_CANCELLED = "subscription_cancelled",
  PAYMENT_RECEIVED = "payment_received",
  COMMISSION_PAID = "commission_paid",
  CONTRACT_SIGNED = "contract_signed"
}

export interface EmailConfig {
  enabled: boolean;
  fromEmail: string;
  fromName: string;
  signature?: string;
  logoUrl?: string;
}

export interface SmsConfig {
  enabled: boolean;
  fromNumber: string;
  signature?: string;
}

export interface NotificationRule {
  id: string;
  type: NotificationType;
  emailEnabled: boolean;
  emailTemplate: string;
  smsEnabled: boolean;
  smsTemplate: string;
  recipients: string[]; // Roles
}

export interface NotificationSettings {
  id: string;
  email: EmailConfig;
  sms: SmsConfig;
  rules: NotificationRule[];
}
