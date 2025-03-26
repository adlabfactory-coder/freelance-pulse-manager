
import React from "react";
import { Service, ServiceType } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ServiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Partial<Service> | null;
  onServiceChange: (field: string, value: any) => void;
  onSave: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  open,
  onOpenChange,
  service,
  onServiceChange,
  onSave,
}) => {
  if (!service) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {service.id ? "Modifier le service" : "Ajouter un service"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du service *</Label>
              <Input
                id="name"
                value={service.name || ""}
                onChange={(e) => onServiceChange("name", e.target.value)}
                placeholder="Nom du service"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={service.description || ""}
                onChange={(e) => onServiceChange("description", e.target.value)}
                placeholder="Description du service"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={service.type || ServiceType.SERVICE}
                  onValueChange={(value) => onServiceChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ServiceType.SERVICE}>Service</SelectItem>
                    <SelectItem value={ServiceType.PRODUCT}>Produit</SelectItem>
                    <SelectItem value={ServiceType.SUBSCRIPTION}>Abonnement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prix *</Label>
                <Input
                  id="price"
                  type="number"
                  value={service.price !== undefined ? service.price : ""}
                  onChange={(e) => onServiceChange("price", parseFloat(e.target.value))}
                  placeholder="Prix"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive" className="cursor-pointer">Actif</Label>
              <Switch
                id="isActive"
                checked={service.isActive !== undefined ? service.isActive : true}
                onCheckedChange={(checked) => onServiceChange("isActive", checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceForm;
