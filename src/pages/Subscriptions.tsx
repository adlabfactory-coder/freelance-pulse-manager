
import React from "react";
import SubscriptionHeader from "@/components/subscriptions/SubscriptionHeader";
import SubscriptionFilters from "@/components/subscriptions/SubscriptionFilters";
import SubscriptionList from "@/components/subscriptions/SubscriptionList";
import SubscriptionPlans from "@/components/subscriptions/SubscriptionPlans";
import { useSubscriptionPlans } from "@/hooks/use-subscription-plans";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

const Subscriptions: React.FC = () => {
  const { plans, isLoading, error, selectPlan } = useSubscriptionPlans();

  const handleSelectPlan = (plan) => {
    selectPlan(plan);
    toast({
      title: "Plan sélectionné",
      description: `Vous avez sélectionné le plan ${plan.name}.`,
    });
    // Ici, vous pourriez rediriger vers un formulaire d'inscription ou ouvrir une modale
  };

  return (
    <div className="space-y-6">
      <SubscriptionHeader />
      
      <Tabs defaultValue="plans">
        <TabsList className="mb-4">
          <TabsTrigger value="plans">Plans d'abonnement</TabsTrigger>
          <TabsTrigger value="subscriptions">Abonnements actifs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans">
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2">Nos plans d'abonnement</h2>
            <p className="text-muted-foreground mb-6">
              Choisissez le plan qui correspond le mieux à vos besoins
            </p>
            
            {error ? (
              <div className="text-center py-8 text-muted-foreground">
                {error}
              </div>
            ) : (
              <SubscriptionPlans 
                plans={plans} 
                onSelectPlan={handleSelectPlan} 
                isLoading={isLoading} 
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="subscriptions">
          <SubscriptionFilters />
          <SubscriptionList subscriptions={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Subscriptions;
