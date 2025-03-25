
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Check } from "lucide-react";
import { QuoteItem, QuoteStatus, User } from "@/types";
import { Quote } from "@/types";
import { Contact } from "@/services/contacts/types";
import { createQuote } from "@/services/quote-service";
import { fetchServices } from "@/services/services-service";
import { Service } from "@/types/services";
import { fetchUsers } from "@/services/supabase-user-service";
import { contactService } from "@/services/contacts";
import { addDays } from "date-fns";
import QuoteFormSections from "./form/QuoteFormSections";

interface AddQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuoteCreated: () => void;
}

const AddQuoteDialog: React.FC<AddQuoteDialogProps> = ({
  open,
  onOpenChange,
  onQuoteCreated,
}) => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [quoteData, setQuoteData] = useState<Partial<Quote>>({
    status: QuoteStatus.DRAFT,
    validUntil: addDays(new Date(), 30),
    totalAmount: 0,
    items: []
  });

  const [currentItem, setCurrentItem] = useState<Partial<QuoteItem>>({
    description: "",
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    tax: 20
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [contactsData, usersData, servicesData] = await Promise.all([
          contactService.getContacts(),
          fetchUsers(),
          fetchServices()
        ]);
        
        setContacts(contactsData || []);
        setFreelancers(usersData.filter(user => user.role === 'freelancer' || user.role === 'admin') || []);
        setServices(servicesData || []);
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

    if (open) {
      loadData();
    }
  }, [open, toast]);

  useEffect(() => {
    if (quoteData.items) {
      const total = quoteData.items.reduce((sum, item) => {
        const quantity = item.quantity || 0;
        const unitPrice = item.unitPrice || 0;
        const discount = item.discount || 0;
        const tax = item.tax || 0;
        
        const subtotal = quantity * unitPrice;
        const discountAmount = subtotal * (discount / 100);
        const taxAmount = (subtotal - discountAmount) * (tax / 100);
        
        return sum + (subtotal - discountAmount + taxAmount);
      }, 0);
      
      setQuoteData(prev => ({
        ...prev,
        totalAmount: parseFloat(total.toFixed(2))
      }));
    }
  }, [quoteData.items]);

  const handleAddItem = () => {
    if (!currentItem.description || !currentItem.quantity || !currentItem.unitPrice) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires de l'article.",
      });
      return;
    }
    
    setQuoteData(prev => ({
      ...prev,
      items: [...(prev.items || []), currentItem as QuoteItem]
    }));
    
    setCurrentItem({
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      tax: 20
    });
  };

  const handleRemoveItem = (index: number) => {
    setQuoteData(prev => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!quoteData.contactId || !quoteData.freelancerId || !quoteData.items?.length) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires et ajouter au moins un article.",
      });
      return;
    }
    
    setIsSubmitting(true);
    console.log("Soumission du devis:", quoteData);
    
    try {
      // Assurez-vous que tous les champs requis sont présents
      const completeQuote: Quote = {
        ...quoteData as Quote,
        totalAmount: quoteData.totalAmount || 0,
        status: quoteData.status || QuoteStatus.DRAFT,
        validUntil: quoteData.validUntil || addDays(new Date(), 30),
        notes: quoteData.notes || "",
        items: quoteData.items || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await createQuote(completeQuote);
      
      if (result.success) {
        onOpenChange(false);
        onQuoteCreated();
        
        // Réinitialiser le formulaire
        setQuoteData({
          status: QuoteStatus.DRAFT,
          validUntil: addDays(new Date(), 30),
          totalAmount: 0,
          items: []
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création du devis:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du devis.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouveau devis</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour créer un nouveau devis.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">Chargement des données...</div>
        ) : (
          <>
            <QuoteFormSections
              quoteData={quoteData}
              currentItem={currentItem}
              contacts={contacts}
              freelancers={freelancers}
              services={services}
              onQuoteDataChange={setQuoteData}
              onCurrentItemChange={setCurrentItem}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button disabled={isSubmitting} onClick={handleSubmit}>
                {isSubmitting ? (
                  "Création en cours..."
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Créer le devis
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddQuoteDialog;
