
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, FileText, UserCog, Trash } from "lucide-react";
import ContactInfoDisplay from "./ContactInfoDisplay";
import ContactAppointmentDialog from "./ContactAppointmentDialog";
import { Contact } from "@/services/contacts/types";
import ContactEditForm from "./ContactEditForm";
import { formatDateToFrench } from "@/utils/format";
import AddQuoteDialog from "@/components/quotes/AddQuoteDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { contactService } from "@/services/contact-service";
import { useNavigate } from "react-router-dom";
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

interface ContactDetailProps {
  contact: Contact;
  onUpdate: (updatedContact: Contact) => void;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ contact, onUpdate }) => {
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { isAdmin, isAdminOrSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const handleDeleteContact = async () => {
    if (!contact.id) return;
    
    setIsDeleting(true);
    try {
      const success = await contactService.deleteContact(contact.id);
      
      if (success) {
        toast({
          title: "Contact supprimé",
          description: "Le contact a été supprimé avec succès.",
        });
        navigate("/contacts");
      } else {
        throw new Error("Impossible de supprimer le contact");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du contact:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du contact."
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec les informations principales */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{contact.name}</h1>
          <p className="text-muted-foreground">
            Client créé le {formatDateToFrench(new Date(contact.createdAt))}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
            <UserCog className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          
          {isAdminOrSuperAdmin && (
            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-white" onClick={() => setDeleteDialogOpen(true)}>
              <Trash className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <Card>
        <CardContent className="pt-6">
          <ContactInfoDisplay contact={contact} />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          onClick={() => setAppointmentDialogOpen(true)}
        >
          <CalendarClock className="h-4 w-4 mr-2" />
          Planifier un rendez-vous
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setQuoteDialogOpen(true)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Créer un devis
        </Button>
      </div>

      {/* Dialogues */}
      <ContactAppointmentDialog 
        open={appointmentDialogOpen}
        onOpenChange={setAppointmentDialogOpen}
        contactId={contact.id}
        contactName={contact.name}
      />
      
      {editDialogOpen && (
        <ContactEditForm 
          contact={contact}
          onSuccess={() => {
            setEditDialogOpen(false);
            onUpdate(contact);
          }}
          onCancel={() => setEditDialogOpen(false)}
        />
      )}
      
      <AddQuoteDialog
        open={quoteDialogOpen}
        onOpenChange={setQuoteDialogOpen}
        initialContactId={contact.id}
      />

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce contact ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données associées à ce contact (rendez-vous, devis) seront également supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteContact}
              disabled={isDeleting} 
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactDetail;
