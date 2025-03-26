
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, FileText, UserCog } from "lucide-react";
import ContactInfoDisplay from "./ContactInfoDisplay";
import ContactAppointmentDialog from "./ContactAppointmentDialog";
import { Contact } from "@/types";
import ContactEditForm from "./ContactEditForm";
import { formatDateToFrench } from "@/utils/format";
import InitialConsultationTemplate from "@/components/quotes/templates/InitialConsultationTemplate";
import AddQuoteDialog from "@/components/quotes/AddQuoteDialog";

interface ContactDetailProps {
  contact: Contact;
  onUpdate: (updatedContact: Contact) => void;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ contact, onUpdate }) => {
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [initialConsultationDialogOpen, setInitialConsultationDialogOpen] = useState(false);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);

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
          onClick={() => setInitialConsultationDialogOpen(true)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Devis consultation initiale
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
      
      <InitialConsultationTemplate
        open={initialConsultationDialogOpen}
        onOpenChange={setInitialConsultationDialogOpen}
        initialContactId={contact.id}
      />
      
      <AddQuoteDialog
        open={quoteDialogOpen}
        onOpenChange={setQuoteDialogOpen}
        initialContactId={contact.id}
      />
    </div>
  );
};

export default ContactDetail;
