
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useServices } from '@/hooks/useServices';
import { ServiceTypeLabels } from '@/types/service';

interface SubscriptionPlanFeaturesProps {
  features: string[];
  onFeaturesChange: (features: string[]) => void;
}

const SubscriptionPlanFeatures: React.FC<SubscriptionPlanFeaturesProps> = ({
  features,
  onFeaturesChange
}) => {
  const [newFeature, setNewFeature] = useState('');
  const [selectedService, setSelectedService] = useState<string>('');
  const { services } = useServices();

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      onFeaturesChange([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFeature();
    }
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    onFeaturesChange(updatedFeatures);
  };

  const handleAddServiceAsFeature = () => {
    if (selectedService) {
      const serviceType = services.find(s => s.id === selectedService);
      if (serviceType) {
        const serviceFeature = serviceType.name || ServiceTypeLabels[serviceType.type as keyof typeof ServiceTypeLabels] || '';
        if (serviceFeature && !features.includes(serviceFeature)) {
          onFeaturesChange([...features, serviceFeature]);
          setSelectedService('');
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Fonctionnalités incluses</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1.5">
              {feature}
              <button
                type="button"
                onClick={() => handleRemoveFeature(index)}
                className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Ajouter un service existant</Label>
        <div className="flex gap-2">
          <Select
            value={selectedService}
            onValueChange={setSelectedService}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Sélectionner un service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name || ServiceTypeLabels[service.type as keyof typeof ServiceTypeLabels]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            type="button" 
            onClick={handleAddServiceAsFeature} 
            disabled={!selectedService}
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Ajouter une fonctionnalité personnalisée</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Nouvelle fonctionnalité..."
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button 
            type="button" 
            onClick={handleAddFeature} 
            disabled={!newFeature.trim()}
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlanFeatures;
