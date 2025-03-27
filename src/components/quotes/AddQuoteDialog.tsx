
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuoteForm } from "@/hooks/quotes/useQuoteForm";
import QuoteForm from "./form/QuoteForm";
import { toast } from "sonner";
import QuoteDialogContent from "./form/QuoteDialogContent";
import { QuoteItem } from "@/types";

interface AddQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuoteCreated?: (id?: string) => void;
  initialContactId?: string;
}

const AddQuoteDialog: React.FC<AddQuoteDialogProps> = ({
  open,
  onOpenChange,
  onQuoteCreated,
  initialContactId
}) => {
  // State local pour suivre si un formulaire a été soumis
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Reset le formulaire quand la boîte de dialogue s'ouvre/se ferme
  useEffect(() => {
    if (!open) {
      setIsFormSubmitted(false);
    }
  }, [open]);

  const handleQuoteCreated = (id?: string) => {
    console.log("Quote created with ID:", id);
    
    // Marquer le formulaire comme soumis
    setIsFormSubmitted(true);
    
    // Fermer la boîte de dialogue
    onOpenChange(false);
    
    // Appeler le callback si fourni
    if (onQuoteCreated) {
      onQuoteCreated(id);
    }
    
    // Afficher une notification
    toast.success("Le devis a été créé avec succès");
  };

  const quoteForm = useQuoteForm({
    onSuccess: handleQuoteCreated,
    onCloseDialog: onOpenChange,
    onQuoteCreated: handleQuoteCreated
  });

  // Définir initialContactId si fourni
  useEffect(() => {
    if (initialContactId && open) {
      console.log("Setting initial contact ID:", initialContactId);
      quoteForm.setContactId(initialContactId);
    }
  }, [initialContactId, open, quoteForm.setContactId]);

  useEffect(() => {
    if (open) {
      // Charger les données nécessaires au formulaire
      console.log("Loading quote form data...");
      quoteForm.loadData()
        .catch(error => {
          console.error("Error loading form data:", error);
          toast.error("Erreur lors du chargement des données");
        });
    }
  }, [open, quoteForm.loadData]);

  // Convertir les items de type Partial<QuoteItem> en QuoteItem complet pour satisfaire TypeScript
  const safeItems: QuoteItem[] = quoteForm.items 
    ? quoteForm.items
        .filter(item => 
          item.description !== undefined && 
          item.quantity !== undefined && 
          item.unitPrice !== undefined
        )
        .map(item => ({
          id: item.id || "",
          quoteId: item.quoteId || "",
          description: item.description || "",
          quantity: item.quantity || 0,
          unitPrice: item.unitPrice || 0,
          tax: item.tax || 0,
          discount: item.discount || 0,
          serviceId: item.serviceId
        }))
    : [];

  // Créer une fonction wrapper qui gère l'appel à handleSubmit correctement
  const handleSubmitWrapper = () => {
    // Récupérer les données du formulaire
    const quoteData = {
      contactId: quoteForm.contactId,
      freelancerId: quoteForm.freelancerId,
      validUntil: quoteForm.validUntil,
      status: quoteForm.status,
      notes: quoteForm.notes || "",
      folder: quoteForm.folder || 'general',
      totalAmount: quoteForm.totalAmount || 0
    };
    
    // Appeler handleSubmit avec les données du formulaire
    quoteForm.handleSubmit(quoteData, safeItems);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouveau devis</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un devis.
          </DialogDescription>
        </DialogHeader>

        {quoteForm.error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            <h3 className="font-medium">Erreur lors du chargement des données</h3>
            <p className="text-sm">{quoteForm.error}</p>
            <button 
              onClick={() => quoteForm.loadData()} 
              className="mt-2 text-sm font-medium underline"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <QuoteDialogContent
            loading={quoteForm.loading}
            isSubmitting={quoteForm.isSubmitting}
            quoteData={{
              contactId: quoteForm.contactId,
              freelancerId: quoteForm.freelancerId,
              validUntil: quoteForm.validUntil,
              status: quoteForm.status,
              notes: quoteForm.notes,
              items: safeItems  // Utiliser la version sécurisée des items
            }}
            currentItem={quoteForm.currentItem || {}}
            contacts={quoteForm.contacts || []}
            freelancers={quoteForm.freelancers || []}
            services={quoteForm.services || []}
            onQuoteDataChange={(data) => {
              if (data.contactId !== undefined) quoteForm.setContactId(data.contactId);
              if (data.freelancerId !== undefined) quoteForm.setFreelancerId(data.freelancerId);
              if (data.validUntil !== undefined) quoteForm.setValidUntil(data.validUntil);
              if (data.status !== undefined) quoteForm.setStatus(data.status);
              if (data.notes !== undefined) quoteForm.setNotes(data.notes);
            }}
            onCurrentItemChange={quoteForm.setCurrentItem}
            onAddItem={quoteForm.handleAddItem}
            onRemoveItem={quoteForm.handleRemoveItem}
            onSubmit={handleSubmitWrapper}  // Utiliser le wrapper au lieu de la méthode directe
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddQuoteDialog;
