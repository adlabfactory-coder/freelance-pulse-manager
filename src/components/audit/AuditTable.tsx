import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Clock, ClipboardList, MoreHorizontal, User } from "lucide-react";
import { AuditLog } from "@/types/audit";
import { Checkbox } from "@/components/ui/checkbox";

interface AuditTableProps {
  logs: AuditLog[];
  sortDirection: 'asc' | 'desc';
  toggleSortDirection: () => void;
  selectedLogs: string[];
  onSelectAll: () => void;
  onToggleSelect: (id: string) => void;
}

const AuditTable: React.FC<AuditTableProps> = ({
  logs,
  sortDirection,
  toggleSortDirection,
  selectedLogs,
  onSelectAll,
  onToggleSelect
}) => {
  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-500';
      case 'update':
        return 'bg-blue-500';
      case 'delete':
        return 'bg-red-500';
      case 'login':
        return 'bg-purple-500';
      case 'logout':
        return 'bg-gray-500';
      default:
        return 'bg-secondary';
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'users':
        return <User className="h-4 w-4" />;
      case 'contacts':
        return <ClipboardList className="h-4 w-4" />;
      case 'quotes':
        return <ClipboardList className="h-4 w-4" />;
      case 'auth':
        return <User className="h-4 w-4" />;
      default:
        return <MoreHorizontal className="h-4 w-4" />;
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const allSelected = logs.length > 0 && selectedLogs.length === logs.length;
  const someSelected = selectedLogs.length > 0 && selectedLogs.length < logs.length;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={allSelected} 
                indeterminate={someSelected}
                onCheckedChange={onSelectAll}
                aria-label="Sélectionner tous les journaux"
              />
            </TableHead>
            <TableHead className="w-[180px]">
              <div className="flex items-center">
                <span>Date & Heure</span>
                <Button variant="ghost" size="sm" onClick={toggleSortDirection} className="ml-1 p-1">
                  {sortDirection === 'desc' ? (
                    <ArrowDownWideNarrow className="h-4 w-4" />
                  ) : (
                    <ArrowUpWideNarrow className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TableHead>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Module</TableHead>
            <TableHead>Action</TableHead>
            <TableHead className="w-[300px]">Détails</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Aucun journal d'audit ne correspond à vos critères de filtrage
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow 
                key={log.id} 
                className={selectedLogs.includes(log.id) ? "bg-muted/50" : ""}
              >
                <TableCell>
                  <Checkbox 
                    checked={selectedLogs.includes(log.id)}
                    onCheckedChange={() => onToggleSelect(log.id)}
                    aria-label={`Sélectionner le journal ${log.id}`}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{formatDateTime(log.timestamp)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-7 w-7 mr-2">
                      <AvatarImage src={log.avatar} />
                      <AvatarFallback>{log.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{log.user}</div>
                      <div className="text-xs text-muted-foreground">{log.role}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getModuleIcon(log.module)}
                    <span className="ml-2">{log.module}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getActionBadgeColor(log.action)}>
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {log.details}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuditTable;
