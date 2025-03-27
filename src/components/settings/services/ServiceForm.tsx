
import React from 'react';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Service } from '@/types/service';

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
  onChange
}) => {
  if (!service) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(service);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onChange('price', isNaN(value) ? 0 : value);
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>{service.id ? 'Modifier le service' : 'Ajouter un service'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input
              id="name"
              name="name"
              value={service.name || ''}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select 
              value={service.type?.toString() || 'service'} 
              onValueChange={(value) => onChange('type', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Choisir un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="product">Produit</SelectItem>
                <SelectItem value="subscription">Abonnement</SelectItem>
                <SelectItem value="pack">Pack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Prix (€)
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              min={0}
              step={0.01}
              value={service.price || 0}
              onChange={handlePriceChange}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={service.description || ''}
              onChange={handleChange}
              className="col-span-3"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="is_active" className="text-right">
              Actif
            </Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is_active" 
                checked={service.is_active !== false} 
                onCheckedChange={(checked) => onChange('is_active', !!checked)}
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Service actif
              </Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {service.id ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ServiceForm;
