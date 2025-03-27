
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase-client";
import { fetchServices } from "@/services/services-service";
import { toast } from "sonner";
import { Contact } from "@/services/contacts/types";
import { Service } from "@/types/service";
import { User } from "@/types";
import { Quote } from "@/types/quote";
import { fetchQuoteById } from "@/services/quote-service";

export const useQuoteDataLoader = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .is('deleted_at', null);
      
      if (contactsError) {
        console.error('Error fetching contacts:', contactsError);
        setError('Erreur lors du chargement des contacts');
        toast.error("Une erreur est survenue lors du chargement des contacts");
      } else {
        setContacts(contactsData || []);
      }
      
      // Fetch freelancers
      const { data: freelancersData, error: freelancersError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'freelancer');
      
      if (freelancersError) {
        console.error('Error fetching freelancers:', freelancersError);
        setError('Erreur lors du chargement des freelancers');
        toast.error("Une erreur est survenue lors du chargement des freelancers");
      } else {
        setFreelancers(freelancersData || []);
      }
      
      // Fetch services with proper type handling
      try {
        const servicesData = await fetchServices();
        setServices(servicesData);
      } catch (servicesError: any) {
        console.error('Error fetching services:', servicesError);
        setError(`Erreur lors du chargement des services: ${servicesError.message || 'Erreur inconnue'}`);
        toast.error("Une erreur est survenue lors du chargement des services");
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      setError(`Erreur lors du chargement des données: ${error.message || 'Erreur inconnue'}`);
      toast.error("Une erreur est survenue lors du chargement des données");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadQuoteData = useCallback(async (quoteId: string): Promise<Quote | null> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Loading quote data for ID: ${quoteId}`);
      const quoteData = await fetchQuoteById(quoteId);
      console.log('Quote data loaded:', quoteData);
      return quoteData;
    } catch (error: any) {
      console.error('Error loading quote data:', error);
      setError(`Erreur lors du chargement du devis: ${error.message || 'Erreur inconnue'}`);
      toast.error("Une erreur est survenue lors du chargement du devis");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    contacts,
    freelancers,
    services,
    error,
    loadData,
    loadQuoteData
  };
};
