
import React from "react";
import { Mail, Phone, Building, MapPin, Calendar, Briefcase } from "lucide-react";
import { Contact } from "@/services/contacts/types";

interface ContactInfoDisplayProps {
  contact: Contact;
}

const ContactInfoDisplay: React.FC<ContactInfoDisplayProps> = ({ contact }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{contact.email}</span>
        </div>
        {contact.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{contact.phone}</span>
          </div>
        )}
        {contact.company && (
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span>{contact.company}</span>
          </div>
        )}
        {contact.position && (
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span>{contact.position}</span>
          </div>
        )}
        {contact.address && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{contact.address}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Ajouté le {new Date(contact.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      {contact.notes && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-1">Notes</h3>
          <p className="text-sm text-muted-foreground">{contact.notes}</p>
        </div>
      )}
    </div>
  );
};

export default ContactInfoDisplay;
