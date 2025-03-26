
import { supabase } from "@/lib/supabase";
import { 
  NotificationSettings, 
  EmailConfig, 
  SmsConfig,
  NotificationType,
  NotificationRule
} from "@/types/notification-settings";

// Default notification settings
const defaultEmailConfig: EmailConfig = {
  enabled: false,
  fromEmail: "",
  fromName: "AdLab Hub",
  signature: "L'équipe AdLab Hub",
  logoUrl: ""
};

const defaultSmsConfig: SmsConfig = {
  enabled: false,
  fromNumber: "",
  signature: "AdLab Hub"
};

const defaultNotificationRules: NotificationRule[] = [
  {
    id: "1",
    type: NotificationType.APPOINTMENT_CREATED,
    emailEnabled: true,
    smsEnabled: false,
    recipients: ["admin", "superadmin", "account_manager"],
    emailTemplate: "<h1>Nouveau rendez-vous créé</h1><p>Un nouveau rendez-vous a été créé par {{freelancerName}} pour le {{appointmentDate}}.</p>",
    smsTemplate: "Nouveau RDV: {{freelancerName}} a créé un RDV pour le {{appointmentDate}}."
  },
  {
    id: "2",
    type: NotificationType.APPOINTMENT_REMINDER,
    emailEnabled: true,
    smsEnabled: true,
    recipients: ["admin", "superadmin", "account_manager", "freelancer"],
    emailTemplate: "<h1>Rappel de rendez-vous</h1><p>Vous avez un rendez-vous demain à {{appointmentTime}}.</p>",
    smsTemplate: "Rappel: Vous avez un RDV demain à {{appointmentTime}}."
  }
];

// Default settings object
const defaultSettings: NotificationSettings = {
  id: "default",
  email: defaultEmailConfig,
  sms: defaultSmsConfig,
  rules: defaultNotificationRules
};

// Get notification settings
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const { data, error } = await supabase
      .from("notification_settings")
      .select("*")
      .single();

    if (error) {
      console.error("Error fetching notification settings:", error);
      return defaultSettings;
    }

    return data || defaultSettings;
  } catch (error) {
    console.error("Unexpected error fetching notification settings:", error);
    return defaultSettings;
  }
};

// Update notification settings
export const updateNotificationSettings = async (settings: NotificationSettings): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("notification_settings")
      .upsert({
        id: settings.id || "default",
        email: settings.email,
        sms: settings.sms,
        rules: settings.rules
      });

    if (error) {
      console.error("Error updating notification settings:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error updating notification settings:", error);
    return false;
  }
};

// Send email notification
export const sendEmailNotification = async (
  to: string,
  subject: string,
  html: string,
  from?: string,
  fromName?: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke("send-email", {
      body: { to, subject, html, from, fromName }
    });

    if (error) {
      console.error("Error sending email notification:", error);
      return false;
    }

    return data?.success || false;
  } catch (error) {
    console.error("Unexpected error sending email notification:", error);
    return false;
  }
};

// Send SMS notification
export const sendSmsNotification = async (
  to: string,
  body: string,
  from?: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke("send-sms", {
      body: { to, body, from }
    });

    if (error) {
      console.error("Error sending SMS notification:", error);
      return false;
    }

    return data?.success || false;
  } catch (error) {
    console.error("Unexpected error sending SMS notification:", error);
    return false;
  }
};

// Process notification for an event
export const processNotification = async (
  type: NotificationType,
  data: Record<string, any>,
  recipients: { email: string, phone?: string, role: string }[]
): Promise<boolean> => {
  try {
    // Get notification settings
    const settings = await getNotificationSettings();
    
    // Find the rule for this notification type
    const rule = settings.rules.find(r => r.type === type);
    
    if (!rule) {
      console.log(`No notification rule found for type: ${type}`);
      return false;
    }
    
    // Filter recipients based on roles in the rule
    const eligibleRecipients = recipients.filter(r => 
      rule.recipients.includes(r.role.toLowerCase())
    );
    
    if (eligibleRecipients.length === 0) {
      console.log(`No eligible recipients found for notification type: ${type}`);
      return true; // Return true as this is not an error
    }
    
    const results: boolean[] = [];
    
    // Process email notifications
    if (rule.emailEnabled && settings.email.enabled) {
      const template = rule.emailTemplate;
      // Replace placeholders in the template
      const processedHtml = processTemplate(template, data);
      
      // Send email to each recipient
      for (const recipient of eligibleRecipients) {
        if (recipient.email) {
          const result = await sendEmailNotification(
            recipient.email,
            `Notification: ${type}`,
            processedHtml,
            settings.email.fromEmail,
            settings.email.fromName
          );
          results.push(result);
        }
      }
    }
    
    // Process SMS notifications
    if (rule.smsEnabled && settings.sms.enabled) {
      const template = rule.smsTemplate;
      // Replace placeholders in the template
      const processedText = processTemplate(template, data);
      
      // Send SMS to each recipient
      for (const recipient of eligibleRecipients) {
        if (recipient.phone) {
          const result = await sendSmsNotification(
            recipient.phone,
            processedText,
            settings.sms.fromNumber
          );
          results.push(result);
        }
      }
    }
    
    // Return true if all notifications were sent successfully
    return results.length > 0 && results.every(r => r);
  } catch (error) {
    console.error("Error processing notification:", error);
    return false;
  }
};

// Process template by replacing placeholders with actual data
const processTemplate = (template: string, data: Record<string, any>): string => {
  let result = template;
  
  // Replace all {{key}} placeholders with corresponding values
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(placeholder, String(value));
  });
  
  return result;
};
