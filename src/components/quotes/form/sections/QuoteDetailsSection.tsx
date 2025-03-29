
import React from 'react';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { QuoteStatus } from '@/types/quote';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getQuoteStatusLabel } from '@/types/quote';

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
  isEditing = false,
}) => {
  // Créer une liste des statuts disponibles
  const availableStatuses = Object.values(QuoteStatus);
  
  return (
    <>
      {/* Date de validité */}
      <div className="space-y-2">
        <Label htmlFor="validUntil">Date de validité</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !validUntil && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {validUntil ? (
                format(validUntil, "PP", { locale: fr })
              ) : (
                "Sélectionner une date"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={validUntil}
              onSelect={(date) => date && onValidUntilChange(date)}
              initialFocus
              locale={fr}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Statut du devis */}
      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select value={status} onValueChange={(value) => onStatusChange(value as QuoteStatus)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            {availableStatuses.map((statusOption) => (
              <SelectItem key={statusOption} value={statusOption}>
                {getQuoteStatusLabel(statusOption)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default QuoteDetailsSection;
