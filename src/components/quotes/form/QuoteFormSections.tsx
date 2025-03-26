
import React, { useEffect, useState } from "react";
import ClientSelector from "./ClientSelector";
import FreelancerSelector from "./FreelancerSelector";
import StatusSelector from "./StatusSelector";
import QuoteValidityDatePicker from "./QuoteValidityDatePicker";
import QuoteNotesField from "./QuoteNotesField";
import QuoteItemForm from "./QuoteItemForm";
import QuoteItemsList from "./QuoteItemsList";
import { Quote, QuoteItem, QuoteStatus, User } from "@/types";
import { Contact } from "@/services/contacts/types";
import { Service } from "@/types/services";
import { contactService } from "@/services/contacts";
import { fetchUserById } from "@/services/supabase-user-service";

interface QuoteFormProps {
  quoteData: Partial<Quote>;
  currentItem: Partial<QuoteItem>;
  contacts: Contact[];
  freelancers: User[];
  services: Service[];
  onQuoteDataChange: (data: Partial<Quote>) => void;
  onCurrentItemChange: (item: Partial<QuoteItem>) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  isEditing?: boolean;
}

export const QuoteFormSections: React.FC<QuoteFormProps> = ({
  quoteData,
  currentItem,
  contacts,
  freelancers,
  services,
  onQuoteDataChange,
  onCurrentItemChange,
  onAddItem,
  onRemoveItem,
  isEditing = false
}) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedFreelancer, setSelectedFreelancer] = useState<User | null>(null);

  // Charger les données du contact et du freelance sélectionnés
  useEffect(() => {
    const loadContactData = async () => {
      if (quoteData.contactId) {
        try {
          const contact = await contactService.getContactById(quoteData.contactId);
          if (contact) {
            setSelectedContact(contact);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des données du contact:", error);
        }
      }
    };

    const loadFreelancerData = async () => {
      if (quoteData.freelancerId) {
        try {
          const freelancer = await fetchUserById(quoteData.freelancerId);
          if (freelancer) {
            setSelectedFreelancer(freelancer);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des données du freelancer:", error);
        }
      }
    };

    loadContactData();
    loadFreelancerData();
  }, [quoteData.contactId, quoteData.freelancerId]);

  const handleContactChange = (contactId: string) => {
    onQuoteDataChange({ ...quoteData, contactId });
  };

  const handleFreelancerChange = (freelancerId: string) => {
    onQuoteDataChange({ ...quoteData, freelancerId });
  };

  const handleStatusChange = (status: QuoteStatus) => {
    onQuoteDataChange({ ...quoteData, status });
  };

  const handleValidUntilChange = (validUntil: Date) => {
    onQuoteDataChange({ ...quoteData, validUntil });
  };

  const handleNotesChange = (notes: string) => {
    onQuoteDataChange({ ...quoteData, notes });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <ClientSelector 
          contactId={quoteData.contactId} 
          contacts={contacts} 
          onSelect={handleContactChange} 
        />
        
        {selectedContact && (
          <div className="p-3 bg-muted rounded-md text-sm">
            <p className="font-medium">{selectedContact.name}</p>
            <p>{selectedContact.email}</p>
            {selectedContact.company && <p>Société: {selectedContact.company}</p>}
            {selectedContact.phone && <p>Tél: {selectedContact.phone}</p>}
          </div>
        )}

        <FreelancerSelector 
          freelancerId={quoteData.freelancerId} 
          freelancers={freelancers} 
          onSelect={handleFreelancerChange} 
        />
        
        {selectedFreelancer && (
          <div className="p-3 bg-muted rounded-md text-sm">
            <p className="font-medium">{selectedFreelancer.name}</p>
            <p>{selectedFreelancer.email}</p>
            <p>Rôle: {selectedFreelancer.role}</p>
          </div>
        )}

        <StatusSelector 
          status={quoteData.status} 
          onSelect={handleStatusChange} 
        />

        <QuoteValidityDatePicker 
          date={quoteData.validUntil} 
          onSelect={handleValidUntilChange} 
        />

        <QuoteNotesField 
          notes={quoteData.notes} 
          onChange={handleNotesChange} 
        />
      </div>

      <div className="space-y-4">
        <QuoteItemForm 
          currentItem={currentItem}
          services={services}
          onChange={onCurrentItemChange}
          onAddItem={onAddItem}
        />
        
        <QuoteItemsList 
          items={quoteData.items}
          totalAmount={quoteData.totalAmount || 0}
          onRemoveItem={onRemoveItem}
        />
      </div>
    </div>
  );
};

export default QuoteFormSections;
