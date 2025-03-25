
import React from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubscriptionPlan } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/utils/format";

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  onSelectPlan: (plan: SubscriptionPlan) => void;
  isLoading?: boolean;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  plans, 
  onSelectPlan,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="flex flex-col h-full border-2 border-muted animate-pulse">
            <div className="h-64"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`flex flex-col h-full border-2 ${
            plan.code === 'advanced' ? 'border-primary' : 'border-muted'
          }`}
        >
          <CardHeader className="pb-2">
            {plan.code === 'advanced' && (
              <Badge className="self-start mb-2">Recommandé</Badge>
            )}
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2 flex-1">
            <div className="text-4xl font-bold mb-4">
              {formatMoney(plan.price)} MAD
              <span className="text-sm font-normal text-muted-foreground ml-1">
                par mois
              </span>
            </div>
            <ul className="space-y-2">
              {plan.features.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="pt-2">
            <Button 
              onClick={() => onSelectPlan(plan)} 
              className="w-full"
              variant={plan.code === 'advanced' ? 'default' : 'outline'}
            >
              Sélectionner
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionPlans;
