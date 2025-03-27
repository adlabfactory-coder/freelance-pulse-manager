
import { Service } from "@/types/service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

// Add formatPrice to format service prices
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

// Corrigeons la comparaison de type
const getTypeLabel = (type: string) => {
  switch (type) {
    case "service":
      return "Service";
    case "product":
      return "Produit";
    case "subscription":
      return "Abonnement";
    case "pack":
      return "Pack";
    default:
      return type;
  }
};

interface ServicesListProps {
  services: Service[];
  loading: boolean;
  onEditService: (service: Service) => void;
  onDeleteService: (service: Service) => void;
}

const ServicesList = ({ services, loading, onEditService, onDeleteService }: ServicesListProps) => {
  if (loading) {
    return <div className="text-center py-4">Chargement des services...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Prix</TableHead>
            <TableHead className="text-right">Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Aucun service disponible
              </TableCell>
            </TableRow>
          ) : (
            services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.description || "-"}</TableCell>
                <TableCell>
                  {getTypeLabel(service.type)}
                </TableCell>
                <TableCell className="text-right">
                  {formatPrice(service.price)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      service.isActive || service.is_active
                        ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                        : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                    }`}
                  >
                    {service.isActive || service.is_active ? "Actif" : "Inactif"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditService(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteService(service)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServicesList;
