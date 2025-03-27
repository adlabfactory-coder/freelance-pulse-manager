
/**
 * Main contact service file that re-exports all functionality from specialized services
 */
import { contactOperationsService } from './contact-operations';
import { contactCreateUpdateService } from './contact-create-update';
import { sanitizeUrl, isValidUrl } from '@/utils/url-utils';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

/**
 * Service pour la gestion des contacts - regroupe toutes les fonctionnalités
 */
export const contactCrudService = {
  ...contactOperationsService,
  ...contactCreateUpdateService,
  
  /**
   * Lie un plan d'abonnement à un contact
   */
  async linkSubscriptionPlan(contactId: string, subscriptionPlanId: string): Promise<boolean> {
    // Validation des entrées
    if (!contactId || !subscriptionPlanId) {
      console.error("linkSubscriptionPlan: ID de contact ou de plan d'abonnement manquant");
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
        console.error(`Erreur lors de la liaison du plan d'abonnement au contact ${contactId}:`, error);
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
  
  /**
   * Valide et sanitize une URL de site web de contact
   */
  validateContactWebsite(url: string | null | undefined): string {
    if (!url) return '';
    
    const sanitizedUrl = sanitizeUrl(url);
    if (!sanitizedUrl) return '';
    
    // Ajouter le protocole si nécessaire
    const formattedUrl = sanitizedUrl.startsWith('http') 
      ? sanitizedUrl 
      : `https://${sanitizedUrl}`;
      
    // Vérifier si l'URL est valide
    if (!isValidUrl(formattedUrl)) {
      console.warn("URL de site web de contact invalide:", url);
      return '';
    }
    
    return formattedUrl;
  }
};

// Pour rétrocompatibilité, on expose aussi les fonctions individuellement
export const getContacts = contactCrudService.getContacts;
export const addContact = contactCreateUpdateService.addContact;
export const getContactById = contactCrudService.getContactById;
export const deleteContact = contactCrudService.deleteContact;
export const updateContact = contactCrudService.updateContact;
export const linkSubscriptionPlan = contactCrudService.linkSubscriptionPlan;
export const validateContactWebsite = contactCrudService.validateContactWebsite;
