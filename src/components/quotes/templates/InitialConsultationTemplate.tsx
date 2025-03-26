
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuoteForm } from "@/hooks/useQuoteForm";
import { addDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import ClientSelector from "@/components/quotes/form/ClientSelector";
import FreelancerSelector from "@/components/quotes/form/FreelancerSelector";
import QuoteValidityDatePicker from "@/components/quotes/form/QuoteValidityDatePicker";
import { QuoteStatus } from "@/types";

interface InitialConsultationTemplateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialContactId?: string;
  onQuoteCreated?: (id?: string) => void;
}

const InitialConsultationTemplate: React.FC<InitialConsultationTemplateProps> = ({
  open,
  onOpenChange,
  initialContactId,
  onQuoteCreated
}) => {
  const [contactId, setContactId] = useState(initialContactId || "");
  const [freelancerId, setFreelancerId] = useState("");
  const [validUntil, setValidUntil] = useState<Date>(addDays(new Date(), 30)); // Validité par défaut de 30 jours
  const [loading, setLoading] = useState(false);

  const handleCloseDialog = () => {
    onOpenChange(false);
  };

  const handleQuoteCreated = (id?: string) => {
    toast.success("Devis créé avec succès");
    onOpenChange(false);
    if (onQuoteCreated) onQuoteCreated(id);
  };

  const {
    contacts,
    freelancers,
    isSubmitting,
    handleSubmit: formHandleSubmit,
    setContactId: setFormContactId,
    setFreelancerId: setFormFreelancerId,
    setValidUntil: setFormValidUntil,
    setStatus,
    setCurrentItem,
    handleAddItem,
    loadData
  } = useQuoteForm({
    onCloseDialog: handleCloseDialog,
    onQuoteCreated: handleQuoteCreated
  });

  // Charger les données au moment de l'ouverture du dialogue
  React.useEffect(() => {
    if (open) {
      loadData();
      
      // Si un ID de contact est fourni, on le définit
      if (initialContactId) {
        setContactId(initialContactId);
        setFormContactId(initialContactId);
      }
    }
  }, [open, loadData, initialContactId, setFormContactId]);

  // Synchroniser les états locaux avec les états du formulaire
  React.useEffect(() => {
    if (contactId) setFormContactId(contactId);
    if (freelancerId) setFormFreelancerId(freelancerId);
    setFormValidUntil(validUntil);
    setStatus(QuoteStatus.DRAFT);
  }, [contactId, freelancerId, validUntil, setFormContactId, setFormFreelancerId, setFormValidUntil, setStatus]);

  const handleCreateQuote = async () => {
    if (!contactId) {
      toast.error("Veuillez sélectionner un client");
      return;
    }

    if (!freelancerId) {
      toast.error("Veuillez sélectionner un commercial");
      return;
    }

    setLoading(true);
    
    try {
      // Définir l'article pour la consultation initiale
      setCurrentItem({
        description: "Consultation initiale",
        quantity: 1,
        unitPrice: 0, // Gratuit
        tax: 0,
        discount: 0
      });
      
      // Ajouter l'article
      handleAddItem();
      
      // Soumettre le formulaire
      await formHandleSubmit();
      
    } catch (error) {
      console.error("Erreur lors de la création du devis:", error);
      toast.error("Une erreur est survenue lors de la création du devis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Créer un devis pour consultation initiale</DialogTitle>
          <DialogDescription>
            Créez un devis gratuit pour une consultation initiale avec votre prospect.
            Ce devis explique l'objectif de la consultation et permettra de formaliser la relation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <ClientSelector
            contacts={contacts}
            contactId={contactId}
            onSelect={setContactId}
          />
          
          <FreelancerSelector
            freelancers={freelancers}
            freelancerId={freelancerId}
            onSelect={setFreelancerId}
          />
          
          <QuoteValidityDatePicker
            date={validUntil}
            onSelect={setValidUntil}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleCreateQuote} disabled={isSubmitting || !contactId || !freelancerId}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création en cours...
              </>
            ) : (
              "Créer le devis"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InitialConsultationTemplate;
