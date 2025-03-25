
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

export const contactSubscriptionService = {
  async linkSubscriptionPlan(contactId: string, subscriptionPlanId: string) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update({
          subscription_plan_id: subscriptionPlanId,
          updatedAt: new Date().toISOString()
        })
        .eq('id', contactId)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success("Plan d'abonnement lié", {
        description: "Le plan d'abonnement a été associé au contact",
      });
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la liaison du plan d'abonnement au contact ${contactId}:`, error);
      toast.error("Erreur", {
        description: "Impossible de lier le plan d'abonnement",
      });
      return null;
    }
  }
};
