
import React from "react";
import { SubscriptionPlan } from "@/types";
import SubscriptionPlanCard from "./SubscriptionPlanCard";

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  onSelectPlan: (plan: SubscriptionPlan) => void;
  loading?: boolean;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  plans,
  onSelectPlan,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[400px] rounded-lg bg-muted/50 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!plans.length) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Aucun plan d'abonnement disponible</h3>
        <p className="text-muted-foreground mt-2">
          Aucun plan d'abonnement n'a été configuré pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan, index) => (
        <SubscriptionPlanCard
          key={plan.id}
          plan={plan}
          onSelectPlan={onSelectPlan}
          popular={index === 1} // Marque le deuxième plan comme populaire
        />
      ))}
    </div>
  );
};

export default SubscriptionPlans;
