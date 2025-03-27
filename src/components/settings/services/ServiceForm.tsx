
import React from "react";
import { Service, ServiceType } from "@/types/service";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export interface ServiceFormProps {
  service: Partial<Service> | null;
  onSave: () => Promise<void>;
  onCancel: () => void;
  onChange: (field: string, value: any) => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSave, onCancel, onChange }) => {
  if (!service) return null;

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          {service.id ? "Modifier le service" : "Ajouter un service"}
        </DialogTitle>
        <DialogDescription>
          {service.id
            ? "Modifiez les détails du service"
            : "Renseignez les informations pour créer un nouveau service"}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-2">
        <FormItem>
          <FormLabel htmlFor="name">Nom du service *</FormLabel>
          <FormControl>
            <Input
              id="name"
              value={service.name || ""}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Nom du service"
              required
            />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="description">Description</FormLabel>
          <FormControl>
            <Textarea
              id="description"
              value={service.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Description du service"
              rows={3}
            />
          </FormControl>
          <FormDescription>
            Une description détaillée du service proposé.
          </FormDescription>
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="type">Type de service *</FormLabel>
          <Select
            value={service.type?.toString() || ServiceType.SERVICE}
            onValueChange={(value) => onChange("type", value)}
          >
            <FormControl>
              <SelectTrigger id="type">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value={ServiceType.SERVICE}>Service</SelectItem>
              <SelectItem value={ServiceType.PRODUCT}>Produit</SelectItem>
              <SelectItem value={ServiceType.SUBSCRIPTION}>
                Abonnement
              </SelectItem>
              <SelectItem value={ServiceType.PACK}>
                Pack
              </SelectItem>
            </SelectContent>
          </Select>
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="price">Prix (€) *</FormLabel>
          <FormControl>
            <Input
              id="price"
              type="number"
              value={service.price || ""}
              onChange={(e) => onChange("price", parseFloat(e.target.value))}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </FormControl>
        </FormItem>

        <FormItem className="flex items-center space-x-2">
          <FormControl>
            <Switch
              checked={service.isActive !== false}
              onCheckedChange={(checked) => onChange("isActive", checked)}
            />
          </FormControl>
          <FormLabel>Service actif</FormLabel>
        </FormItem>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={onSave}>
          {service.id ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </DialogContent>
  );
};

export default ServiceForm;
