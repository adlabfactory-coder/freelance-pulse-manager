
import { supabase } from "@/lib/supabase";
import { createQuotesService } from "./supabase/quotes";
import { Quote, QuoteItem, QuoteStatus } from "@/types/quote";
import { toast } from "sonner";

// Créer une instance du service de devis
const quotesService = createQuotesService(supabase);

// Journalisation de débogage pour suivre l'initialisation
console.log("Service de devis initialisé avec supabase client:", !!supabase);

// Exporter les fonctions du service avec une meilleure gestion des erreurs
export const fetchQuotes = async () => {
  try {
    console.log("Chargement des devis...");
    const quotes = await quotesService.fetchQuotes();
    console.log(`${quotes.length} devis chargés`);
    return quotes;
  } catch (error) {
    console.error("Erreur lors du chargement des devis:", error);
    toast.error("Erreur lors du chargement des devis");
    return [];
  }
};

export const fetchQuoteById = async (id: string) => {
  try {
    console.log(`Chargement du devis ${id}...`);
    return await quotesService.fetchQuoteById(id);
  } catch (error) {
    console.error(`Erreur lors du chargement du devis ${id}:`, error);
    toast.error("Erreur lors du chargement du devis");
    return null;
  }
};

export const createQuote = async (quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>, items: Omit<QuoteItem, 'id' | 'quoteId'>[]) => {
  try {
    console.log("Création d'un nouveau devis avec les données:", quoteData);
    console.log("Éléments du devis:", items);
    
    // Vérification des données requises
    if (!quoteData.contactId || !quoteData.freelancerId || !quoteData.validUntil) {
      console.error("Données de devis incomplètes:", { quoteData });
      throw new Error("Données de devis incomplètes");
    }
    
    // S'assurer que le statut est bien un QuoteStatus
    const dataWithCorrectStatus = {
      ...quoteData,
      status: quoteData.status || QuoteStatus.DRAFT
    };
    
    const result = await quotesService.createQuote(dataWithCorrectStatus, items);
    console.log("Devis créé avec succès:", result);
    toast.success("Devis créé avec succès");
    return result;
  } catch (error) {
    console.error("Erreur lors de la création du devis:", error);
    toast.error("Erreur lors de la création du devis");
    throw error;
  }
};

export const updateQuote = async (id: string, quoteData: Partial<Quote>, items: QuoteItem[]) => {
  try {
    console.log(`Mise à jour du devis ${id}...`);
    console.log(`Items fournis:`, items);
    
    // Préparer les items dans le format attendu par quotesService.updateQuote
    const formattedItems = {
      add: items.filter(item => !item.id).map(({ id, quoteId, ...rest }) => rest),
      update: items.filter(item => !!item.id).map(item => ({
        id: item.id!,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        tax: item.tax || 0,
        serviceId: item.serviceId
      })),
      delete: [] // Dans cet exemple simple, nous ne gérons pas encore les suppressions
    };
    
    console.log(`Items formatés:`, formattedItems);
    
    return await quotesService.updateQuote(id, quoteData, formattedItems);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du devis ${id}:`, error);
    toast.error("Erreur lors de la mise à jour du devis");
    return null;
  }
};

export const updateQuoteStatus = async (id: string, status: QuoteStatus) => {
  try {
    console.log(`Mise à jour du statut du devis ${id} vers ${status}...`);
    return await quotesService.updateQuoteStatus(id, status);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du statut du devis ${id}:`, error);
    toast.error("Erreur lors de la mise à jour du statut du devis");
    return null;
  }
};

export const deleteQuote = async (id: string) => {
  try {
    console.log(`Suppression du devis ${id}...`);
    return await quotesService.deleteQuote(id);
  } catch (error) {
    console.error(`Erreur lors de la suppression du devis ${id}:`, error);
    toast.error("Erreur lors de la suppression du devis");
    return null;
  }
};
