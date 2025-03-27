import React, { useState } from "react";
import ContactAppointmentDialog from "./ContactAppointmentDialog";
import AddQuoteDialog from "@/components/quotes/AddQuoteDialog";
import { useFreelancerContacts } from "./hooks/useFreelancerContacts";
import ContactsLoadingState from "./components/ContactsLoadingState";
import ContactsEmptyState from "./components/ContactsEmptyState";
import ContactCard from "./components/ContactCard";
import FreelancerContactsHeader from "./components/FreelancerContactsHeader";
import { Contact } from "@/services/contacts/types";

interface FreelancerContactsListProps {
  contacts?: Contact[];
  loading?: boolean;
}

const FreelancerContactsList: React.FC<FreelancerContactsListProps> = ({
  contacts: initialContacts,
  loading: initialLoading
}) => {
  const { contacts, loading, refresh } = useFreelancerContacts(initialContacts, initialLoading);
  const [selectedContactId, setSelectedContactId] = useState<string>("");
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [selectedContactName, setSelectedContactName] = useState<string>("");

  const handleScheduleAppointment = (contactId: string, contactName: string) => {
    setSelectedContactId(contactId);
    setSelectedContactName(contactName);
    setAppointmentDialogOpen(true);
  };

  const handleCreateQuote = (contactId: string) => {
    setSelectedContactId(contactId);
    setQuoteDialogOpen(true);
  };

  const handleAppointmentCreated = () => {
    setAppointmentDialogOpen(false);
    refresh();
  };

  const handleQuoteCreated = () => {
    setQuoteDialogOpen(false);
    refresh();
  };

  return (
    <div className="space-y-4">
      <FreelancerContactsHeader loading={loading} onRefresh={refresh} />
      
      {loading ? (
        <ContactsLoadingState />
      ) : contacts.length === 0 ? (
        <ContactsEmptyState />
      ) : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onScheduleAppointment={handleScheduleAppointment}
              onCreateQuote={handleCreateQuote}
            />
          ))}
        </div>
      )}
      
      {/* Dialogues */}
      <ContactAppointmentDialog 
        open={appointmentDialogOpen}
        onOpenChange={setAppointmentDialogOpen}
        contactId={selectedContactId}
        contactName={selectedContactName}
        initialType="consultation-initiale"
      />
      
      <AddQuoteDialog
        open={quoteDialogOpen}
        onOpenChange={setQuoteDialogOpen}
        initialContactId={selectedContactId}
        onQuoteCreated={handleQuoteCreated}
      />
    </div>
  );
};

export default FreelancerContactsList;
