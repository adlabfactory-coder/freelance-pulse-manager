
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { Freelancer } from "@/hooks/useFreelancerManagement";

interface FreelancerTableProps {
  freelancers: Freelancer[];
  loading: boolean;
  onDeleteClick: (id: string) => void;
}

const FreelancerTable: React.FC<FreelancerTableProps> = ({ 
  freelancers, 
  loading, 
  onDeleteClick 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
              <TableCell>
                {freelancer.createdAt 
                  ? new Date(freelancer.createdAt).toLocaleDateString() 
                  : "Non disponible"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => onDeleteClick(freelancer.id)}
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
