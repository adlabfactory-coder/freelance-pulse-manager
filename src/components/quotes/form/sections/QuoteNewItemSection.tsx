import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { QuoteItem } from "@/types";
import { Service } from "@/types/service";

interface QuoteNewItemSectionProps {
  currentItem: Partial<QuoteItem>;
  services: Service[];
  onCurrentItemChange: (item: Partial<QuoteItem>) => void;
  onAddItem: () => void;
}

const QuoteNewItemSection: React.FC<QuoteNewItemSectionProps> = ({
  currentItem,
  services,
  onCurrentItemChange,
  onAddItem
}) => {
  const handleSelectService = (serviceId: string) => {
    if (serviceId === "custom") {
      onCurrentItemChange({
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
      onCurrentItemChange({
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

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Ajouter un article</h3>
      
      <div>
        <Label htmlFor="service">Service</Label>
        <Select
          onValueChange={handleSelectService}
          value={currentItem.serviceId}
        >
          <SelectTrigger id="service">
            <SelectValue placeholder="Sélectionner un service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Personnalisé</SelectItem>
            {services.map(service => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
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
          onChange={e => onCurrentItemChange({ ...currentItem, description: e.target.value })}
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
            onChange={e => onCurrentItemChange({ ...currentItem, quantity: parseInt(e.target.value) || 0 })}
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
            onChange={e => onCurrentItemChange({ ...currentItem, unitPrice: parseFloat(e.target.value) || 0 })}
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
            onChange={e => onCurrentItemChange({ ...currentItem, discount: parseFloat(e.target.value) || 0 })}
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
            onChange={e => onCurrentItemChange({ ...currentItem, tax: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
      
      <Button 
        type="button" 
        className="w-full" 
        onClick={onAddItem}
      >
        <Plus className="mr-2 h-4 w-4" /> Ajouter l'article
      </Button>
    </div>
  );
};

export default QuoteNewItemSection;
