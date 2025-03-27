
// Import relevant components and change is_active property references
// Only changing the affected parts of the file
import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Service, ServiceType } from "@/types/service";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ServiceFormProps {
  service: Partial<Service> | null;
  onSave: (service: Partial<Service>) => void;
  onCancel: () => void;
  onChange: (field: string, value: any) => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  service,
  onSave,
  onCancel,
  onChange,
}) => {
  if (!service) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(service);
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>
            {service.id ? "Modifier le service" : "Ajouter un service"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Name field */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={service.name || ""}
              onChange={(e) => onChange("name", e.target.value)}
              required
            />
          </div>
          
          {/* Description field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={service.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              rows={3}
            />
          </div>
          
          {/* Price field */}
          <div className="space-y-2">
            <Label htmlFor="price">Prix (€)</Label>
            <Input
              id="price"
              type="number"
              value={service.price || 0}
              onChange={(e) => onChange("price", parseFloat(e.target.value))}
              required
              min={0}
              step={0.01}
            />
          </div>
          
          {/* Type field */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={service.type || ServiceType.SERVICE}
              onValueChange={(value) => onChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ServiceType.SERVICE}>Service</SelectItem>
                <SelectItem value={ServiceType.PRODUCT}>Produit</SelectItem>
                <SelectItem value={ServiceType.SUBSCRIPTION}>Abonnement</SelectItem>
                <SelectItem value={ServiceType.PACK}>Pack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Active status switch */}
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="is_active">Actif</Label>
            <Switch
              id="is_active"
              checked={service.is_active ?? true}
              onCheckedChange={(checked) => onChange("is_active", checked)}
            />
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button type="submit">
            {service.id ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ServiceForm;
