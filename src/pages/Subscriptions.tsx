
import React, { useState, useEffect } from "react";
import { useSubscriptionPlans } from "@/hooks/use-subscription-plans";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionPlan } from "@/types";

import SubscriptionHeader from "@/components/subscriptions/SubscriptionHeader";
import SubscriptionPlans from "@/components/subscriptions/SubscriptionPlans";
import SubscriptionList from "@/components/subscriptions/SubscriptionList";

const SubscriptionsPage: React.FC = () => {
  const { plans, isLoading: plansLoading } = useSubscriptionPlans();
  const { subscriptions, loading: subscriptionsLoading } = useSubscriptions();
  const { toast } = useToast();
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Limite à un seul chargement
  useEffect(() => {
    if (!dataLoaded) {
      console.log("Chargement initial des abonnements");
      // Les données se chargent déjà via les hooks useSubscriptionPlans et useSubscriptions
      setDataLoaded(true);
    }
  }, [dataLoaded]);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    console.log("Plan sélectionné:", plan);
    // Handle plan selection logic
    toast({
      title: "Plan sélectionné",
      description: `Vous avez sélectionné le plan "${plan.name}".`,
    });
  };

  return (
    <div className="space-y-8">
      <SubscriptionHeader />

      <div className="space-y-6">
        <SubscriptionPlans
          plans={plans}
          onSelectPlan={handleSelectPlan}
          loading={plansLoading}
        />

        <SubscriptionList
          subscriptions={subscriptions}
          loading={subscriptionsLoading}
        />
      </div>
    </div>
  );
};

export default SubscriptionsPage;
