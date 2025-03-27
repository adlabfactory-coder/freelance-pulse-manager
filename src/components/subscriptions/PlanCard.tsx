
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SubscriptionPlan, SubscriptionInterval } from '@/types/subscription';
import SubscriptionIntervalLabel from './SubscriptionIntervalLabel';

interface PlanCardProps {
  plan: SubscriptionPlan;
  onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect }) => {
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  // Parse features
  const getFeatures = () => {
    if (!plan.features) return [];
    
    if (typeof plan.features === 'string') {
      try {
        return JSON.parse(plan.features);
      } catch {
        return [];
      }
    }
    
    return Array.isArray(plan.features) ? plan.features : [];
  };

  const features = getFeatures();

  return (
    <Card className="flex flex-col h-full shadow hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-3xl font-bold mb-2">
          {formatPrice(plan.price)} 
          <span className="text-sm font-normal text-muted-foreground">
            /<SubscriptionIntervalLabel interval={plan.interval} />
          </span>
        </div>
        
        <div className="text-muted-foreground mb-6">{plan.description}</div>
        
        {features.length > 0 && (
          <ul className="space-y-2">
            {features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onSelect}>Sélectionner</Button>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
