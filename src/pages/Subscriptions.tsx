
import React, { useState, useEffect } from 'react';
import { fetchSubscriptionPlans } from '@/services/subscriptions';
import { fetchServices } from '@/services/services-service';
import { Service } from '@/types/service';
import { SubscriptionPlan } from '@/types/subscription';
import SubscriptionHeader from '@/components/subscriptions/SubscriptionHeader';
import SubscriptionPlans from '@/components/subscriptions/SubscriptionPlans';
import SubscriptionFilters from '@/components/subscriptions/SubscriptionFilters';
import ServicesDisplay from '@/components/subscriptions/ServicesDisplay';
import { TooltipProvider } from '@/components/ui/tooltip';
import { toast } from 'sonner';

// Utilitaire pour standardiser les URLs
const normalizeUrl = (url: string): string => {
  return url.trim().toLowerCase();
};

// Utilitaire de validation d'URL
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

const Subscriptions: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        console.log("Chargement des plans d'abonnement");
        const plansData = await fetchSubscriptionPlans();
        
        // Normaliser les URLs et valider les données avant de les stocker
        const normalizedPlans = plansData.map(plan => ({
          ...plan,
          // Si un plan contient des liens ou des URLs, les normaliser ici
          is_active: plan.is_active !== undefined ? plan.is_active : true
        })) as SubscriptionPlan[];
        
        setPlans(normalizedPlans);
        
        console.log("Chargement des services");
        const servicesData = await fetchServices();
        setServices(servicesData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Impossible de charger les données. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Filtrer les plans selon le filtre sélectionné
  const filteredPlans = plans.filter(plan => {
    if (filter === 'active') return plan.is_active;
    if (filter === 'inactive') return !plan.is_active;
    return true;
  });

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <SubscriptionHeader />
        
        <div className="bg-white rounded-md shadow p-6">
          <SubscriptionFilters filter={filter} onFilterChange={setFilter} />
          
          <div className="mt-8">
            <SubscriptionPlans plans={filteredPlans} loading={loading} />
          </div>
        </div>
        
        <div className="bg-white rounded-md shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Services disponibles</h2>
          <ServicesDisplay services={services} loading={loading} />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Subscriptions;
