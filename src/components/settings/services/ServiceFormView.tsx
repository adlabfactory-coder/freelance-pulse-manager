
import React from 'react';
import { Service } from '@/types/service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ServiceForm from './ServiceForm';

interface ServiceFormViewProps {
  service: Service;
  onSave: (service: Service) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

const ServiceFormView: React.FC<ServiceFormViewProps> = ({ 
  service, 
  onSave, 
  onCancel,
  isSaving
}) => {
  const isEditing = !!service.id;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Modifier le service' : 'Ajouter un nouveau service'}</CardTitle>
      </CardHeader>
      <CardContent>
        <ServiceForm 
          service={service}
          onSave={onSave}
          onCancel={onCancel}
          isSaving={isSaving}
        />
      </CardContent>
    </Card>
  );
};

export default ServiceFormView;
