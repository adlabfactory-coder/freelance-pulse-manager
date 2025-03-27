import { useState, useEffect } from "react";
import { Appointment } from "@/types/appointment";
import { fetchAppointments } from "@/services/appointments";

interface UseAppointmentListProps {
  searchQuery?: string;
  statusFilter?: string;
}

interface UseAppointmentListResult {
  appointments: Appointment[];
  filteredAppointments: Appointment[];
  loading: boolean;
  contacts: {[key: string]: string};
}

export const useAppointmentList = ({ 
  searchQuery = "", 
  statusFilter 
}: UseAppointmentListProps): UseAppointmentListResult => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<{[key: string]: string}>({});

  // Charger tous les rendez-vous
  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      try {
        const allAppointments = await fetchAppointments();
        
        // Normaliser les noms de champs pour s'assurer que freelancerId est toujours avec I majuscule
        const normalizedAppointments = allAppointments.map(app => {
          const appointment = { ...app } as Appointment;
          // Si l'API renvoie freelancerid (avec i minuscule), le normaliser en freelancerId
          if (app.freelancerid && !app.freelancerId) {
            appointment.freelancerId = app.freelancerid;
          }
          return appointment;
        });
        
        setAppointments(normalizedAppointments);
        
        // Récupérer les noms des contacts associés aux rendez-vous
        const contactIds = [...new Set(allAppointments.map(app => app.contactId))];
        const { supabase } = await import('@/lib/supabase');
        
        const { data: contactsData } = await supabase
          .from('contacts')
          .select('id, name')
          .in('id', contactIds);
          
        if (contactsData) {
          const contactMap = contactsData.reduce((acc, contact) => {
            acc[contact.id] = contact.name;
            return acc;
          }, {} as {[key: string]: string});
          setContacts(contactMap);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des rendez-vous:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
    
    // Ajouter un écouteur d'événement pour rafraîchir les données
    const handleAppointmentCreated = () => loadAppointments();
    window.addEventListener('appointment-created', handleAppointmentCreated);
    
    return () => {
      window.removeEventListener('appointment-created', handleAppointmentCreated);
    };
  }, []);

  // Filtrer les rendez-vous en fonction des critères
  useEffect(() => {
    if (appointments.length === 0) {
      setFilteredAppointments([]);
      return;
    }

    let result = [...appointments];

    // Filtrer par statut si nécessaire
    if (statusFilter) {
      result = result.filter(app => app.status === statusFilter);
    }

    // Filtrer par terme de recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(app => 
        app.title.toLowerCase().includes(query) || 
        contacts[app.contactId]?.toLowerCase().includes(query) ||
        app.description?.toLowerCase().includes(query)
      );
    }

    // Trier par date, du plus récent au plus ancien
    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    setFilteredAppointments(result);
  }, [appointments, searchQuery, statusFilter, contacts]);

  return {
    appointments,
    filteredAppointments,
    loading,
    contacts
  };
};
