
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { QuoteStatus, SubscriptionPlan } from "@/types";
import { useQuoteForm } from "@/hooks/quotes/useQuoteForm";
import ClientSelector from "@/components/quotes/form/ClientSelector";
import FreelancerSelector from "@/components/quotes/form/FreelancerSelector";
import StatusSelector from "@/components/quotes/form/StatusSelector";
import QuoteValidityDatePicker from "@/components/quotes/form/QuoteValidityDatePicker";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/format";

interface SubscriptionToQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlan;
}

const SubscriptionToQuoteDialog: React.FC<SubscriptionToQuoteDialogProps> = ({
  open,
  onOpenChange,
  plan
}) => {
  const [contactId, setContactId] = useState("");
  const [freelancerId, setFreelancerId] = useState("");
  const [validUntil, setValidUntil] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [status, setStatus] = useState<QuoteStatus>(QuoteStatus.DRAFT);
  const [loading, setLoading] = useState(false);

  const handleCloseDialog = () => {
    onOpenChange(false);
  };

  const handleQuoteCreated = () => {
    toast.success("Devis créé avec succès");
    onOpenChange(false);
  };

  // Create the form hooks with manually wrapping callbacks to ensure the right signature
  const {
    contacts,
    freelancers,
    isSubmitting,
    handleSubmit: formHandleSubmit,
    setContactId: setFormContactId,
    setFreelancerId: setFormFreelancerId,
    setValidUntil: setFormValidUntil,
    setStatus: setFormStatus,
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
    }
  }, [open, loadData]);

  // Synchroniser les états locaux avec les états du formulaire
  React.useEffect(() => {
    if (contactId) setFormContactId(contactId);
    if (freelancerId) setFormFreelancerId(freelancerId);
    setFormValidUntil(validUntil);
    setFormStatus(status);
  }, [contactId, freelancerId, validUntil, status, setFormContactId, setFormFreelancerId, setFormValidUntil, setFormStatus]);

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
      // First set up the item in the hook's state
      setCurrentItem({
        description: `Abonnement ${plan.name}`,
        quantity: 1,
        unitPrice: plan.price,
        tax: 20,
        discount: 0
      });
      
      // Then add the item and submit the form
      handleAddItem();
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
          <DialogTitle>Créer un devis pour {plan.name}</DialogTitle>
          <DialogDescription>
            Créez un devis basé sur le plan d'abonnement {plan.name} ({formatCurrency(plan.price)}/{plan.interval})
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
          
          <StatusSelector
            status={status}
            onSelect={setStatus}
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

export default SubscriptionToQuoteDialog;
