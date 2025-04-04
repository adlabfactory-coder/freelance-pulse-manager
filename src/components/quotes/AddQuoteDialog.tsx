
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import QuoteDialogContent from "./form/QuoteDialogContent";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useQuoteForm } from "@/hooks/quotes/useQuoteForm";
import { Quote, QuoteItem, QuoteStatus } from "@/types/quote";
import { toast } from "sonner";

interface AddQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuoteCreated?: () => void;
  initialContactId?: string;
}

const AddQuoteDialog: React.FC<AddQuoteDialogProps> = ({ 
  open, 
  onOpenChange, 
  onQuoteCreated,
  initialContactId
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdQuoteId, setCreatedQuoteId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  console.log("AddQuoteDialog rendered with open state:", open);
  
  // Utiliser le hook useQuoteForm pour gérer le formulaire
  const quoteForm = useQuoteForm({
    onSuccess: (id) => {
      if (id) {
        console.log("Devis créé avec succès:", id);
        setCreatedQuoteId(id);
        setShowSuccess(true);
        
        if (onQuoteCreated) {
          onQuoteCreated();
        }
        
        // Fermer automatiquement après 2 secondes
        setTimeout(() => {
          onOpenChange(false);
        }, 2000);
      } else {
        toast.error("Erreur: Aucun ID de devis n'a été retourné après la création");
      }
    },
    onError: (error) => {
      console.error("Erreur lors de la création du devis:", error);
      toast.error("Erreur lors de la création du devis: " + (error?.message || "Erreur inconnue"));
    },
    onCloseDialog: onOpenChange
  });

  useEffect(() => {
    if (open) {
      console.log("Dialog opened, loading data");
      // Charger les données de référence quand la boite de dialogue s'ouvre
      quoteForm.loadData()
        .catch(err => {
          console.error("Erreur lors du chargement des données:", err);
          toast.error("Erreur lors du chargement des données de référence");
        });
      
      // Réinitialiser l'état lorsque le dialogue s'ouvre
      setShowSuccess(false);
      setCreatedQuoteId(null);
      
      if (initialContactId) {
        // Si un ID de contact est fourni, initialiser la valeur
        console.log("Setting initial contact ID:", initialContactId);
        quoteForm.setContactId(initialContactId);
      }
    }
  }, [open, initialContactId, quoteForm]);

  const handleViewQuote = () => {
    if (createdQuoteId) {
      onOpenChange(false);
      navigate(`/quotes/${createdQuoteId}`);
    }
  };

  // Convert partial items to valid quote items for the dialog
  const safeItems: QuoteItem[] = quoteForm.items 
    ? quoteForm.items.filter((item): item is QuoteItem => {
        return Boolean(
          item && 
          typeof item.description !== 'undefined' && 
          typeof item.quantity !== 'undefined' && 
          typeof item.unitPrice !== 'undefined'
        );
      })
    : [];

  // Préparer les données du devis pour submission
  const quoteData: Partial<Quote> & { items: QuoteItem[] } = {
    contactId: quoteForm.contactId,
    freelancerId: quoteForm.freelancerId,
    validUntil: quoteForm.validUntil,
    status: quoteForm.status || QuoteStatus.DRAFT,
    notes: quoteForm.notes,
    folder: quoteForm.folder,
    totalAmount: quoteForm.totalAmount || 0,
    items: safeItems // Inclure les items pour l'affichage
  };

  const handleSubmit = () => {
    console.log("Submitting quote with data:", quoteData);
    console.log("Items:", safeItems);
    
    if (!quoteData.contactId) {
      toast.error("Veuillez sélectionner un contact");
      return;
    }
    
    if (!quoteData.freelancerId) {
      toast.error("Veuillez sélectionner un freelancer");
      return;
    }
    
    if (!quoteData.validUntil) {
      toast.error("Veuillez spécifier une date de validité");
      return;
    }
    
    if (!safeItems || safeItems.length === 0) {
      toast.error("Veuillez ajouter au moins un article au devis");
      return;
    }
    
    quoteForm.handleSubmit(quoteData, safeItems);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        {showSuccess ? (
          <div className="p-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Devis créé avec succès</h3>
              <p className="text-sm text-muted-foreground">
                Le devis a été créé avec succès.
              </p>
              <div className="mt-4">
                <Button onClick={handleViewQuote} className="mr-2">
                  Voir le devis
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Utiliser les propriétés du hook pour le formulaire
          <QuoteDialogContent 
            loading={quoteForm.loading}
            isSubmitting={quoteForm.isSubmitting}
            quoteData={quoteData}
            currentItem={quoteForm.currentItem}
            contacts={quoteForm.contacts || []}
            freelancers={quoteForm.freelancers || []}
            services={quoteForm.services || []}
            onQuoteDataChange={quoteForm.setQuoteData}
            onCurrentItemChange={quoteForm.setCurrentItem}
            onAddItem={quoteForm.handleAddItem}
            onRemoveItem={quoteForm.handleRemoveItem}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddQuoteDialog;
