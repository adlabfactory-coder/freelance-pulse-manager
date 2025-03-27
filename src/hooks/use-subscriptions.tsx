
import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { Subscription, SubscriptionStatus, SubscriptionInterval } from "@/types/subscription";
import { toast } from "@/components/ui/use-toast";

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = useSupabase();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      setError(null);

      try {
        // Remplacez cela par un appel réel à Supabase si vous avez une table subscriptions
        // Pour le moment, utilisez des données de démo pour éviter les erreurs
        const mockSubscriptions: Subscription[] = [
          {
            id: "1",
            name: "Plan Basique",
            description: "Forfait de base pour les petites entreprises",
            price: 5000,
            interval: SubscriptionInterval.MONTHLY,
            clientId: "client-1",
            clientName: "Client Demo",
            freelancerId: "freelancer-1",
            freelancerName: "Commercial Demo",
            status: SubscriptionStatus.ACTIVE,
            startDate: new Date(2023, 0, 15),
            renewalDate: new Date(2023, 1, 15)
          },
          {
            id: "2",
            name: "Plan Premium",
            description: "Forfait avancé avec fonctionnalités supplémentaires",
            price: 12000,
            interval: SubscriptionInterval.MONTHLY,
            clientId: "client-2",
            clientName: "Client Enterprise",
            freelancerId: "freelancer-1",
            freelancerName: "Commercial Demo",
            status: SubscriptionStatus.ACTIVE,
            startDate: new Date(2023, 1, 5),
            renewalDate: new Date(2023, 2, 5)
          }
        ];

        setSubscriptions(mockSubscriptions);
      } catch (err) {
        console.error("Erreur lors de la récupération des abonnements:", err);
        setError(err as Error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les abonnements.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [supabase]);

  return {
    subscriptions,
    loading,
    error,
    isLoading: loading // Ajout d'un alias pour compatibilité
  };
};
