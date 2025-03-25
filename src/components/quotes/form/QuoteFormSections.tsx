
import React from "react";
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
  onRemoveItem
}) => {
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

        <FreelancerSelector 
          freelancerId={quoteData.freelancerId} 
          freelancers={freelancers} 
          onSelect={handleFreelancerChange} 
        />

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
          onItemChange={onCurrentItemChange}
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
