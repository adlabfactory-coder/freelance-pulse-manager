
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { QuoteItem, QuoteStatus, Quote } from "@/types";
import { Contact } from "@/services/contacts/types";
import { Service } from "@/types/services";
import { User } from "@/types";
import { addDays } from "date-fns";
import { 
  createQuote, 
  fetchQuoteById, 
  updateQuote,
  updateQuoteStatus 
} from "@/services/quote-service";
import { fetchServices } from "@/services/services-service";
import { fetchUsers } from "@/services/supabase-user-service";
import { contactService } from "@/services/contacts";

interface UseQuoteFormProps {
  onCloseDialog: (open: boolean) => void;
  onQuoteCreated: () => void;
  isEditing?: boolean;
  quoteId?: string;
}

export const useQuoteForm = ({ 
  onCloseDialog, 
  onQuoteCreated,
  isEditing = false,
  quoteId = ""
}: UseQuoteFormProps) => {
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

  // Charger les données nécessaires (contacts, freelancers, services)
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
  
  // Charger les données d'un devis existant
  const loadQuoteData = async (id: string) => {
    setLoading(true);
    try {
      const quote = await fetchQuoteById(id);
      if (quote) {
        setQuoteData(quote);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger le devis demandé.",
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement du devis:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger le devis demandé.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculer le montant total à partir des éléments du devis
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

  // Ajouter un élément au devis
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

  // Supprimer un élément du devis
  const handleRemoveItem = (index: number) => {
    setQuoteData(prev => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index)
    }));
  };

  // Soumettre le formulaire de devis (création)
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
      
      if (result) {
        toast({
          title: "Succès",
          description: "Le devis a été créé avec succès.",
        });
        
        onCloseDialog(false);
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
  
  // Soumettre le formulaire de devis (modification)
  const handleSubmitEdit = async (id: string) => {
    if (!quoteData.contactId || !quoteData.freelancerId || !quoteData.items?.length) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires et ajouter au moins un article.",
      });
      return;
    }
    
    setIsSubmitting(true);
    console.log("Mise à jour du devis:", quoteData);
    
    try {
      const success = await updateQuote(id, quoteData);
      
      if (success) {
        toast({
          title: "Succès",
          description: "Le devis a été mis à jour avec succès.",
        });
        
        onCloseDialog(false);
        onQuoteCreated();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du devis:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du devis.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Mettre à jour le statut d'un devis
  const handleStatusChange = async (id: string, status: QuoteStatus) => {
    try {
      const success = await updateQuoteStatus(id, status);
      
      if (success) {
        toast({
          title: "Succès",
          description: `Le statut du devis a été changé en "${status}".`,
        });
        
        onQuoteCreated();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
      });
    }
  };

  return {
    contacts,
    freelancers,
    services,
    isSubmitting,
    loading,
    quoteData,
    currentItem,
    setQuoteData,
    setCurrentItem,
    handleAddItem,
    handleRemoveItem,
    handleSubmit,
    handleSubmitEdit,
    handleStatusChange,
    loadData,
    loadQuoteData
  };
};
