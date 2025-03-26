
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuoteStatus } from "@/types";

interface StatusSelectorProps {
  status?: QuoteStatus;
  onSelect: (status: QuoteStatus) => void;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({
  status,
  onSelect
}) => {
  return (
    <div>
      <Label htmlFor="status">Statut</Label>
      <Select
        value={status}
        onValueChange={value => onSelect(value as QuoteStatus)}
      >
        <SelectTrigger id="status">
          <SelectValue placeholder="Sélectionner un statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={QuoteStatus.DRAFT}>Brouillon</SelectItem>
          <SelectItem value={QuoteStatus.SENT}>Envoyé</SelectItem>
          <SelectItem value={QuoteStatus.ACCEPTED}>Accepté</SelectItem>
          <SelectItem value={QuoteStatus.REJECTED}>Rejeté</SelectItem>
          <SelectItem value={QuoteStatus.EXPIRED}>Expiré</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusSelector;
