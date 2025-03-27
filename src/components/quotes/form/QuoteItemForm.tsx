
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { QuoteItem, SubscriptionPlan } from "@/types";
import { Service } from "@/types/service";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase-client";

interface QuoteItemFormProps {
  item: Partial<QuoteItem>;
  onItemChange: (item: Partial<QuoteItem>) => void;
  onAddItem: () => void;
  services?: Service[];
  subscriptionPlans?: SubscriptionPlan[];
  hideControls?: boolean;
}

const QuoteItemForm: React.FC<QuoteItemFormProps> = ({
  item,
  onItemChange,
  onAddItem,
  services = [],
  subscriptionPlans = [],
  hideControls = false
}) => {
  const { toast } = useToast();

  // Utiliser une requête pour charger les services si non fournis
  const { data: fetchedServices } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les services"
        });
        return [];
      }
      
      // Normaliser les données pour s'assurer que isActive est présent
      return data.map((service: any) => ({
        ...service,
        isActive: service.is_active // Ajout pour compatibilité
      }));
    },
    enabled: services.length === 0, // Exécuter uniquement si aucun service n'est fourni
  });

  // Combiner les services fournis et ceux récupérés
  const allServices = services.length > 0 ? services : (fetchedServices || []);

  const handleSelectService = (serviceId: string) => {
    if (serviceId === "custom") {
      onItemChange({
        ...item,
        description: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        tax: 20,
        serviceId: undefined
      });
      return;
    }
    
    const selectedService = allServices.find(service => service.id === serviceId);
    
    if (selectedService) {
      onItemChange({
        ...item,
        description: selectedService.name,
        quantity: 1,
        unitPrice: selectedService.price,
        discount: 0,
        tax: 20,
        serviceId: selectedService.id
      });
    }
  };

  // Calcul du montant total pour l'élément
  const calculateItemTotal = () => {
    if (!item.quantity || !item.unitPrice) return 0;
    
    const basePrice = item.quantity * item.unitPrice;
    const discountAmount = item.discount ? (basePrice * (item.discount / 100)) : 0;
    const priceAfterDiscount = basePrice - discountAmount;
    const taxAmount = item.tax ? (priceAfterDiscount * (item.tax / 100)) : 0;
    
    return priceAfterDiscount + taxAmount;
  };
  
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div>
        <Label htmlFor="service">Service</Label>
        <Select
          value={item.serviceId}
          onValueChange={handleSelectService}
        >
          <SelectTrigger id="service">
            <SelectValue placeholder="Sélectionner un service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Personnalisé</SelectItem>
            {allServices && allServices.map(service => (
              <SelectItem key={service.id} value={service.id}>
                {service.name} - {formatCurrency(service.price)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Description de l'article"
          value={item.description || ""}
          onChange={e => onItemChange({ ...item, description: e.target.value })}
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
            value={item.quantity || ""}
            onChange={e => onItemChange({ ...item, quantity: parseInt(e.target.value) || 0 })}
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
            value={item.unitPrice || ""}
            onChange={e => onItemChange({ ...item, unitPrice: parseFloat(e.target.value) || 0 })}
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
            value={item.discount || ""}
            onChange={e => onItemChange({ ...item, discount: parseFloat(e.target.value) || 0 })}
          />
        </div>
        
        <div>
          <Label htmlFor="tax">TVA (%)</Label>
          <Input
            id="tax"
            type="number"
            min={0}
            placeholder="TVA en %"
            value={item.tax || ""}
            onChange={e => onItemChange({ ...item, tax: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
      
      <div className="text-right font-semibold">
        Total: {formatCurrency(calculateItemTotal())}
      </div>
      
      {!hideControls && (
        <Button 
          type="button" 
          className="w-full" 
          onClick={onAddItem}
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter l'article
        </Button>
      )}
    </div>
  );
};

export default QuoteItemForm;
