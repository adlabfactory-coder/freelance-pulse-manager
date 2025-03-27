
import { useState, useEffect } from "react";
import { fetchQuotes } from "@/services/quote-service";
import { Quote } from "@/types/quote";
import { toast } from "sonner";
import { Contact } from "@/services/contacts/types";
import { User } from "@/types";
import { contactService } from "@/services/contact-service";
import { fetchUserById } from "@/services/user-service";

export const useQuotesData = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [contactsMap, setContactsMap] = useState<Record<string, Contact>>({});
  const [freelancersMap, setFreelancersMap] = useState<Record<string, User>>({});
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [previewQuoteId, setPreviewQuoteId] = useState<string | null>(null);

  // Charger les devis
  const loadQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuotes();
      setQuotes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des devis:", error);
      setError("Impossible de charger les devis. Veuillez réessayer plus tard.");
      toast.error("Erreur lors du chargement des devis");
    } finally {
      setLoading(false);
    }
  };

  // Charger les contacts et les commerciaux
  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les contacts
        const contactsList = await contactService.getContacts();
        setContacts(contactsList);
        
        const contactsMapObj: Record<string, Contact> = {};
        contactsList.forEach(contact => {
          contactsMapObj[contact.id] = contact;
        });
        setContactsMap(contactsMapObj);
        
        // Extraction des IDs de freelancers uniques des devis
        const freelancerIds = Array.from(new Set(quotes.map(quote => quote.freelancerId)));
        
        // Charger les données des freelancers
        const freelancersData: User[] = [];
        const freelancersMapObj: Record<string, User> = {};
        
        for (const id of freelancerIds) {
          try {
            const freelancer = await fetchUserById(id);
            if (freelancer) {
              freelancersData.push(freelancer);
              freelancersMapObj[id] = freelancer;
            }
          } catch (err) {
            console.error(`Erreur lors du chargement du commercial ${id}:`, err);
          }
        }
        
        setFreelancers(freelancersData);
        setFreelancersMap(freelancersMapObj);
        
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur lors du chargement des données");
      }
    };

    if (quotes.length > 0) {
      loadData();
    }
  }, [quotes]);

  // Charger les devis au montage
  useEffect(() => {
    loadQuotes();
  }, []);

  // Fonctions utilitaires
  const getContactName = (contactId: string): string => {
    return contactsMap[contactId]?.name || 'Contact inconnu';
  };

  const getFreelancerFullName = (freelancerId: string): string => {
    const freelancer = freelancersMap[freelancerId];
    return freelancer?.name || 'Commercial inconnu';
  };

  const formatReference = (id: string): string => {
    return `DEV-${id.substring(0, 8).toUpperCase()}`;
  };

  // Options pour les filtres
  const contactOptions = contacts.map(contact => ({
    id: contact.id,
    name: contact.name
  }));

  const freelancerOptions = freelancers.map(freelancer => ({
    id: freelancer.id,
    name: freelancer.name
  }));

  // Fonctions pour la prévisualisation
  const getQuoteById = (id: string | null): Quote | null => {
    if (!id) return null;
    return quotes.find(quote => quote.id === id) || null;
  };

  const getQuoteItems = (quoteId: string | null) => {
    if (!quoteId) return [];
    const quote = quotes.find(q => q.id === quoteId);
    return quote?.items || [];
  };

  return {
    quotes,
    loading,
    error,
    contacts,
    freelancers,
    contactsMap,
    freelancersMap,
    editingQuoteId,
    previewQuoteId,
    contactOptions,
    freelancerOptions,
    loadQuotes,
    getContactName,
    getFreelancerFullName,
    formatReference,
    setEditingQuoteId,
    setPreviewQuoteId,
    getQuoteById,
    getQuoteItems
  };
};
