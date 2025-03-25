
import React from "react";
import { Service, ServiceType } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ServiceFormProps {
  service: Partial<Service> | null;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: string, value: any) => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  service,
  onSave,
  onCancel,
  onChange,
}) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {service?.id ? "Modifier le service" : "Ajouter un service"}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du service *</Label>
          <Input
            id="name"
            value={service?.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Nom du service"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select
            value={service?.type}
            onValueChange={(value) => onChange("type", value as ServiceType)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="pack">Pack</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Prix (€) *</Label>
          <Input
            id="price"
            type="number"
            min={0}
            step={0.01}
            value={service?.price || ""}
            onChange={(e) => onChange("price", parseFloat(e.target.value) || 0)}
            placeholder="Prix du service"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={service?.description || ""}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Description du service"
            rows={3}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={service?.is_active}
            onCheckedChange={(checked) => onChange("is_active", checked)}
          />
          <Label htmlFor="is_active">Service actif</Label>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={onSave}>
          <Check className="mr-2 h-4 w-4" /> Enregistrer
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ServiceForm;
