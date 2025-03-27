
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Quote, QuoteItem } from "@/types";
import { Contact } from "@/services/contacts/types";
import { User } from "@/types";
import { Service } from "@/types/services";
import QuoteClientSection from "./sections/QuoteClientSection";
import QuoteFreelancerSection from "./sections/QuoteFreelancerSection";
import QuoteDetailsSection from "./sections/QuoteDetailsSection";
import QuoteItemsSection from "./sections/QuoteItemsSection";
import QuoteNewItemSection from "./sections/QuoteNewItemSection";
import FolderSelect from "../FolderSelect";
import { Label } from "@/components/ui/label";

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
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  // Conversion des dates pour assurer la compatibilité
  const validUntil = quoteData.validUntil 
    ? (typeof quoteData.validUntil === 'string' ? new Date(quoteData.validUntil) : quoteData.validUntil)
    : new Date();

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuoteClientSection
          selectedContactId={quoteData.contactId || ""}
          contacts={contacts}
          onContactChange={(contactId) =>
            onQuoteDataChange({ ...quoteData, contactId })
          }
        />

        <QuoteFreelancerSection
          selectedFreelancerId={quoteData.freelancerId || ""}
          freelancers={freelancers}
          onFreelancerChange={(freelancerId) =>
            onQuoteDataChange({ ...quoteData, freelancerId })
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuoteDetailsSection
          validUntil={validUntil}
          status={quoteData.status || "draft"}
          onValidUntilChange={(validUntil) =>
            onQuoteDataChange({ ...quoteData, validUntil })
          }
          onStatusChange={(status) =>
            onQuoteDataChange({ ...quoteData, status })
          }
          isEditing={isEditing}
        />
        
        <div className="space-y-2">
          <Label htmlFor="folder">Dossier</Label>
          <FolderSelect
            value={quoteData.folder || "general"}
            onChange={(folder) => onQuoteDataChange({ ...quoteData, folder })}
            folders={['general', 'important', 'archive']}
            placeholder="Choisir un dossier"
          />
        </div>
      </div>

      <Separator className="my-6" />

      <Card>
        <CardContent className="pt-6">
          <QuoteItemsSection
            items={quoteData.items || []}
            onRemoveItem={onRemoveItem}
            totalAmount={quoteData.totalAmount || 0}
          />

          <Separator className="my-4" />

          <QuoteNewItemSection
            currentItem={currentItem}
            services={services}
            onCurrentItemChange={onCurrentItemChange}
            onAddItem={onAddItem}
          />
        </CardContent>
      </Card>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <textarea
          value={quoteData.notes || ""}
          onChange={(e) =>
            onQuoteDataChange({ ...quoteData, notes: e.target.value })
          }
          className="w-full h-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Notes ou informations complémentaires..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Enregistrement..."
            : isEditing
            ? "Mettre à jour"
            : "Créer le devis"}
        </Button>
      </div>
    </form>
  );
};

export default QuoteDialogContent;
