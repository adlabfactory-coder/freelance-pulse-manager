import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { QuoteItem } from "@/types";
import { Service } from "@/types/services";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/format";

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

  return (
    <div className="border rounded-md p-4">
      <h3 className="font-semibold mb-4">Ajouter un article</h3>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="service">Service ou Pack</Label>
          <Select
            onValueChange={handleSelectService}
          >
            <SelectTrigger id="service">
              <SelectValue placeholder="Sélectionner un service ou pack" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Personnalisé</SelectItem>
              {services.map(service => (
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
