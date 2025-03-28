
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { fetchSubscriptionPlans } from '@/services/subscriptions';
import { SubscriptionPlan } from '@/types';
import { Loader2 } from 'lucide-react';
import PlanCard from '@/components/subscriptions/PlanCard';
import SubscriptionsList from '@/components/subscriptions/SubscriptionsList';
import SubscriptionFilters from '@/components/subscriptions/SubscriptionFilters';

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  loading: boolean;
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ plans, loading, onSelectPlan }) => {
  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activePlans = plans.filter(plan => plan.is_active || plan.isActive);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activePlans.map(plan => (
        <PlanCard key={plan.id} plan={plan} onSelect={() => onSelectPlan(plan)} />
      ))}
    </div>
  );
};

const Subscriptions: React.FC = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plans');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    async function loadPlans() {
      setLoading(true);
      try {
        const fetchedPlans = await fetchSubscriptionPlans();
        setPlans(fetchedPlans as SubscriptionPlan[]);
      } catch (error) {
        console.error('Error loading subscription plans', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Impossible de charger les plans d\'abonnement'
        });
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, [toast]);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    console.log('Selected plan:', plan);
    // Implémentation à venir : ouvrir un dialogue pour créer un abonnement
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Abonnements</h1>

      <Tabs defaultValue="plans" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <Card>
            <CardContent className="pt-6">
              <SubscriptionPlans 
                plans={plans} 
                loading={loading} 
                onSelectPlan={handleSelectPlan}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <div className="flex items-center justify-between mb-4">
            <SubscriptionFilters 
              filter={filter}
              onFilterChange={setFilter}
            />
            <Button>Nouvel abonnement</Button>
          </div>
          <SubscriptionsList 
            filter={filter}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Subscriptions;
