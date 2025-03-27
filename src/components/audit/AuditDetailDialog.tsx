
import React from "react";
import { AuditLog } from "@/types/audit";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Clock, FileText, Info, User } from "lucide-react";

interface AuditDetailDialogProps {
  log: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuditDetailDialog: React.FC<AuditDetailDialogProps> = ({
  log,
  open,
  onOpenChange
}) => {
  if (!log) return null;

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

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
        return <FileText className="h-4 w-4" />;
      case 'auth':
        return <User className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Détails du journal d'audit</DialogTitle>
          <DialogDescription>
            Informations détaillées sur l'activité enregistrée
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={log.avatar || ""} />
              <AvatarFallback className="text-lg">{log.user.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-lg">{log.user}</div>
              <div className="text-sm text-muted-foreground">{log.role}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Horodatage</div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{formatDateTime(log.timestamp)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Module</div>
              <div className="flex items-center">
                {getModuleIcon(log.module)}
                <span className="ml-2 capitalize">{log.module}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Action</div>
              <Badge className={getActionBadgeColor(log.action)}>
                {log.action}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">ID de journal</div>
              <div className="text-sm">{log.id}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Détails</div>
            <div className="rounded-md bg-muted p-4 text-sm">
              {log.details}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuditDetailDialog;
