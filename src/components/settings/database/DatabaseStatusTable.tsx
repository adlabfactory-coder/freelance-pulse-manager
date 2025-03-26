
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import TableStatusBadge from "./TableStatusBadge";
import { getTableDescription } from "./TableDescriptions";

export interface TableStatus {
  table: string;
  exists: boolean;
}

export interface DatabaseStatusTableProps {
  tablesStatus: TableStatus[];
  isLoading: boolean;
}

const DatabaseStatusTable: React.FC<DatabaseStatusTableProps> = ({ tablesStatus, isLoading }) => {
  if (isLoading) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Table</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tablesStatus.map(({ table, exists }) => (
            <TableRow key={table}>
              <TableCell className="font-medium">{table}</TableCell>
              <TableCell><TableStatusBadge exists={exists} /></TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {getTableDescription(table)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DatabaseStatusTable;
