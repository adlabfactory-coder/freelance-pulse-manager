
import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Commission, CommissionTier } from "@/types/commissions";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommissionsTableProps {
  commissions: Commission[];
  requestingPayment: boolean;
  requestPayment: (commissionId: string) => void;
  getTierLabel: (tier: CommissionTier) => string;
  getStatusBadge: (status: string, paymentRequested: boolean) => React.ReactNode;
  formatCurrency: (amount: number) => string;
  formatPeriod: (startDate: Date, endDate: Date) => string;
  onViewCommission: (commissionId: string) => void;
}

const CommissionsTable: React.FC<CommissionsTableProps> = ({
  commissions,
  requestingPayment,
  requestPayment,
  getTierLabel,
  getStatusBadge,
  formatCurrency,
  formatPeriod,
  onViewCommission,
}) => {
  const columns: ColumnDef<Commission>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "freelancerName",
      header: "Commercial",
    },
    {
      accessorKey: "amount",
      header: "Montant",
      cell: ({ row }) => formatCurrency(row.original.amount),
    },
    {
      accessorKey: "tier",
      header: "Palier",
      cell: ({ row }) => getTierLabel(row.original.tier),
    },
    {
      accessorKey: "period",
      header: "Période",
      cell: ({ row }) => {
        // Handle both period object and separate periodStart/periodEnd properties
        if (row.original.period) {
          return formatPeriod(row.original.period.startDate, row.original.period.endDate);
        } else if (row.original.periodStart && row.original.periodEnd) {
          return formatPeriod(row.original.periodStart, row.original.periodEnd);
        }
        return "";
      }
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) =>
        getStatusBadge(row.original.status, row.original.paymentRequested),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewCommission(row.original.id)}>
              Voir détails
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => requestPayment(row.original.id)}
              disabled={row.original.paymentRequested || requestingPayment}
            >
              Demander le versement
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: commissions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Aucun résultat.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CommissionsTable;
