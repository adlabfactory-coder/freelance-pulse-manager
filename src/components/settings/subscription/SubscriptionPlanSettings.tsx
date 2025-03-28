
import React, { useState, useEffect } from 'react';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Loader2 } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription';
import { fetchSubscriptionPlans } from '@/services/subscriptions';
import SubscriptionPlanForm from './SubscriptionPlanForm';
import SubscriptionPlansTable from './SubscriptionPlansTable';

const SubscriptionPlanSettings: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const { toast } = useToast();

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await fetchSubscriptionPlans();
      setPlans(data);
    } catch (error) {
      console.error('Erreur lors du chargement des plans:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les plans d\'abonnement'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleSuccess = () => {
    loadPlans();
    setShowForm(false);
    setEditingPlan(null);
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setShowForm(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Plans d'abonnement</CardTitle>
            <CardDescription>Gérez les formules d'abonnement proposées aux clients</CardDescription>
          </div>
          <Button onClick={() => {
            setEditingPlan(null);
            setShowForm(!showForm);
          }}>
            {showForm && !editingPlan ? (
              'Annuler'
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un plan
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <SubscriptionPlanForm 
            plan={editingPlan}
            onSuccess={handleSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingPlan(null);
            }}
          />
        ) : loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <SubscriptionPlansTable plans={plans} onEdit={handleEdit} onRefresh={loadPlans} />
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionPlanSettings;
