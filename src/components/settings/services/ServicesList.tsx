
import React from "react";
import { Service } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";
import { formatPrice } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";

interface ServicesListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  loading?: boolean;
}

const ServicesList: React.FC<ServicesListProps> = ({
  services,
  onEdit,
  onDelete,
  loading = false,
}) => {
  if (loading) {
    return (
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
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
              <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-8 w-20 float-right" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Aucun service trouvé
      </div>
    );
  }

  return (
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
            <TableCell className="font-medium">
              {service.name}
              {service.description && (
                <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs">
                  {service.description}
                </p>
              )}
            </TableCell>
            <TableCell>{getTypeLabel(service.type)}</TableCell>
            <TableCell>{formatPrice(service.price)}</TableCell>
            <TableCell>
              <Badge variant={service.isActive ? "default" : "secondary"}>
                {service.isActive ? "Actif" : "Inactif"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(service)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(service)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

function getTypeLabel(type: string): string {
  switch (type) {
    case "service":
      return "Service";
    case "product":
      return "Produit";
    case "subscription":
      return "Abonnement";
    default:
      return type;
  }
}

export default ServicesList;
