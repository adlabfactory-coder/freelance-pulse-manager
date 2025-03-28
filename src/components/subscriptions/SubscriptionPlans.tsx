
import React from 'react';
import { SubscriptionPlan } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/format';
import SubscriptionIntervalLabel from './SubscriptionIntervalLabel';

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  loading: boolean;
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  plans, 
  loading,
  onSelectPlan 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg shadow-sm p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-12 w-1/2 mb-6" />
            <div className="space-y-2 mb-6">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full mt-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex justify-center items-center p-12">
        <p className="text-muted-foreground text-center">
          Aucun plan d'abonnement disponible.
        </p>
      </div>
    );
  }

  // Fonction pour obtenir les fonctionnalités à partir du plan
  const getPlanFeatures = (plan: SubscriptionPlan): string[] => {
    if (!plan.features) return [];
    
    if (Array.isArray(plan.features)) {
      return plan.features;
    }
    
    if (typeof plan.features === 'object' && plan.features.features && Array.isArray(plan.features.features)) {
      return plan.features.features;
    }
    
    return [];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {plans.map((plan) => (
        <div 
          key={plan.id} 
          className="border rounded-lg shadow-sm p-6 flex flex-col h-full hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium mb-2">{plan.name}</h3>
          <div className="mb-4">
            <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
            <span className="text-muted-foreground">/{' '}<SubscriptionIntervalLabel interval={plan.interval} /></span>
          </div>
          
          <p className="text-muted-foreground mb-6">{plan.description}</p>
          
          <div className="space-y-2 mb-6 flex-grow">
            {getPlanFeatures(plan).map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={() => onSelectPlan(plan)} 
            className="w-full mt-auto"
          >
            Sélectionner ce plan
          </Button>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionPlans;
