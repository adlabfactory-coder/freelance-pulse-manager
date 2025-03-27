import React, { useState, useEffect } from "react";
import { useSubscriptionPlans } from "@/hooks/use-subscription-plans";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionPlan } from "@/types";
import { fetchServices } from "@/services/services-service";
import { Service } from "@/types/service";
import { formatCurrency } from "@/utils/format";

import SubscriptionHeader from "@/components/subscriptions/SubscriptionHeader";
import SubscriptionPlans from "@/components/subscriptions/SubscriptionPlans";
import SubscriptionList from "@/components/subscriptions/SubscriptionList";
import ServicesDisplay from "@/components/subscriptions/ServicesDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SubscriptionsPage: React.FC = () => {
  const { plans, isLoading: plansLoading } = useSubscriptionPlans();
  const { subscriptions, loading: subscriptionsLoading } = useSubscriptions();
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const { toast } = useToast();
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Chargement des abonnements et des services
  useEffect(() => {
    if (!dataLoaded) {
      console.log("Chargement initial des abonnements et services");
      
      // Chargement des services
      const loadServices = async () => {
        setServicesLoading(true);
        try {
          const servicesData = await fetchServices();
          // Cast le résultat pour s'assurer de la compatibilité avec le type Service
          setServices(servicesData as Service[]);
        } catch (error) {
          console.error("Erreur lors du chargement des services:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger les services. Veuillez réessayer plus tard."
          });
        } finally {
          setServicesLoading(false);
        }
      };
      
      loadServices();
      setDataLoaded(true);
    }
  }, [dataLoaded, toast]);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    console.log("Plan sélectionné:", plan);
    // Handle plan selection logic
    toast({
      title: "Plan sélectionné",
      description: `Vous avez sélectionné le plan "${plan.name}" à ${formatCurrency(plan.price)}.`,
    });
  };

  return (
    <div className="space-y-8">
      <SubscriptionHeader />

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="plans">Plans d'abonnement</TabsTrigger>
          <TabsTrigger value="services">Services et Packs</TabsTrigger>
          <TabsTrigger value="subscriptions">Abonnements en cours</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <SubscriptionPlans
            plans={plans}
            onSelectPlan={handleSelectPlan}
            loading={plansLoading}
          />
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <ServicesDisplay
            services={services}
            loading={servicesLoading}
          />
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <SubscriptionList
            subscriptions={subscriptions}
            loading={subscriptionsLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionsPage;
