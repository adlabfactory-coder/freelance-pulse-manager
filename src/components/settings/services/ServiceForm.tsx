
import React, { useState, useEffect } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import { Loader2 } from "lucide-react";
import { Service, ServiceType } from "@/types/service";

export interface ServiceFormProps {
  service: Service | null;
  onSave: (service: Service) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ 
  service, 
  onSave, 
  onCancel,
  isSaving
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [type, setType] = useState<ServiceType>(ServiceType.ONE_TIME);

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description || "");
      setPrice(service.price);
      setType(service.type);
    } else {
      setName("");
      setDescription("");
      setPrice(0);
      setType(ServiceType.ONE_TIME);
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData: Service = {
      id: service?.id || "",
      name,
      description,
      price,
      type,
    };
    await onSave(serviceData);
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          {service ? "Modifier le service" : "Ajouter un service"}
        </DialogTitle>
        <DialogDescription>
          {service
            ? "Modifiez les détails du service sélectionné."
            : "Ajoutez un nouveau service à votre catalogue."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du service *</Label>
          <Input
            id="name"
            placeholder="Nom du service"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Description du service"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Prix (€) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Prix"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type de service *</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as ServiceType)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ServiceType.ONE_TIME}>Ponctuel</SelectItem>
                <SelectItem value={ServiceType.SUBSCRIPTION}>
                  Abonnement
                </SelectItem>
                <SelectItem value={ServiceType.RECURRING}>Récurrent</SelectItem>
                <SelectItem value={ServiceType.CONSULTING}>
                  Consulting
                </SelectItem>
                <SelectItem value={ServiceType.OTHER}>Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : service ? (
              "Mettre à jour"
            ) : (
              "Créer"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ServiceForm;
