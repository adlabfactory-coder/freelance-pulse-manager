
import React from "react";
import { AlertCircle, Trash2 } from "lucide-react";
import { Service } from "@/types";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteServiceDialogProps {
  service: Service | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteServiceDialog: React.FC<DeleteServiceDialogProps> = ({
  service,
  onConfirm,
  onCancel,
}) => {
  if (!service) return null;
  
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-red-500">Confirmer la suppression</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <p>
          Êtes-vous sûr de vouloir supprimer le service "{service.name}" ?
          Cette action est irréversible.
        </p>
        
        <Alert className="mt-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>
            La suppression d'un service peut affecter les devis existants qui l'utilisent.
          </AlertDescription>
        </Alert>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteServiceDialog;
