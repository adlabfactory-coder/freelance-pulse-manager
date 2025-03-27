
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { QuoteItem, SubscriptionPlan } from "@/types";
import { Service } from "@/types/services";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionPlans } from "@/services/supabase/subscriptions";

interface QuoteItemFormProps {
  currentItem: Partial<QuoteItem>;
  services: Service[];
  onChange: (item: Partial<QuoteItem>) => void;
  onAddItem: () => void;
}

const QuoteItemForm: React.FC<QuoteItemFormProps> = ({
  currentItem,
  services,
  onChange,
  onAddItem
}) => {
  const { toast } = useToast();
  
  // Récupérer les plans d'abonnement disponibles
  const { data: subscriptionPlans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: getSubscriptionPlans
  });

  const handleSelectService = (serviceId: string) => {
    if (serviceId === "custom") {
      onChange({
        ...currentItem,
        description: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        tax: 20,
        serviceId: undefined
      });
      return;
    }
    
    // Vérifier si c'est un abonnement
    if (serviceId.startsWith('subscription-')) {
      const planId = serviceId.replace('subscription-', '');
      const selectedPlan = subscriptionPlans.find(plan => plan.id === planId);
      
      if (selectedPlan) {
        onChange({
          ...currentItem,
          description: `Abonnement: ${selectedPlan.name}`,
          quantity: 1,
          unitPrice: selectedPlan.price,
          discount: 0,
          tax: 20,
          serviceId: undefined
        });
      }
      return;
    }
    
    // C'est un service ou un pack
    const selectedService = services.find(service => service.id === serviceId);
    
    if (selectedService) {
      onChange({
        ...currentItem,
        description: selectedService.name,
        quantity: 1,
        unitPrice: selectedService.price,
        discount: 0,
        tax: 20,
        serviceId: selectedService.id
      });
    }
  };

  const handleSubmit = () => {
    if (!currentItem.description || !currentItem.quantity || !currentItem.unitPrice) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires de l'article.",
      });
      return;
    }
    
    onAddItem();
  };

  // Grouper les services par type
  const servicesByType = services.reduce((acc, service) => {
    const type = service.type || 'autre';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  // Traduire les types de services en français
  const translateType = (type: string): string => {
    const translations: Record<string, string> = {
      'service': 'Services',
      'product': 'Produits',
      'subscription': 'Abonnements',
      'pack': 'Packs',
      'autre': 'Autres'
    };
    return translations[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="border rounded-md p-4">
      <h3 className="font-semibold mb-4">Ajouter un article</h3>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="service">Service, Pack ou Abonnement</Label>
          <Select
            onValueChange={handleSelectService}
            value={currentItem.serviceId}
          >
            <SelectTrigger id="service">
              <SelectValue placeholder="Sélectionner un produit ou service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Personnalisé</SelectItem>
              
              {/* Afficher les services groupés par type */}
              {Object.entries(servicesByType).map(([type, services]) => (
                <React.Fragment key={type}>
                  <SelectItem value={`header-${type}`} disabled className="font-bold text-primary">
                    {translateType(type)}
                  </SelectItem>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id} className="pl-6">
                      {service.name} - {formatCurrency(service.price)}
                    </SelectItem>
                  ))}
                </React.Fragment>
              ))}
              
              {/* Afficher les abonnements */}
              {subscriptionPlans && subscriptionPlans.length > 0 && (
                <React.Fragment>
                  <SelectItem value="header-subscriptions" disabled className="font-bold text-primary">
                    Abonnements
                  </SelectItem>
                  {subscriptionPlans.map(plan => (
                    <SelectItem key={plan.id} value={`subscription-${plan.id}`} className="pl-6">
                      {plan.name} - {formatCurrency(plan.price)}
                    </SelectItem>
                  ))}
                </React.Fragment>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Description de l'article"
            value={currentItem.description || ""}
            onChange={e => onChange({ ...currentItem, description: e.target.value })}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="quantity">Quantité</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              placeholder="Quantité"
              value={currentItem.quantity || ""}
              onChange={e => onChange({ ...currentItem, quantity: parseInt(e.target.value) || 0 })}
            />
          </div>
          
          <div>
            <Label htmlFor="unitPrice">Prix unitaire (MAD)</Label>
            <Input
              id="unitPrice"
              type="number"
              min={0}
              step={0.01}
              placeholder="Prix unitaire"
              value={currentItem.unitPrice || ""}
              onChange={e => onChange({ ...currentItem, unitPrice: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="discount">Remise (%)</Label>
            <Input
              id="discount"
              type="number"
              min={0}
              max={100}
              placeholder="Remise en %"
              value={currentItem.discount || ""}
              onChange={e => onChange({ ...currentItem, discount: parseFloat(e.target.value) || 0 })}
            />
          </div>
          
          <div>
            <Label htmlFor="tax">TVA (%)</Label>
            <Input
              id="tax"
              type="number"
              min={0}
              placeholder="TVA en %"
              value={currentItem.tax || ""}
              onChange={e => onChange({ ...currentItem, tax: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
        
        <Button 
          type="button" 
          className="w-full" 
          onClick={handleSubmit}
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter l'article
        </Button>
      </div>
    </div>
  );
};

export default QuoteItemForm;
