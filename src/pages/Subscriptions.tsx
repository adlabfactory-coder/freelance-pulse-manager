
import React, { useState } from "react";
import { SubscriptionPlan } from "@/types";
import { useSubscriptionPlans } from "@/hooks/use-subscription-plans";
import { getSubscriptionPlans } from "@/services/subscriptions";
import { useToast } from "@/hooks/use-toast";

import SubscriptionHeader from "@/components/subscriptions/SubscriptionHeader";
import SubscriptionPlans from "@/components/subscriptions/SubscriptionPlans";
import SubscriptionList from "@/components/subscriptions/SubscriptionList";

const SubscriptionsPage: React.FC = () => {
  const { plans, isLoading } = useSubscriptionPlans();
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    console.log("Plan selected:", plan);
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
          loading={isLoading}
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
