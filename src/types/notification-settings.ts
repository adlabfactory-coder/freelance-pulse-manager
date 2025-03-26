
export interface EmailConfig {
  enabled: boolean;
  fromEmail: string;
  fromName: string;
  signature: string;
  logoUrl: string;
}

export interface SmsConfig {
  enabled: boolean;
  fromNumber: string;
  signature: string;
}

export enum NotificationType {
  APPOINTMENT_CREATED = "appointment_created",
  APPOINTMENT_UPDATED = "appointment_updated",
  APPOINTMENT_REMINDER = "appointment_reminder",
  QUOTE_CREATED = "quote_created",
  QUOTE_ACCEPTED = "quote_accepted",
  QUOTE_REJECTED = "quote_rejected",
  COMMISSION_PAID = "commission_paid",
  SUBSCRIPTION_CREATED = "subscription_created",
  SUBSCRIPTION_RENEWED = "subscription_renewed",
  SUBSCRIPTION_CANCELLED = "subscription_cancelled"
}

export interface NotificationRule {
  id: string;
  type: NotificationType;
  emailEnabled: boolean;
  smsEnabled: boolean;
  recipients: string[]; // admin, superadmin, account_manager, freelancer, client
  emailTemplate: string;
  smsTemplate: string;
}

export interface NotificationSettings {
  id: string;
  email: EmailConfig;
  sms: SmsConfig;
  rules: NotificationRule[];
}
