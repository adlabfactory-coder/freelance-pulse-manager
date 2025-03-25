
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: string;
}

interface ContactSubscriptionSelectorProps {
  contactId: string;
  subscriptionPlanId?: string;
  plans: SubscriptionPlan[];
  isLoading: boolean;
  onSubscriptionPlanChange: (planId: string) => Promise<void>;
}

const ContactSubscriptionSelector: React.FC<ContactSubscriptionSelectorProps> = ({
  contactId,
  subscriptionPlanId,
  plans,
  isLoading,
  onSubscriptionPlanChange,
}) => {
  const selectedPlan = plans.find(p => p.id === subscriptionPlanId);

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-3">Plan d'abonnement</h3>
      {isLoading ? (
        <p>Chargement des plans...</p>
      ) : (
        <Select
          value={subscriptionPlanId}
          onValueChange={onSubscriptionPlanChange}
        >
          <SelectTrigger className="w-full md:w-72">
            <SelectValue placeholder="Sélectionner un plan d'abonnement" />
          </SelectTrigger>
          <SelectContent>
            {plans.map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.name} - {plan.price}€ / {plan.interval}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {selectedPlan && (
        <div className="mt-2">
          <Badge className="bg-primary text-primary-foreground">
            {selectedPlan.name} - {selectedPlan.price}€
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ContactSubscriptionSelector;
