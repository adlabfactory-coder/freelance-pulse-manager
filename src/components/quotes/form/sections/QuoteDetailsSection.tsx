
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { QuoteStatus } from "@/types";

interface QuoteDetailsSectionProps {
  validUntil: Date;
  status: QuoteStatus;
  onValidUntilChange: (date: Date) => void;
  onStatusChange: (status: QuoteStatus) => void;
  isEditing?: boolean;
}

const QuoteDetailsSection: React.FC<QuoteDetailsSectionProps> = ({
  validUntil,
  status,
  onValidUntilChange,
  onStatusChange,
  isEditing = false
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="validUntil">Valide jusqu'au</Label>
        <DatePicker
          date={validUntil}
          onSelect={onValidUntilChange}
        />
      </div>
      
      <div>
        <Label htmlFor="status">Statut</Label>
        <Select
          value={status}
          onValueChange={(value) => onStatusChange(value as QuoteStatus)}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={QuoteStatus.DRAFT}>Brouillon</SelectItem>
            <SelectItem value={QuoteStatus.PENDING}>En attente</SelectItem>
            <SelectItem value={QuoteStatus.SENT}>Envoyé</SelectItem>
            <SelectItem value={QuoteStatus.ACCEPTED}>Accepté</SelectItem>
            <SelectItem value={QuoteStatus.REJECTED}>Rejeté</SelectItem>
            <SelectItem value={QuoteStatus.EXPIRED}>Expiré</SelectItem>
            <SelectItem value={QuoteStatus.PAID}>Payé</SelectItem>
            <SelectItem value={QuoteStatus.CANCELLED}>Annulé</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default QuoteDetailsSection;
