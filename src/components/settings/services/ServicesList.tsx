
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/format';
import { Service } from '@/types/service';
import { Pencil, Trash2 } from 'lucide-react';
import DeleteServiceDialog from './DeleteServiceDialog';

export interface ServicesListProps {
  services: Service[];
  loading: boolean;
  onEditService: (service: Service) => void;
  onDeleteService: (service: Service) => void;
}

const ServicesList: React.FC<ServicesListProps> = ({ 
  services, 
  loading, 
  onEditService,
  onDeleteService
}) => {
  const [deleteDialog, setDeleteDialog] = useState<{isOpen: boolean, service?: Service}>({
    isOpen: false
  });

  const handleOpenDeleteDialog = (service: Service) => {
    setDeleteDialog({ isOpen: true, service });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ isOpen: false });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.service) {
      onDeleteService(deleteDialog.service);
      handleCloseDeleteDialog();
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-5 bg-slate-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <div className="h-9 bg-slate-200 rounded w-20"></div>
              <div className="h-9 bg-slate-200 rounded w-20"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-background">
        <h3 className="text-lg font-medium mb-2">Aucun service</h3>
        <p className="text-muted-foreground mb-4">
          Aucun service n'a été ajouté pour le moment.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {service.name}
                <span className="font-normal text-primary">
                  {formatCurrency(service.price)}
                </span>
              </CardTitle>
              <CardDescription>Type: {service.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {service.description || "Aucune description disponible"}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center" 
                onClick={() => onEditService(service)}
              >
                <Pencil className="h-4 w-4 mr-1" /> Modifier
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex items-center" 
                onClick={() => handleOpenDeleteDialog(service)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Supprimer
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {deleteDialog.service && (
        <DeleteServiceDialog 
          isOpen={deleteDialog.isOpen} 
          onClose={handleCloseDeleteDialog} 
          onConfirm={handleConfirmDelete}
          serviceName={deleteDialog.service.name}
        />
      )}
    </>
  );
};

export default ServicesList;
