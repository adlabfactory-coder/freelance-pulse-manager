
import React, { useState } from "react";
import { Service, ServiceType } from "@/types/service";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteServiceDialog from "./DeleteServiceDialog";

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
  onDeleteService,
}) => {
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      onDeleteService(serviceToDelete);
      setConfirmationOpen(false);
      setServiceToDelete(null);
    }
  };

  const getServiceTypeBadge = (type: ServiceType) => {
    let variant: "default" | "secondary" | "outline" | "destructive" = "default";
    
    switch (type) {
      case ServiceType.SUBSCRIPTION:
        variant = "default";
        break;
      case ServiceType.ONE_TIME:
        variant = "secondary";
        break;
      case ServiceType.RECURRING:
        variant = "outline";
        break;
      case ServiceType.CONSULTING:
        variant = "default";
        break;
      default:
        variant = "outline";
    }
    
    return (
      <Badge variant={variant}>
        {type === ServiceType.ONE_TIME
          ? "Ponctuel"
          : type === ServiceType.SUBSCRIPTION
          ? "Abonnement"
          : type === ServiceType.RECURRING
          ? "Récurrent"
          : type === ServiceType.CONSULTING
          ? "Consulting"
          : "Autre"}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-[80px] ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-semibold">Aucun service</h3>
        <p className="text-muted-foreground mt-1">
          Vous n'avez pas encore ajouté de services.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.description || "-"}</TableCell>
                <TableCell>
                  {getServiceTypeBadge(service.type)}
                </TableCell>
                <TableCell>{formatCurrency(service.price)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditService(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(service)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {serviceToDelete && (
        <DeleteServiceDialog
          service={serviceToDelete}
          isOpen={confirmationOpen}
          onClose={() => setConfirmationOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default ServicesList;
