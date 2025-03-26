
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionPlan } from "@/types";
import { Contact } from "@/services/contacts/types";
import { contactService } from "@/services/contacts";
import { User } from "@/types";
import { fetchUsers } from "@/services/supabase-user-service";
import { createQuote } from "@/services/quote-service";
import { Quote, QuoteItem, QuoteStatus } from "@/types";
import { addDays } from "date-fns";
import { useNavigate } from "react-router-dom";

interface SubscriptionToQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlan | null;
}

const SubscriptionToQuoteDialog: React.FC<SubscriptionToQuoteDialogProps> = ({
  open,
  onOpenChange,
  plan
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string>("");
  const [selectedFreelancerId, setSelectedFreelancerId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [contactsData, usersData] = await Promise.all([
        contactService.getContacts(),
        fetchUsers()
      ]);
      
      setContacts(contactsData || []);
      setFreelancers(usersData.filter(user => user.role === 'freelancer' || user.role === 'admin') || []);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Impossible de charger les données nécessaires.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuote = async () => {
    if (!selectedContactId || !selectedFreelancerId || !plan) {
      toast({
        variant: "destructive",
        title: "Informations manquantes",
        description: "Veuillez sélectionner un client et un commercial."
      });
      return;
    }

    setSubmitting(true);
    try {
      // Créer un élément de devis pour l'abonnement
      const quoteItem: QuoteItem = {
        description: `Abonnement ${plan.name} - ${plan.interval}`,
        quantity: 1,
        unitPrice: plan.price,
        discount: 0,
        tax: 20
      };

      // Calculer le montant total avec TVA
      const subtotal = quoteItem.quantity * quoteItem.unitPrice;
      const taxAmount = subtotal * (quoteItem.tax / 100);
      const totalAmount = subtotal + taxAmount;

      // Créer le devis avec validité de 30 jours
      const quote: Quote = {
        contactId: selectedContactId,
        freelancerId: selectedFreelancerId,
        totalAmount,
        validUntil: addDays(new Date(), 30),
        status: QuoteStatus.DRAFT,
        notes: `Devis pour l'abonnement ${plan.name}. ${plan.description || ''}`,
        items: [quoteItem],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await createQuote(quote);
      
      if (result) {
        toast({
          title: "Succès",
          description: "Le devis a été créé avec succès."
        });
        
        onOpenChange(false);
        
        // Rediriger vers la page des devis
        navigate("/quotes");
      } else {
        throw new Error("Erreur lors de la création du devis");
      }
    } catch (error) {
      console.error("Erreur lors de la création du devis:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du devis."
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un devis pour l'abonnement</DialogTitle>
          <DialogDescription>
            Sélectionnez un client et un commercial pour créer un devis pour l'abonnement {plan.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="plan">Abonnement sélectionné</Label>
            <div className="p-2 bg-muted rounded-md">
              <h4 className="font-medium">{plan.name}</h4>
              <p className="text-sm text-muted-foreground">{plan.price}€ / {plan.interval}</p>
              {plan.description && (
                <p className="text-sm mt-1">{plan.description}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Client</Label>
            <Select
              value={selectedContactId}
              onValueChange={setSelectedContactId}
              disabled={loading}
            >
              <SelectTrigger id="contact">
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map(contact => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.name} {contact.company ? `(${contact.company})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="freelancer">Commercial</Label>
            <Select
              value={selectedFreelancerId}
              onValueChange={setSelectedFreelancerId}
              disabled={loading}
            >
              <SelectTrigger id="freelancer">
                <SelectValue placeholder="Sélectionner un commercial" />
              </SelectTrigger>
              <SelectContent>
                {freelancers.map(freelancer => (
                  <SelectItem key={freelancer.id} value={freelancer.id}>
                    {freelancer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleCreateQuote}
            disabled={submitting || loading || !selectedContactId || !selectedFreelancerId}
          >
            {submitting ? "Création en cours..." : "Créer le devis"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionToQuoteDialog;
