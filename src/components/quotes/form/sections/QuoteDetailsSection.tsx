
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { QuoteStatus } from "@/types";

interface QuoteDetailsSectionProps {
  validUntil: Date;
  status: string;
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
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="accepted">Accepté</SelectItem>
            <SelectItem value="rejected">Rejeté</SelectItem>
            <SelectItem value="expired">Expiré</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default QuoteDetailsSection;
