
import { useState, useEffect } from "react";
import { Quote, QuoteStatus } from "@/types/quote";
import { Contact } from "@/services/contacts/types";
import { User } from "@/types";
import { contactService } from "@/services/contact-service";
import { fetchUserById } from "@/services/user-service";

export const useQuoteTable = (quotes: Quote[]) => {
  const [sortColumn, setSortColumn] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [contactsMap, setContactsMap] = useState<Record<string, Contact>>({});
  const [freelancersMap, setFreelancersMap] = useState<Record<string, User>>({});
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);

  // Charger les informations des contacts et des commerciaux
  useEffect(() => {
    // Collecte des IDs uniques
    const contactIds = Array.from(new Set(quotes.map(quote => quote.contactId)));
    const freelancerIds = Array.from(new Set(quotes.map(quote => quote.freelancerId)));
    
    // Charger les contacts
    const loadContacts = async () => {
      const contactsData: Record<string, Contact> = {};
      for (const contactId of contactIds) {
        try {
          const contact = await contactService.getContactById(contactId);
          if (contact) {
            contactsData[contactId] = contact;
          }
        } catch (error) {
          console.error(`Erreur lors du chargement du contact ${contactId}:`, error);
        }
      }
      setContactsMap(contactsData);
    };
    
    // Charger les commerciaux
    const loadFreelancers = async () => {
      const freelancersData: Record<string, User> = {};
      for (const freelancerId of freelancerIds) {
        try {
          const freelancer = await fetchUserById(freelancerId);
          if (freelancer) {
            freelancersData[freelancerId] = freelancer;
          }
        } catch (error) {
          console.error(`Erreur lors du chargement du commercial ${freelancerId}:`, error);
        }
      }
      setFreelancersMap(freelancersData);
    };
    
    if (quotes.length > 0) {
      loadContacts();
      loadFreelancers();
    }
  }, [quotes]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedQuotes = [...quotes].sort((a, b) => {
    if (sortColumn === "totalAmount") {
      return sortDirection === "asc"
        ? a.totalAmount - b.totalAmount
        : b.totalAmount - a.totalAmount;
    } else if (sortColumn === "validUntil") {
      return sortDirection === "asc"
        ? new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime()
        : new Date(b.validUntil).getTime() - new Date(a.validUntil).getTime();
    } else if (sortColumn === "updatedAt") {
      return sortDirection === "asc"
        ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return 0;
  });

  // Obtenir le nom du contact à partir de l'ID
  const getContactName = (contactId: string) => {
    return contactsMap[contactId]?.name || 'Contact inconnu';
  };

  // Obtenir le nom complet du commercial à partir de l'ID
  const getFreelancerFullName = (freelancerId: string) => {
    const freelancer = freelancersMap[freelancerId];
    if (freelancer) {
      return freelancer.name || 'Commercial inconnu';
    }
    return 'Commercial inconnu';
  };

  // Formater la référence du devis
  const formatReference = (id: string) => {
    return `DEV-${id.substring(0, 8).toUpperCase()}`;
  };

  return {
    sortColumn,
    sortDirection,
    sortedQuotes,
    contactsMap,
    freelancersMap,
    editingQuoteId,
    setEditingQuoteId,
    handleSort,
    getContactName,
    getFreelancerFullName,
    formatReference
  };
};

export default useQuoteTable;
