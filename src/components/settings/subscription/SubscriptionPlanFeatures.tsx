
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormLabel } from '@/components/ui/form';
import { Plus, Trash } from 'lucide-react';

interface SubscriptionPlanFeaturesProps {
  features: string[];
  onFeaturesChange: (features: string[]) => void;
}

const SubscriptionPlanFeatures: React.FC<SubscriptionPlanFeaturesProps> = ({ features, onFeaturesChange }) => {
  const [newFeature, setNewFeature] = useState('');

  const addFeature = () => {
    if (newFeature.trim()) {
      const updatedFeatures = [...features, newFeature];
      onFeaturesChange(updatedFeatures);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    onFeaturesChange(updatedFeatures);
  };

  return (
    <div className="space-y-4">
      <div>
        <FormLabel>Fonctionnalités</FormLabel>
        <div className="flex mt-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Ajouter une fonctionnalité"
            className="flex-1"
          />
          <Button type="button" onClick={addFeature} className="ml-2">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center justify-between p-2 border rounded-md">
            <span>{feature}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeFeature(index)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {features.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aucune fonctionnalité ajoutée pour l'instant.
          </p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlanFeatures;
