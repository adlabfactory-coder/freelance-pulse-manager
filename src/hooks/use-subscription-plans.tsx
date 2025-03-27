
import { useState, useEffect } from "react";
import { SubscriptionPlan } from "@/types/subscription";
import { useToast } from "./use-toast";
import { getSubscriptionPlans } from "@/services/supabase/subscriptions";

export const useSubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadPlans = async () => {
      setIsLoading(true);
      try {
        const plansData = await getSubscriptionPlans();
        console.log("Plans d'abonnement chargés:", plansData);
        setPlans(plansData);
      } catch (error) {
        console.error("Erreur lors du chargement des plans d'abonnement:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les plans d'abonnement. Veuillez réessayer plus tard."
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();
  }, [toast]);

  return { plans, isLoading };
};
