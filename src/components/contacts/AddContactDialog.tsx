
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AddContactForm from "./AddContactForm";
import { toast } from "sonner";

interface AddContactDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  onContactAdded?: () => void;
}

const AddContactDialog: React.FC<AddContactDialogProps> = ({ 
  open: externalOpen, 
  onOpenChange: externalOnOpenChange, 
  onSuccess, 
  onContactAdded 
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = externalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : internalOpen;
  
  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    if (externalOnOpenChange) {
      externalOnOpenChange(newOpen);
    }
  };
  
  const handleSuccess = () => {
    console.log("Contact ajouté avec succès");
    if (onContactAdded) {
      onContactAdded();
    }
    if (onSuccess) {
      onSuccess();
    }
    // Ne pas fermer automatiquement le dialogue après l'ajout
    // car nous voulons permettre la planification du rendez-vous
  };
  
  const handleFormSuccess = () => {
    // Cette fonction sera appelée par le formulaire lorsque l'ajout du contact est terminé
    // et que l'utilisateur a terminé la planification du rendez-vous
    handleSuccess();
    
    // Attendre un court délai avant de fermer le dialogue pour laisser
    // l'utilisateur voir le message de succès
    setTimeout(() => {
      handleOpenChange(false);
    }, 1500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un contact</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <AddContactForm 
            onSuccess={handleFormSuccess} 
            onCancel={() => {
              console.log("Annulation de l'ajout de contact");
              handleOpenChange(false);
            }} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactDialog;
