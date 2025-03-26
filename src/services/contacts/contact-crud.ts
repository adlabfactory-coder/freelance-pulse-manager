
/**
 * Main contact service file that re-exports all functionality from specialized services
 */
import { contactOperationsService } from './contact-operations';
import { addContact, updateContact, contactCreateUpdateService } from './contact-create-update';

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
        description: `Impossible de lier le plan d'abonnement au contact: ${error.message}`,
      });
      
      return false;
    }
  }
};

// Add missing import for supabase and toast
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

// Pour rétrocompatibilité, on expose aussi les fonctions individuellement
export const getContacts = contactCrudService.getContacts;
export const addContact = contactCrudService.addContact;
export const getContactById = contactCrudService.getContactById;
export const deleteContact = contactCrudService.deleteContact;
export const updateContact = contactCrudService.updateContact;
export const linkSubscriptionPlan = contactCrudService.linkSubscriptionPlan;
