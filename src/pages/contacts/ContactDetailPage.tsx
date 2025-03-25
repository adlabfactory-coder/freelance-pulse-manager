
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactDetail from "@/components/contacts/ContactDetail";
import { useToast } from "@/components/ui/use-toast";

const ContactDetailPage: React.FC = () => {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contactId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "ID de contact manquant."
      });
      navigate("/contacts");
    }
    setLoading(false);
  }, [contactId, navigate, toast]);

  const handleBack = () => {
    navigate("/contacts");
  };

  const handleUpdate = () => {
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

      {contactId && (
        <ContactDetail contactId={contactId} onUpdate={handleUpdate} />
      )}
    </div>
  );
};

export default ContactDetailPage;
