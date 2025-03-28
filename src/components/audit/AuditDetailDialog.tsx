
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { AuditLog } from "@/types/audit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface AuditDetailDialogProps {
  log: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuditDetailDialog: React.FC<AuditDetailDialogProps> = ({
  log,
  open,
  onOpenChange,
}) => {
  if (!log) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papier");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de l'entrée d'audit</DialogTitle>
          <DialogDescription>
            Événement enregistré le {new Date(log.timestamp).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">ID</span>
            <div className="flex items-center">
              <span className="font-mono text-sm truncate">{log.id}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-1"
                onClick={() => copyToClipboard(log.id)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Horodatage</span>
            <span>{new Date(log.timestamp).toLocaleString()}</span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Utilisateur</span>
            <span>{log.user_email || "Système"}</span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Rôle</span>
            <span>{log.user_role || "N/A"}</span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Module</span>
            <Badge>{log.module}</Badge>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Action</span>
            <Badge>{log.action}</Badge>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Adresse IP</span>
            <span className="font-mono">{log.ip_address}</span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">User Agent</span>
            <span className="text-xs truncate">{log.user_agent}</span>
          </div>
        </div>

        <Separator />

        <div className="pt-4">
          <h3 className="mb-2 text-sm font-medium">Détails</h3>
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm whitespace-pre-wrap">{log.details}</p>
          </div>
        </div>

        {log.metadata && Object.keys(log.metadata).length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium">Métadonnées</h3>
            <div className="bg-muted p-3 rounded-md">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuditDetailDialog;
