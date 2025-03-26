
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronRight } from "lucide-react";
import { SubscriptionPlan } from '@/types';
import SubscriptionIntervalLabel from './SubscriptionIntervalLabel';

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  onSelectPlan?: (plan: SubscriptionPlan) => void;
  selectedPlanId?: string;
  showActionButton?: boolean;
  actionButtonText?: string;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  plans,
  onSelectPlan,
  selectedPlanId,
  showActionButton = true,
  actionButtonText = "Sélectionner"
}) => {
  if (!plans || plans.length === 0) {
    return <div className="text-center py-8">Aucun plan d'abonnement disponible</div>;
  }

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (onSelectPlan) {
      onSelectPlan(plan);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`flex flex-col ${selectedPlanId === plan.id ? 'border-primary ring-1 ring-primary' : ''}`}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </div>
              <Badge variant="outline" className="ml-2">
                <SubscriptionIntervalLabel interval={plan.interval} />
              </Badge>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold">{plan.price}€</span>
              <span className="text-muted-foreground">/{plan.interval.toLowerCase()}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {plan.features && Array.isArray(plan.features.features) && plan.features.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="text-green-500 mr-2 h-5 w-5 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {showActionButton && (
              <Button 
                onClick={() => handleSelectPlan(plan)} 
                className="w-full"
                variant={selectedPlanId === plan.id ? "default" : "outline"}
              >
                {actionButtonText}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionPlans;
