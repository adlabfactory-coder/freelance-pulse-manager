
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AddContactForm from "./AddContactForm";
import { toast } from "sonner";

interface AddContactDialogProps {
  onContactAdded?: () => void;
}

const AddContactDialog: React.FC<AddContactDialogProps> = ({ onContactAdded }) => {
  const [open, setOpen] = useState(false);
  
  const handleSuccess = () => {
    console.log("Contact ajouté avec succès");
    if (onContactAdded) {
      onContactAdded();
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
      setOpen(false);
    }, 1500);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" onClick={() => {
          console.log("Bouton de nouveau contact cliqué");
          setOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un contact</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <AddContactForm 
            onSuccess={handleFormSuccess} 
            onCancel={() => {
              console.log("Annulation de l'ajout de contact");
              setOpen(false);
            }} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactDialog;
