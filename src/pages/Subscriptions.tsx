
import React, { useState, useEffect } from "react";
import { SubscriptionPlan } from "@/types/subscription";
import { fetchSubscriptionPlans } from "@/services/subscriptions";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SubscriptionPlans from "@/components/subscriptions/SubscriptionPlans";
import SubscriptionsList from "@/components/subscriptions/SubscriptionsList";
import AgencyServicesList from "@/components/subscriptions/AgencyServicesList";
import { useAuth } from "@/hooks/use-auth";
import SubscriptionPlanSettings from "@/components/settings/subscription/SubscriptionPlanSettings";

const Subscriptions: React.FC = () => {
  const { toast } = useToast();
  const { isAdminOrSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("plans");
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      try {
        const data = await fetchSubscriptionPlans();
        if (data) {
          setPlans(data);
        }
      } catch (error) {
        console.error('Error loading subscription plans:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les plans d\'abonnement',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    toast({
      title: "Plan sélectionné",
      description: `Vous avez sélectionné le plan ${plan.name}`,
    });
    // Logic for plan selection
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Abonnements</h2>
        <p className="text-muted-foreground">
          Gérez les plans d'abonnement et suivez les abonnements actifs.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Plans d'abonnement</TabsTrigger>
          <TabsTrigger value="subscriptions">Abonnements actifs</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          {isAdminOrSuperAdmin && (
            <TabsTrigger value="settings" className="flex items-center gap-1">
              Paramètres <Badge variant="outline" className="ml-1 px-1">Admin</Badge>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plans d'abonnement disponibles</CardTitle>
              <CardDescription>
                Choisissez parmi nos différents plans d'abonnement
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <SubscriptionPlans 
                plans={plans} 
                loading={loading} 
                onSelectPlan={handleSelectPlan} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Abonnements</CardTitle>
              <CardDescription>
                Liste de tous les abonnements actifs et expirés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <AgencyServicesList />
        </TabsContent>

        {isAdminOrSuperAdmin && (
          <TabsContent value="settings" className="space-y-4">
            <SubscriptionPlanSettings />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Subscriptions;
