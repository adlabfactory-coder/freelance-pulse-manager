
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Plus, CalendarClock, Filter, FileText } from "lucide-react";
import { Contact, ContactStatus } from "@/types";
import ContactStatusBadge from "./ContactStatusBadge";
import { formatDateToFrench } from "@/utils/format";
import ContactAppointmentDialog from "./ContactAppointmentDialog";
import InitialConsultationTemplate from "@/components/quotes/templates/InitialConsultationTemplate";
import AddQuoteDialog from "@/components/quotes/AddQuoteDialog";
import { contactService } from "@/services/contact-service";

interface FreelancerContactsListProps {
  contacts: Contact[];
  loading: boolean;
}

const FreelancerContactsList: React.FC<FreelancerContactsListProps> = ({
  contacts: initialContacts,
  loading: initialLoading
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>(initialContacts || []);
  const [loading, setLoading] = useState<boolean>(initialLoading || true);
  const [selectedContactId, setSelectedContactId] = useState<string>("");
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [initialConsultationDialogOpen, setInitialConsultationDialogOpen] = useState(false);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [selectedContactName, setSelectedContactName] = useState<string>("");

  // Charger les contacts du freelancer si non fournis en prop
  useEffect(() => {
    if (initialContacts) {
      setContacts(initialContacts);
      setLoading(initialLoading);
    } else if (user?.id) {
      const loadContacts = async () => {
        try {
          const result = await contactService.getContactsByFreelancer(user.id);
          setContacts(result || []);
        } catch (error) {
          console.error("Erreur lors du chargement des contacts:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger vos contacts."
          });
        } finally {
          setLoading(false);
        }
      };
      
      loadContacts();
    }
  }, [initialContacts, initialLoading, user?.id, toast]);

  const handleScheduleAppointment = (contactId: string, contactName: string) => {
    setSelectedContactId(contactId);
    setSelectedContactName(contactName);
    setAppointmentDialogOpen(true);
  };

  const handleCreateInitialConsultation = (contactId: string) => {
    setSelectedContactId(contactId);
    setInitialConsultationDialogOpen(true);
  };

  const handleCreateQuote = (contactId: string) => {
    setSelectedContactId(contactId);
    setQuoteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Mes contacts</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 bg-muted rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Mes contacts</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
        </div>
      </div>
      
      {contacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-center text-muted-foreground mb-4">
              Vous n'avez pas encore de contacts assignés.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
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
                      onClick={() => handleScheduleAppointment(contact.id, contact.name)}
                    >
                      <CalendarClock className="h-3 w-3 mr-1" />
                      Rendez-vous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCreateInitialConsultation(contact.id)}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Consultation initiale
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCreateQuote(contact.id)}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Devis
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
      
      <InitialConsultationTemplate
        open={initialConsultationDialogOpen}
        onOpenChange={setInitialConsultationDialogOpen}
        initialContactId={selectedContactId}
      />
      
      <AddQuoteDialog
        open={quoteDialogOpen}
        onOpenChange={setQuoteDialogOpen}
        initialContactId={selectedContactId}
      />
    </div>
  );
};

export default FreelancerContactsList;
