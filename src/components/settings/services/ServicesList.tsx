
import React from "react";
import { AlertCircle, Pencil, Trash2 } from "lucide-react";
import { Service } from "@/types";
import { formatCurrency } from "@/utils/format";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ServicesListProps {
  services: Service[];
  isLoading: boolean;
  onEditService: (service: Service) => void;
  onDeleteService: (service: Service) => void;
}

const ServicesList: React.FC<ServicesListProps> = ({
  services,
  isLoading,
  onEditService,
  onDeleteService,
}) => {
  if (isLoading) {
    return <div className="py-8 text-center">Chargement des services...</div>;
  }

  if (services.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Aucun service</AlertTitle>
        <AlertDescription>
          Aucun service n'a été créé. Cliquez sur "Ajouter un service" pour commencer.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{service.name}</div>
                  {service.description && (
                    <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                      {service.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className={`capitalize ${service.type === 'pack' ? 'text-purple-600' : ''}`}>
                  {service.type}
                </span>
              </TableCell>
              <TableCell>{formatCurrency(service.price)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  service.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {service.is_active ? "Actif" : "Inactif"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditService(service)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteService(service)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServicesList;
