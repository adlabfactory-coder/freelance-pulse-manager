
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Contact } from "@/services/contacts/types";
import { QuoteItem, QuoteStatus, Quote } from "@/types";
import { Service } from "@/types/services";
import { User } from "@/types";
import ClientSelector from "./ClientSelector";
import FreelancerSelector from "./FreelancerSelector";
import QuoteItemForm from "./QuoteItemForm";
import QuoteItemsList from "./QuoteItemsList";
import QuoteNotesField from "./QuoteNotesField";
import StatusSelector from "./StatusSelector";
import QuoteValidityDatePicker from "./QuoteValidityDatePicker";

interface QuoteDialogContentProps {
  loading: boolean;
  isSubmitting: boolean;
  quoteData: Partial<Quote>;
  currentItem: Partial<QuoteItem>;
  contacts: Contact[];
  freelancers: User[];
  services: Service[];
  onQuoteDataChange: (data: Partial<Quote>) => void;
  onCurrentItemChange: (item: Partial<QuoteItem>) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const QuoteDialogContent: React.FC<QuoteDialogContentProps> = ({
  loading,
  isSubmitting,
  quoteData,
  currentItem,
  contacts,
  freelancers,
  services,
  onQuoteDataChange,
  onCurrentItemChange,
  onAddItem,
  onRemoveItem,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des données...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClientSelector
          contacts={contacts}
          contactId={quoteData.contactId}
          onSelect={(contactId) => onQuoteDataChange({ ...quoteData, contactId })}
        />
        
        <FreelancerSelector
          freelancers={freelancers}
          freelancerId={quoteData.freelancerId}
          onSelect={(freelancerId) => onQuoteDataChange({ ...quoteData, freelancerId })}
        />
      </div>
      
      {/* N'afficher le sélecteur de statut et la date de validité que lors de l'édition */}
      {isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatusSelector
            status={quoteData.status as QuoteStatus}
            onSelect={(status) => onQuoteDataChange({ ...quoteData, status })}
          />
          
          <QuoteValidityDatePicker
            date={quoteData.validUntil}
            onSelect={(validUntil) => onQuoteDataChange({ ...quoteData, validUntil })}
          />
        </div>
      )}
      
      <div className="border rounded-md p-4">
        <h3 className="text-lg font-medium mb-4">Articles</h3>
        
        <QuoteItemsList 
          items={quoteData.items || []} 
          totalAmount={quoteData.totalAmount}
          onRemoveItem={onRemoveItem}
        />
        
        <div className="mt-4 border-t pt-4">
          <h4 className="font-medium mb-2">Ajouter un article</h4>
          <QuoteItemForm
            currentItem={currentItem}
            services={services}
            onChange={onCurrentItemChange}
            onAddItem={onAddItem}
          />
        </div>
      </div>
      
      <QuoteNotesField
        notes={quoteData.notes}
        onChange={(notes) => onQuoteDataChange({ ...quoteData, notes })}
      />
      
      <div className="flex justify-between border-t pt-4">
        <div>
          {quoteData.totalAmount !== undefined && (
            <div className="font-bold text-lg">
              Total: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(quoteData.totalAmount)}
            </div>
          )}
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={isSubmitting || !quoteData.contactId || !quoteData.freelancerId || !(quoteData.items && quoteData.items.length > 0)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              isEditing ? "Mettre à jour" : "Créer le devis"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuoteDialogContent;
