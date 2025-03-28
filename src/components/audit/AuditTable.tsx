
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, CalendarIcon, ClipboardIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { AuditLog } from "@/types/audit";
import { Badge } from "@/components/ui/badge";

interface AuditTableProps {
  logs: AuditLog[];
  sortDirection: 'asc' | 'desc';
  toggleSortDirection: () => void;
  selectedLogs: string[];
  onSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onRowClick: (log: AuditLog) => void;
}

const AuditTable: React.FC<AuditTableProps> = ({
  logs,
  sortDirection,
  toggleSortDirection,
  selectedLogs,
  onSelectAll,
  onToggleSelect,
  onRowClick,
}) => {
  const getModuleBadgeVariant = (module: string) => {
    const variants: { [key: string]: "default" | "secondary" | "outline" | "destructive" } = {
      'auth': 'default',
      'users': 'secondary',
      'contacts': 'outline',
      'quotes': 'default',
      'appointments': 'secondary',
      'commissions': 'outline',
      'subscriptions': 'default',
      'settings': 'secondary',
      'system': 'destructive'
    };
    
    return variants[module.toLowerCase()] || 'default';
  };

  const getActionBadgeVariant = (action: string) => {
    const variants: { [key: string]: "default" | "secondary" | "outline" | "destructive" } = {
      'create': 'default',
      'read': 'outline',
      'update': 'secondary',
      'delete': 'destructive',
      'login': 'default',
      'logout': 'outline',
      'signup': 'default',
      'error': 'destructive',
    };
    
    return variants[action.toLowerCase()] || 'secondary';
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune entrée d'audit trouvée pour les critères sélectionnés.
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={selectedLogs.length > 0 && selectedLogs.length === logs.length}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead className="w-[180px] cursor-pointer" onClick={toggleSortDirection}>
              <div className="flex items-center">
                Horodatage
                {sortDirection === 'desc' ? (
                  <ChevronDown className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronUp className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Module</TableHead>
            <TableHead>Action</TableHead>
            <TableHead className="hidden md:table-cell">Détails</TableHead>
            <TableHead className="hidden lg:table-cell">IP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow 
              key={log.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onRowClick(log)}
            >
              <TableCell className="p-2" onClick={(e) => { e.stopPropagation(); onToggleSelect(log.id); }}>
                <Checkbox 
                  checked={selectedLogs.includes(log.id)}
                />
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div className="flex flex-col">
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                  <span className="text-muted-foreground">
                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: fr })}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{log.user_email || 'Système'}</span>
                  {log.user_role && (
                    <span className="text-xs text-muted-foreground">{log.user_role}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getModuleBadgeVariant(log.module)}>{log.module}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getActionBadgeVariant(log.action)}>{log.action}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                {log.details}
              </TableCell>
              <TableCell className="hidden lg:table-cell font-mono text-xs">
                {log.ip_address}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuditTable;
