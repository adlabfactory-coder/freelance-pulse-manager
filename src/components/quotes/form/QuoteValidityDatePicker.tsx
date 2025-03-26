
import React from "react";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";

interface QuoteValidityDatePickerProps {
  date?: Date;
  onSelect: (date: Date) => void;
  value?: Date;
  onChange?: React.Dispatch<React.SetStateAction<Date>>;
}

const QuoteValidityDatePicker: React.FC<QuoteValidityDatePickerProps> = ({
  date,
  onSelect,
  value,
  onChange
}) => {
  // Si onChange est fourni, l'utiliser, sinon utiliser onSelect
  const handleChange = (newDate: Date) => {
    if (onChange) {
      onChange(newDate);
    } else {
      onSelect(newDate);
    }
  };

  // Utiliser value s'il est fourni, sinon utiliser date
  const currentDate = value !== undefined ? value : date;

  return (
    <div>
      <Label htmlFor="validUntil">Valide jusqu'au</Label>
      <DatePicker
        date={currentDate}
        onSelect={handleChange}
      />
    </div>
  );
};

export default QuoteValidityDatePicker;
