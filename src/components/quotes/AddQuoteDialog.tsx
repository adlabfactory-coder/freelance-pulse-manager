
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import QuoteDialogContent from "./form/QuoteDialogContent";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

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

  useEffect(() => {
    if (!open) {
      // Réinitialiser l'état lorsque le dialogue se ferme
      setShowSuccess(false);
      setCreatedQuoteId(null);
    }
  }, [open]);

  const handleQuoteCreated = (quoteId: string) => {
    console.log("Devis créé avec succès:", quoteId);
    setCreatedQuoteId(quoteId);
    setShowSuccess(true);
    
    if (onQuoteCreated) {
      onQuoteCreated();
    }
    
    // Fermer automatiquement après 2 secondes
    setTimeout(() => {
      onOpenChange(false);
    }, 2000);
  };

  const handleViewQuote = () => {
    if (createdQuoteId) {
      onOpenChange(false);
      navigate(`/quotes/${createdQuoteId}`);
    }
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
                Le devis a été créé avec succès et envoyé au contact.
              </p>
              <div className="mt-4">
                <Button onClick={handleViewQuote} className="mr-2">
                  Voir le devis
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <QuoteDialogContent 
            onQuoteCreated={handleQuoteCreated} 
            initialContactId={initialContactId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddQuoteDialog;
