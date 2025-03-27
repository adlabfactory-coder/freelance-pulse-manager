
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AppointmentTableHeaderProps {
  showManager?: boolean;
}

const AppointmentTableHeader: React.FC<AppointmentTableHeaderProps> = ({ 
  showManager = false 
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Titre</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Durée</TableHead>
        <TableHead>Client</TableHead>
        <TableHead>Freelance</TableHead>
        {showManager && <TableHead>Chargé de compte</TableHead>}
        <TableHead>Statut</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default AppointmentTableHeader;
