
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus } from "lucide-react";
import { Service } from "@/types/service";
import { formatCurrency } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteServiceDialog from "./DeleteServiceDialog";

interface ServicesListProps {
  services: Service[];
  loading: boolean;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
  onAdd: () => void;
}

const ServicesList: React.FC<ServicesListProps> = ({
  services,
  loading,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [serviceToDelete, setServiceToDelete] = React.useState<Service | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      onDelete(serviceToDelete.id);
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Liste des services</h2>
        <Button onClick={onAdd} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un service
        </Button>
      </div>

      <Table>
        <TableCaption>Liste des services disponibles</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Prix</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Aucun service trouvé
              </TableCell>
            </TableRow>
          ) : (
            services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.type}</TableCell>
                <TableCell className="text-right">{formatCurrency(service.price)}</TableCell>
                <TableCell>
                  {service.is_active ? (
                    <Badge variant="default" className="bg-green-500">
                      Actif
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-300">
                      Inactif
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => onEdit(service)}
                      size="sm"
                      variant="outline"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(service)}
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:bg-destructive hover:text-white"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DeleteServiceDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        serviceName={serviceToDelete?.name || ""}
      />
    </div>
  );
};

export default ServicesList;
