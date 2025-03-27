
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Service } from '@/types/service';
import ServicesList from './ServicesList';

interface ServicesListViewProps {
  services: Service[];
  loading: boolean;
  onEditService: (service: Service) => void;
  onDeleteService: (service: Service) => void;
}

const ServicesListView: React.FC<ServicesListViewProps> = ({ 
  services, 
  loading, 
  onEditService, 
  onDeleteService 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Services</CardTitle>
      </CardHeader>
      <CardContent>
        <ServicesList 
          services={services} 
          loading={loading} 
          onEditService={onEditService}
          onDeleteService={onDeleteService}
        />
      </CardContent>
    </Card>
  );
};

export default ServicesListView;
