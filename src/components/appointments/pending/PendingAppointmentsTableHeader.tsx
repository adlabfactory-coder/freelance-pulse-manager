
import React from "react";
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

const PendingAppointmentsTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[140px]">Date et heure</TableHead>
        <TableHead>Titre</TableHead>
        <TableHead>Contact</TableHead>
        <TableHead>Durée</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default PendingAppointmentsTableHeader;
