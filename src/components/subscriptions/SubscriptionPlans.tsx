
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { SubscriptionPlan } from "@/types/subscription";

export interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  loading: boolean;
  onSelectPlan?: (plan: SubscriptionPlan) => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ plans, loading, onSelectPlan }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Aucun plan d'abonnement disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {plans.map((plan) => (
        <Card key={plan.id} className={plan.isActive ? "border-primary shadow-md" : ""}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </div>
              {plan.isActive && (
                <Badge variant="default" className="bg-primary/80">Populaire</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="text-3xl font-bold">{plan.price}€</span>
                <span className="text-muted-foreground ml-1">{plan.interval === "monthly" ? "/mois" : "/an"}</span>
              </div>
              <ul className="space-y-2 text-sm">
                {Array.isArray(plan.features) ? 
                  plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  )) : 
                  plan.features && Array.isArray(plan.features.features) && 
                  plan.features.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))
                }
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant={plan.isActive ? "default" : "outline"} 
              className="w-full"
              onClick={() => onSelectPlan && onSelectPlan(plan)}
            >
              Choisir ce plan
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionPlans;
