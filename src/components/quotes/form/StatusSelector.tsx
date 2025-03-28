
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuoteStatus } from "@/types";

interface StatusSelectorProps {
  status?: QuoteStatus;
  onSelect: (status: QuoteStatus) => void;
  value?: QuoteStatus;
  onChange?: React.Dispatch<React.SetStateAction<QuoteStatus>>;
  disabled?: boolean;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({
  status,
  onSelect,
  value,
  onChange,
  disabled = false
}) => {
  // Si onChange est fourni, l'utiliser, sinon utiliser onSelect
  const handleChange = (newStatus: string) => {
    const typedStatus = newStatus as QuoteStatus;
    if (onChange) {
      onChange(typedStatus);
    } else {
      onSelect(typedStatus);
    }
  };

  // Utiliser value s'il est fourni, sinon utiliser status
  const currentValue = value !== undefined ? value : status;

  return (
    <div>
      <Label htmlFor="status">Statut</Label>
      <Select
        value={currentValue}
        onValueChange={handleChange}
        disabled={disabled}
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
  );
};

export default StatusSelector;
