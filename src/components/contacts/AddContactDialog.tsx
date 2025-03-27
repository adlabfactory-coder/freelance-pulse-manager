
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AddContactForm from "./AddContactForm";

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
    // car nous voulons montrer la boîte de dialogue de rendez-vous
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
        <div className="space-y-4">
          <div className="text-xl font-semibold">Ajouter un contact</div>
          <AddContactForm 
            onSuccess={handleSuccess} 
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
