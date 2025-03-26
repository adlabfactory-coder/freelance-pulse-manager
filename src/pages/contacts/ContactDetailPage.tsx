
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactDetail from "@/components/contacts/ContactDetail";
import { useToast } from "@/hooks/use-toast";
import { contactService } from "@/services/contact-service";
import { Contact } from "@/types";

const ContactDetailPage: React.FC = () => {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (!contactId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "ID de contact manquant."
      });
      navigate("/contacts");
      return;
    }

    // Charger les données du contact
    const loadContact = async () => {
      try {
        const contactData = await contactService.getContactById(contactId);
        if (!contactData) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Contact introuvable."
          });
          navigate("/contacts");
          return;
        }
        setContact(contactData);
      } catch (error) {
        console.error("Erreur lors du chargement du contact:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les détails du contact."
        });
        navigate("/contacts");
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, [contactId, navigate, toast]);

  const handleBack = () => {
    navigate("/contacts");
  };

  const handleUpdate = (updatedContact: Contact) => {
    setContact(updatedContact);
    toast({
      title: "Contact mis à jour",
      description: "Les informations du contact ont été mises à jour avec succès."
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={handleBack} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Détail du contact</h1>
      </div>

      {contact && (
        <ContactDetail contact={contact} onUpdate={handleUpdate} />
      )}
    </div>
  );
};

export default ContactDetailPage;
