
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, FileText } from "lucide-react";
import { Contact, ContactStatus } from "@/types";
import ContactStatusBadge from "../ContactStatusBadge";
import { formatDateToFrench } from "@/utils/format";

interface ContactCardProps {
  contact: Contact;
  onScheduleAppointment: (contactId: string, contactName: string) => void;
  onCreateQuote: (contactId: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onScheduleAppointment,
  onCreateQuote
}) => {
  return (
    <Card key={contact.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{contact.name}</CardTitle>
          <ContactStatusBadge status={contact.status as ContactStatus} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex flex-col text-sm">
            <span className="text-muted-foreground">Email: {contact.email}</span>
            {contact.phone && (
              <span className="text-muted-foreground">Téléphone: {contact.phone}</span>
            )}
            {contact.company && (
              <span className="text-muted-foreground">Entreprise: {contact.company}</span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Créé le {formatDateToFrench(new Date(contact.createdAt))}
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onScheduleAppointment(contact.id, contact.name)}
            >
              <CalendarClock className="h-3 w-3 mr-1" />
              Rendez-vous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onCreateQuote(contact.id)}
            >
              <FileText className="h-3 w-3 mr-1" />
              Devis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
