
import { useState, useEffect } from "react";
import { Subscription } from "@/types";
import { useToast } from "./use-toast";
import { useAuth } from "./use-auth";
import { 
  getAllSubscriptions, 
  getSubscriptionsByFreelancer 
} from "@/services/supabase/subscriptions";

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, isAdmin, isFreelancer } = useAuth();

  useEffect(() => {
    const loadSubscriptions = async () => {
      setIsLoading(true);
      try {
        let subscriptionsData: Subscription[] = [];
        
        if (isAdmin) {
          // Les administrateurs peuvent voir tous les abonnements
          subscriptionsData = await getAllSubscriptions();
        } else if (isFreelancer && user?.id) {
          // Les freelances ne voient que leurs propres abonnements
          subscriptionsData = await getSubscriptionsByFreelancer(user.id);
        }
        
        setSubscriptions(subscriptionsData);
      } catch (error) {
        console.error("Erreur lors du chargement des abonnements:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les abonnements. Veuillez réessayer plus tard."
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscriptions();
  }, [toast, user, isAdmin, isFreelancer]);

  return { subscriptions, isLoading };
};
