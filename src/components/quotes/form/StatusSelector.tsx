
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { QuoteStatus, getQuoteStatusLabel } from '@/types/quote';

interface StatusSelectorProps {
  status: QuoteStatus;
  onSelect: (status: QuoteStatus) => void;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({ status, onSelect }) => {
  // Créer un tableau de valeurs à partir de l'énumération QuoteStatus
  const statusOptions = Object.values(QuoteStatus);
  
  return (
    <div className="space-y-2">
      <Label htmlFor="status">Statut du devis</Label>
      <Select 
        value={status} 
        onValueChange={(value) => onSelect(value as QuoteStatus)}
      >
        <SelectTrigger id="status">
          <SelectValue placeholder="Sélectionner un statut" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((statusOption) => (
            <SelectItem key={statusOption} value={statusOption}>
              {getQuoteStatusLabel(statusOption)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusSelector;
