
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

interface QuoteTableHeaderProps {
  onSort: (column: string) => void;
  sortColumn: string;
}

const QuoteTableHeader: React.FC<QuoteTableHeaderProps> = ({ onSort, sortColumn }) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Référence</TableHead>
        <TableHead>Contact</TableHead>
        <TableHead>Commercial</TableHead>
        <TableHead 
          className="cursor-pointer hover:text-primary"
          onClick={() => onSort("totalAmount")}
        >
          <div className="flex items-center">
            Montant
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead>Statut</TableHead>
        <TableHead 
          className="cursor-pointer hover:text-primary"
          onClick={() => onSort("validUntil")}
        >
          <div className="flex items-center">
            Date limite
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer hover:text-primary"
          onClick={() => onSort("updatedAt")}
        >
          <div className="flex items-center">
            Dernière MAJ
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default QuoteTableHeader;
