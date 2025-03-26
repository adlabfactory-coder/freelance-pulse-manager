
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SubscriptionPlan, SubscriptionInterval } from "@/types";
import SubscriptionIntervalLabel from "./SubscriptionIntervalLabel";
import { formatCurrency } from "@/utils/format";

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  onSelectPlan: (plan: SubscriptionPlan) => void;
  loading: boolean;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  plans, 
  onSelectPlan, 
  loading 
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Plans d'abonnement</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-36 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Aucun plan d'abonnement disponible.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Plans d'abonnement</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card key={plan.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <SubscriptionIntervalLabel interval={plan.interval} />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">{formatCurrency(plan.price)}</div>
              <div className="space-y-2 text-sm">
                {plan.description && <p>{plan.description}</p>}
                {plan.features && typeof plan.features === 'object' && Array.isArray(plan.features) ? 
                  plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="mr-2">✓</span> {feature}
                    </div>
                  ))
                  : plan.features && typeof plan.features === 'object' ? 
                    Object.entries(plan.features).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <span className="mr-2">✓</span> {key}: {String(value)}
                      </div>
                    ))
                    : null
                }
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => onSelectPlan(plan)} className="w-full">
                Sélectionner
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
