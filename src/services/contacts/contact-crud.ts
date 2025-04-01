
import { contactOperationsService } from './contact-operations';
import { contactCreateUpdateService } from './contact-create-update';
import { sanitizeUrl, isValidUrl } from '@/utils/url-utils';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

export const contactCrudService = {
  ...contactOperationsService,
  ...contactCreateUpdateService,
  
  async linkSubscriptionPlan(contactId: string, subscriptionPlanId: string): Promise<boolean> {
    if (!contactId || !subscriptionPlanId) {
      toast.error("Données incomplètes", {
        description: "L'ID du contact ou du plan d'abonnement est manquant.",
      });
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ subscription_plan_id: subscriptionPlanId })
        .eq('id', contactId);
      
      if (error) {
        throw error;
      }
      
      toast.success("Plan d'abonnement lié", {
        description: "Le plan d'abonnement a été lié avec succès au contact.",
      });
      
      return true;
    } catch (error: any) {
      console.error(`Erreur lors de la liaison du plan d'abonnement au contact ${contactId}:`, error);
      
      toast.error("Erreur", {
        description: `Impossible de lier le plan d'abonnement au contact: ${error.message || 'Erreur inconnue'}`,
      });
      
      return false;
    }
  },
  
  validateContactWebsite(url: string | null | undefined): string {
    if (!url) return '';
    
    const sanitizedUrl = sanitizeUrl(url);
    if (!sanitizedUrl) return '';
    
    const formattedUrl = sanitizedUrl.startsWith('http') 
      ? sanitizedUrl 
      : `https://${sanitizedUrl}`;
      
    if (!isValidUrl(formattedUrl)) {
      return '';
    }
    
    return formattedUrl;
  }
};

// Export des fonctions pour rétrocompatibilité
export const getContacts = contactOperationsService.getContacts;
export const getContactById = contactOperationsService.getContactById;
export const addContact = contactCreateUpdateService.addContact;
export const deleteContact = contactOperationsService.deleteContact;
export const updateContact = contactOperationsService.updateContact;
export const linkSubscriptionPlan = contactCrudService.linkSubscriptionPlan;
export const validateContactWebsite = contactCrudService.validateContactWebsite;
