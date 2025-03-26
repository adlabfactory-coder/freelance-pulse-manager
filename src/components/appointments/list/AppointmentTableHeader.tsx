
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AppointmentTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[140px]">Date et heure</TableHead>
        <TableHead>Titre</TableHead>
        <TableHead>Contact</TableHead>
        <TableHead>Durée</TableHead>
        <TableHead>Statut</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default AppointmentTableHeader;
