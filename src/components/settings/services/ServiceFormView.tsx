
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Service } from '@/types/service';
import ServiceForm from './ServiceForm';

interface ServiceFormViewProps {
  service: Service;
  onSave: (service: Service) => Promise<void>;
  onCancel: () => void;
}

const ServiceFormView: React.FC<ServiceFormViewProps> = ({ 
  service, 
  onSave, 
  onCancel 
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (serviceData: Service) => {
    setIsSaving(true);
    try {
      await onSave(serviceData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {service.id ? "Modifier le service" : "Ajouter un service"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ServiceForm 
          service={service} 
          onSave={handleSave} 
          onCancel={onCancel}
          isSaving={isSaving}
        />
      </CardContent>
    </Card>
  );
};

export default ServiceFormView;
