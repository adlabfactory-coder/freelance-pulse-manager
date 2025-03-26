
import React, { useState } from "react";
import { SubscriptionPlan } from "@/types";
import { useSubscriptionPlans } from "@/hooks/use-subscription-plans";
import { getSubscriptionPlans } from "@/services/subscriptions";
import { useToast } from "@/hooks/use-toast";

import SubscriptionHeader from "@/components/subscriptions/SubscriptionHeader";
import SubscriptionPlans from "@/components/subscriptions/SubscriptionPlans";
import SubscriptionFilters from "@/components/subscriptions/SubscriptionFilters";
import SubscriptionList from "@/components/subscriptions/SubscriptionList";

const SubscriptionsPage: React.FC = () => {
  const [selectedInterval, setSelectedInterval] = useState<string | null>(null);
  const { plans, isLoading } = useSubscriptionPlans();
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);

  // Filter plans based on selected interval
  const filteredPlans = selectedInterval
    ? plans.filter(plan => plan.interval === selectedInterval)
    : plans;

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    console.log("Plan selected:", plan);
    // Handle plan selection logic
    toast({
      title: "Plan sélectionné",
      description: `Vous avez sélectionné le plan "${plan.name}".`,
    });
  };

  const handleFilterChange = (interval: string | null) => {
    setSelectedInterval(interval);
  };

  return (
    <div className="space-y-8">
      <SubscriptionHeader />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <SubscriptionFilters
            selectedInterval={selectedInterval}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="md:col-span-2 space-y-6">
          <SubscriptionPlans
            plans={filteredPlans}
            onSelectPlan={handleSelectPlan}
            loading={isLoading}
          />

          <SubscriptionList
            subscriptions={subscriptions}
            loading={subscriptionsLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
