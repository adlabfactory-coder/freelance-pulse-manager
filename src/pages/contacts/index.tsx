
import React, { useState, useEffect, useCallback } from "react";
import { contactService } from "@/services/contacts";
import { Contact } from "@/services/contacts/types";
import { ContactStatus } from "@/types/database/enums";
import ContactsHeader from "./ContactsHeader";
import ContactsSearchFilter from "./ContactsSearchFilter";
import ContactsImportExport from "./ContactsImportExport";
import ContactsTable from "./ContactsTable";
import FreelancerContactsList from "@/components/contacts/FreelancerContactsList";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";

const Contacts: React.FC = () => {
  const { isAdmin, isFreelancer, isAccountManager } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  
  const fetchContacts = async () => {
    if (!isAdmin && !isFreelancer && !isAccountManager) return;
    
    setLoading(true);
    const data = await contactService.getContacts();
    setContacts(data);
    setLoading(false);
  };
  
  // Fonction pour mettre à jour le statut d'un contact
  const updateContactStatus = useCallback(async (contactId: string, newStatus: ContactStatus) => {
    try {
      const result = await contactService.updateContact(contactId, { status: newStatus });
      if (result) {
        setContacts(prevContacts => 
          prevContacts.map(contact => 
            contact.id === contactId 
              ? { ...contact, status: newStatus }
              : contact
          )
        );
        
        // Message de confirmation basé sur le statut
        let statusMessage = "";
        switch (newStatus) {
          case "prospect":
            statusMessage = "Le contact est maintenant un prospect suite à un rendez-vous validé.";
            break;
          case "negotiation":
            statusMessage = "Le contact est maintenant en négociation suite à la génération d'un devis.";
            break;
          case "signed":
            statusMessage = "Le contact est maintenant au statut signé suite à la validation du paiement.";
            break;
          case "lost":
            statusMessage = "Le contact a été marqué comme perdu.";
            break;
          default:
            statusMessage = `Le statut du contact a été mis à jour: ${newStatus}`;
        }
        
        toast.success("Statut mis à jour", {
          description: statusMessage
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur", {
        description: "Impossible de mettre à jour le statut du contact"
      });
    }
  }, []);
  
  // Écouteur d'événements pour les rendez-vous validés
  useEffect(() => {
    const appointmentsChannel = supabase
      .channel('public:appointments')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'appointments'
        }, 
        (payload) => {
          // Si le statut du rendez-vous est validé, mettre à jour le contact en prospect
          if (payload.new && payload.new.status === 'confirmed') {
            const contactId = payload.new.contactId;
            const contact = contacts.find(c => c.id === contactId);
            
            if (contact && contact.status === 'lead') {
              updateContactStatus(contactId, 'prospect');
            }
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(appointmentsChannel);
    };
  }, [contacts, updateContactStatus]);
  
  // Écouteur d'événements pour les devis créés
  useEffect(() => {
    const quotesChannel = supabase
      .channel('public:quotes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'quotes'
        }, 
        (payload) => {
          // Quand un devis est créé, mettre à jour le contact en négociation
          if (payload.new) {
            const contactId = payload.new.contactId;
            const contact = contacts.find(c => c.id === contactId);
            
            if (contact && (contact.status === 'lead' || contact.status === 'prospect')) {
              updateContactStatus(contactId, 'negotiation');
            }
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(quotesChannel);
    };
  }, [contacts, updateContactStatus]);
  
  // Écouteur d'événements pour les devis validés/payés
  useEffect(() => {
    const quotesUpdateChannel = supabase
      .channel('public:quotes:updates')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'quotes'
        }, 
        (payload) => {
          // Quand un devis est marqué comme accepté/payé, mettre à jour le contact en signé
          if (payload.new && payload.new.status === 'accepted') {
            const contactId = payload.new.contactId;
            const contact = contacts.find(c => c.id === contactId);
            
            if (contact && contact.status === 'negotiation') {
              updateContactStatus(contactId, 'signed');
            }
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(quotesUpdateChannel);
    };
  }, [contacts, updateContactStatus]);
  
  // Vérification des devis en attente depuis plus d'une semaine
  useEffect(() => {
    // Seulement pour les chargés de compte et admins
    if (!isAccountManager && !isAdmin) return;
    
    const checkPendingQuotes = async () => {
      try {
        // Obtenir la date d'il y a une semaine
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        // Récupérer les devis en attente créés il y a plus d'une semaine
        const { data, error } = await supabase
          .from('quotes')
          .select('*, contacts(name)')
          .eq('status', 'sent')
          .lt('createdAt', oneWeekAgo.toISOString());
        
        if (error) throw error;
        
        // Notification pour chaque devis en attente
        if (data && data.length > 0) {
          data.forEach(quote => {
            const contactName = quote.contacts?.name || 'Client';
            toast.warning("Devis en attente", {
              description: `Le devis pour ${contactName} est en attente depuis plus d'une semaine.`,
              duration: 10000,
              action: {
                label: "Voir",
                onClick: () => window.location.href = `/quotes/${quote.id}`
              }
            });
          });
        }
      } catch (error) {
        console.error("Erreur lors de la vérification des devis en attente:", error);
      }
    };
    
    // Vérifier au chargement de la page
    checkPendingQuotes();
    
    // Vérifier périodiquement (toutes les 24h)
    const interval = setInterval(checkPendingQuotes, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isAccountManager, isAdmin]);
  
  useEffect(() => {
    if ((isAdmin || isFreelancer || isAccountManager) && loadAttempt === 0) {
      console.log("Chargement initial des contacts");
      fetchContacts();
      setLoadAttempt(1);
    }
  }, [isAdmin, isFreelancer, isAccountManager, loadAttempt]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterByStatus = (status: ContactStatus | null) => {
    setStatusFilter(status);
  };

  // Si c'est un freelancer, afficher la vue freelancer
  if (isFreelancer) {
    return (
      <div className="space-y-6">
        <ContactsHeader onContactAdded={fetchContacts} />
        <FreelancerContactsList />
      </div>
    );
  }

  // Pour les chargés de compte, afficher une vue similaire à celle de l'admin
  // mais avec seulement les contacts qui leur sont assignés
  if (isAccountManager) {
    return (
      <div className="space-y-6">
        <ContactsHeader onContactAdded={fetchContacts} />
        
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <ContactsSearchFilter 
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={handleFilterByStatus}
          />
        </div>

        <ContactsTable 
          contacts={contacts}
          loading={loading}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
        />
      </div>
    );
  }

  // Sinon, afficher la vue admin
  return (
    <div className="space-y-6">
      <ContactsHeader onContactAdded={fetchContacts} />

      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <ContactsSearchFilter 
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={handleFilterByStatus}
        />
        <ContactsImportExport onImportComplete={fetchContacts} />
      </div>

      <ContactsTable 
        contacts={contacts}
        loading={loading}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
      />
    </div>
  );
};

export default Contacts;
