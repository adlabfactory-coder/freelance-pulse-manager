
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Subscription } from "@/types/subscription";
import { useQuoteForm } from "@/components/quotes/hooks/useQuoteForm";
import ClientSelector from "@/components/quotes/form/ClientSelector";
import FreelancerSelector from "@/components/quotes/form/FreelancerSelector";
import QuoteValidityDatePicker from "@/components/quotes/form/QuoteValidityDatePicker";
import StatusSelector from "@/components/quotes/form/StatusSelector";
import QuoteItemsList from "@/components/quotes/form/QuoteItemsList";
import { useNavigate } from "react-router-dom";
import { Contact } from "@/services/contacts/types";
import { QuoteStatus } from "@/types";

interface SubscriptionToQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription;
  contact?: Contact;
}

export default function SubscriptionToQuoteDialog({
  open,
  onOpenChange,
  subscription,
  contact
}: SubscriptionToQuoteDialogProps) {
  const navigate = useNavigate();
  
  // Generate a default quote based on the subscription
  const initialQuote = {
    contactId: subscription.clientId || contact?.id || "",
    freelancerId: subscription.freelancerId || "",
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    status: "draft" as QuoteStatus,
    notes: `Ce devis est basé sur l'abonnement "${subscription.name}".`,
    items: [
      {
        description: subscription.name,
        quantity: 1,
        unitPrice: Number(subscription.price),
        tax: 20, // Default tax rate in France
        discount: 0
      }
    ]
  };
  
  const {
    contactId,
    setContactId,
    freelancerId,
    setFreelancerId,
    validUntil,
    setValidUntil,
    status,
    setStatus,
    notes,
    setNotes,
    items,
    addItem,
    updateItem,
    removeItem,
    totalAmount,
    isSubmitting,
    handleSubmit
  } = useQuoteForm(
    initialQuote,
    (quoteId) => {
      onOpenChange(false);
      navigate(`/quotes/${quoteId}`);
    }
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Créer un devis à partir de l'abonnement</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <ClientSelector
              contactId={contactId}
              onChange={setContactId}
              disabled={!!contact}
            />
            
            <FreelancerSelector
              freelancerId={freelancerId}
              onChange={setFreelancerId}
            />
            
            <QuoteValidityDatePicker
              value={validUntil}
              onChange={setValidUntil}
            />
            
            <StatusSelector
              value={status}
              onChange={setStatus}
            />
          </div>
          
          <QuoteItemsList
            items={items}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onAddItem={addItem}
          />
          
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">
              Total: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalAmount)}
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Création..." : "Créer le devis"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
