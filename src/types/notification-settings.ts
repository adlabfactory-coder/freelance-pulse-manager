export enum NotificationType {
  LEAD_CREATED = "lead_created",
  LEAD_CONVERTED = "lead_converted",
  QUOTE_CREATED = "quote_created",
  QUOTE_ACCEPTED = "quote_accepted",
  APPOINTMENT_CREATED = "appointment_created",
  APPOINTMENT_PENDING_ASSIGNMENT = "appointment_pending_assignment",
  SUBSCRIPTION_RENEWED = "subscription_renewed",
  PAYMENT_RECEIVED = "payment_received",
  CONTRACT_SIGNED = "contract_signed"
}

export interface EmailConfig {
  enabled: boolean;
  fromEmail: string;
  fromName: string;
}

export interface SmsConfig {
  enabled: boolean;
  fromNumber: string;
}

export interface NotificationRule {
  type: NotificationType;
  emailEnabled: boolean;
  emailTemplate: string;
  smsEnabled: boolean;
  smsTemplate: string;
  recipients: string[]; // Roles
}

export interface NotificationSettings {
  email: EmailConfig;
  sms: SmsConfig;
  rules: NotificationRule[];
}
