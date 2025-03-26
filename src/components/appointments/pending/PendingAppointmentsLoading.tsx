
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import PendingAppointmentsHeader from "./PendingAppointmentsHeader";
import PendingAppointmentsTableHeader from "./PendingAppointmentsTableHeader";

const PendingAppointmentsLoading: React.FC = () => {
  return (
    <Card className="w-full">
      <PendingAppointmentsHeader />
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <PendingAppointmentsTableHeader />
            <TableBody>
              {Array.from({ length: 2 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingAppointmentsLoading;
