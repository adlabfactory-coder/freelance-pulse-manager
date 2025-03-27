
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase-client";
import { fetchServices } from "@/services/services-service";
import { toast } from "sonner";
import { Contact } from "@/services/contacts/types";
import { Service } from "@/types/service";
import { User } from "@/types";

export const useQuoteDataLoader = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .is('deleted_at', null);
      
      if (contactsError) {
        console.error('Error fetching contacts:', contactsError);
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
      } else {
        setFreelancers(freelancersData || []);
      }
      
      // Fetch services with proper type handling
      try {
        const servicesData = await fetchServices();
        setServices(servicesData);
      } catch (servicesError) {
        console.error('Error fetching services:', servicesError);
        toast.error("Une erreur est survenue lors du chargement des services");
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error("Une erreur est survenue lors du chargement des données");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    contacts,
    freelancers,
    services,
    loadData
  };
};
