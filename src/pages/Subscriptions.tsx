import React, { useState, useEffect } from 'react';
import { SubscriptionPlan, SubscriptionInterval } from '@/types';
import { subscriptionPlanService } from '@/services/subscriptions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SubscriptionPlans from '@/components/subscriptions/SubscriptionPlans';

const Subscriptions: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      setIsLoading(true);
      try {
        const data = await subscriptionPlanService.getSubscriptionPlans();
        setPlans(data);
      } catch (error) {
        console.error("Erreur lors du chargement des plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();
  }, []);

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Plans d'abonnement</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un plan
        </Button>
      </div>

      <SubscriptionPlans 
        plans={plans} 
        onSelectPlan={handleSelectPlan} 
        loading={isLoading} 
      />

      {selectedPlan && (
        <div className="mt-8 p-4 border rounded-md">
          <h2 className="text-xl font-semibold">Détails du plan sélectionné</h2>
          <p>Nom: {selectedPlan.name}</p>
          <p>Description: {selectedPlan.description}</p>
          <p>Intervalle: {selectedPlan.interval}</p>
          <p>Prix: {selectedPlan.price}</p>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
