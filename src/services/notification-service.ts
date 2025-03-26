
import { supabase } from "@/lib/supabase";
import { EmailConfig, NotificationType, NotificationSettings, SmsConfig, NotificationRule } from "@/types/notification-settings";

// Structure de données pour les variables de template
export interface NotificationTemplateData {
  [key: string]: string | number | boolean | undefined;
}

// Fonction pour remplacer les variables dans un template
export function replaceTemplateVariables(template: string, data: NotificationTemplateData): string {
  let result = template;
  
  // Remplacer toutes les variables {{variable}} par leur valeur
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value || ''));
  });
  
  return result;
}

// Fonction pour envoyer un email via l'Edge Function de Supabase
export async function sendEmail(to: string, subject: string, html: string, from?: string, fromName?: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, html, from, fromName }
    });
    
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur inattendue lors de l\'envoi de l\'email:', error);
    return false;
  }
}

// Fonction pour envoyer un SMS via l'Edge Function de Supabase
export async function sendSms(to: string, body: string, from?: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: { to, body, from }
    });
    
    if (error) {
      console.error('Erreur lors de l\'envoi du SMS:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur inattendue lors de l\'envoi du SMS:', error);
    return false;
  }
}

// Fonction pour récupérer les paramètres de notification
export async function getNotificationSettings(): Promise<NotificationSettings | null> {
  try {
    // Récupérer les paramètres depuis la base de données
    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .single();
    
    if (error) {
      console.error('Erreur lors de la récupération des paramètres de notification:', error);
      return null;
    }
    
    return data as NotificationSettings;
  } catch (error) {
    console.error('Erreur inattendue lors de la récupération des paramètres de notification:', error);
    return null;
  }
}

// Fonction pour sauvegarder les paramètres de notification
export async function saveNotificationSettings(settings: NotificationSettings): Promise<boolean> {
  try {
    // Vérifier si un enregistrement existe déjà
    const { data: existingData, error: checkError } = await supabase
      .from('notification_settings')
      .select('id')
      .single();
    
    let result;
    
    if (existingData) {
      // Mettre à jour l'enregistrement existant
      const { error } = await supabase
        .from('notification_settings')
        .update(settings)
        .eq('id', existingData.id);
      
      if (error) throw error;
      result = true;
    } else {
      // Créer un nouvel enregistrement
      const { error } = await supabase
        .from('notification_settings')
        .insert([settings]);
      
      if (error) throw error;
      result = true;
    }
    
    return result;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres de notification:', error);
    return false;
  }
}

// Interface pour les destinataires
interface NotificationRecipient {
  email: string;
  role: string;
}

// Fonction pour traiter et envoyer une notification
export async function processNotification(
  type: NotificationType,
  data: NotificationTemplateData,
  recipients: NotificationRecipient[]
): Promise<boolean> {
  try {
    // Récupérer les paramètres de notification
    const settings = await getNotificationSettings();
    
    if (!settings) {
      console.warn('Paramètres de notification non configurés. Notification non envoyée.');
      return false;
    }
    
    // Trouver la règle correspondant au type de notification
    const rule = settings.rules.find(r => r.type === type);
    
    if (!rule) {
      console.warn(`Aucune règle de notification trouvée pour le type: ${type}`);
      return false;
    }
    
    // Filtrer les destinataires selon les rôles autorisés dans la règle
    const validRecipients = recipients.filter(r => rule.recipients.includes(r.role));
    
    // Si aucun destinataire valide, ne pas envoyer de notification
    if (validRecipients.length === 0) {
      console.warn('Aucun destinataire valide pour cette notification.');
      return false;
    }
    
    // Variables pour suivre le statut d'envoi
    let emailSuccess = true;
    let smsSuccess = true;
    
    // Envoyer des emails si activés
    if (rule.emailEnabled && settings.email.enabled) {
      const emailText = replaceTemplateVariables(rule.emailTemplate, data);
      
      // Déduire le sujet de l'email (première ligne du template)
      const emailLines = emailText.split('\n');
      const subject = emailLines[0].trim();
      const htmlContent = emailLines.slice(1).join('\n');
      
      // Envoyer l'email à chaque destinataire
      for (const recipient of validRecipients) {
        const sent = await sendEmail(
          recipient.email,
          subject,
          htmlContent,
          settings.email.fromEmail,
          settings.email.fromName
        );
        
        if (!sent) emailSuccess = false;
      }
    }
    
    // Envoyer des SMS si activés et si les numéros de téléphone sont disponibles
    if (rule.smsEnabled && settings.sms.enabled) {
      const smsText = replaceTemplateVariables(rule.smsTemplate, data);
      
      // Pour le SMS, nous aurions besoin d'une façon d'obtenir les numéros de téléphone des destinataires
      // Cela pourrait être ajouté dans une implémentation future
    }
    
    return emailSuccess && smsSuccess;
  } catch (error) {
    console.error('Erreur lors du traitement de la notification:', error);
    return false;
  }
}
