
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Service } from "@/types/service";

export interface DeleteServiceDialogProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceName?: string; // Ajout de cette prop pour la compatibilité
}

const DeleteServiceDialog: React.FC<DeleteServiceDialogProps> = ({
  service,
  isOpen,
  onClose,
  onConfirm,
  serviceName,
}) => {
  // Utiliser serviceName s'il est fourni, sinon utiliser service.name
  const displayName = serviceName || service.name;
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action supprimera définitivement le service "{displayName}". Cette action ne peut pas être annulée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteServiceDialog;
