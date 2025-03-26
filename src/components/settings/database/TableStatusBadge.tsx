
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface TableStatusBadgeProps {
  exists: boolean;
}

const TableStatusBadge: React.FC<TableStatusBadgeProps> = ({ exists }) => {
  if (exists) {
    return <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> OK</Badge>;
  }
  return <Badge variant="destructive"><X className="h-3 w-3 mr-1" /> Manquante</Badge>;
};

export default TableStatusBadge;
