
import React from "react";
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface QuoteTableHeadProps {
  sortColumn: string;
  sortDirection: "asc" | "desc";
  selectAll: boolean;
  onSort: (column: string) => void;
  onSelectAll: () => void;
}

const QuoteTableHead: React.FC<QuoteTableHeadProps> = ({
  sortColumn,
  sortDirection,
  selectAll,
  onSort,
  onSelectAll
}) => {
  const getSortIcon = (column: string) => {
    if (sortColumn === column) {
      return (
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`}
        />
      );
    }
    return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">
          <Checkbox 
            checked={selectAll}
            onCheckedChange={onSelectAll}
            aria-label="Sélectionner tous les devis"
          />
        </TableHead>
        <TableHead>Référence</TableHead>
        <TableHead>Contact</TableHead>
        <TableHead>Commercial</TableHead>
        <TableHead>Statut</TableHead>
        <TableHead
          className="cursor-pointer"
          onClick={() => onSort("totalAmount")}
        >
          <div className="flex items-center">
            Montant {getSortIcon("totalAmount")}
          </div>
        </TableHead>
        <TableHead
          className="cursor-pointer"
          onClick={() => onSort("validUntil")}
        >
          <div className="flex items-center">
            Validité {getSortIcon("validUntil")}
          </div>
        </TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default QuoteTableHead;
