
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddContactForm from "./AddContactForm";

interface AddContactDialogProps {
  onContactAdded?: () => void;
  trigger?: React.ReactNode;
}

export function AddContactDialog({ onContactAdded, trigger }: AddContactDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onContactAdded) {
      onContactAdded();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un contact
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau contact</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouveau contact.
          </DialogDescription>
        </DialogHeader>
        <AddContactForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default AddContactDialog;
