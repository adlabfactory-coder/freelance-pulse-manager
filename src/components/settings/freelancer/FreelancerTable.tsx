
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { Freelancer } from "@/hooks/useFreelancerManagement";

interface FreelancerTableProps {
  freelancers: Freelancer[];
  isLoading: boolean;
  isDeleting: boolean;
  onDelete: (id: string) => void;
}

const FreelancerTable: React.FC<FreelancerTableProps> = ({ 
  freelancers, 
  isLoading, 
  isDeleting,
  onDelete 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non disponible";
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (e) {
      return "Format invalide";
    }
  };

  return (
    <Table>
      <TableCaption>Liste des freelances</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Date de création</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {freelancers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              Aucun freelance trouvé
            </TableCell>
          </TableRow>
        ) : (
          freelancers.map((freelancer) => (
            <TableRow key={freelancer.id}>
              <TableCell className="font-medium">{freelancer.name}</TableCell>
              <TableCell>{freelancer.email}</TableCell>
              <TableCell>{formatDate(freelancer.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => onDelete(freelancer.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default FreelancerTable;
