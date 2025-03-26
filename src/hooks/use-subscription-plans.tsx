import { useState, useEffect } from 'react';
import { SubscriptionPlan } from '@/types';
import { getSubscriptionPlans } from '@/services/supabase-subscription-service';
import { toast } from '@/components/ui/use-toast';

export const useSubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setIsLoading(true);
        const data = await getSubscriptionPlans();
        if (data.length === 0) {
          setError("Aucun plan d'abonnement trouvé.");
        } else {
          setPlans(data);
          setError(null);
        }
      } catch (err: any) {
        console.error("Erreur lors du chargement des plans:", err);
        setError("Impossible de charger les plans d'abonnement.");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les plans d'abonnement.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();
  }, []);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    // Vous pouvez ajouter une logique supplémentaire ici, 
    // comme ouvrir une modale, rediriger vers un formulaire d'inscription, etc.
  };

  return {
    plans,
    isLoading,
    error,
    selectedPlan,
    selectPlan: handleSelectPlan
  };
};
