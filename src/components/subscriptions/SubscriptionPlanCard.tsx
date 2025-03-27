
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription';
import { formatCurrency } from '@/utils/format';
import SubscriptionIntervalLabel from './SubscriptionIntervalLabel';

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  onSelect: () => void;
  isPopular?: boolean;
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  onSelect,
  isPopular = false,
}) => {
  // Helper function to get features array regardless of structure
  const getFeatures = (): string[] => {
    if (!plan.features) return [];
    
    if (Array.isArray(plan.features)) {
      return plan.features;
    }
    
    // Handle object with features property
    if (typeof plan.features === 'object' && 'features' in plan.features) {
      return plan.features.features;
    }
    
    return [];
  };

  return (
    <Card
      className={`flex flex-col ${
        isPopular ? 'border-primary shadow-lg' : ''
      }`}
    >
      {isPopular && (
        <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium rounded-t-lg">
          Option recommandée
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-2">
          <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
          <span className="text-muted-foreground ml-1">
            / <SubscriptionIntervalLabel interval={plan.interval} />
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {getFeatures().map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="text-green-500 h-5 w-5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onSelect}>
          Sélectionner
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionPlanCard;
