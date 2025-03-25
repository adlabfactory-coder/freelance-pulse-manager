
import React from "react";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";

interface QuoteValidityDatePickerProps {
  date?: Date;
  onSelect: (date: Date) => void;
}

const QuoteValidityDatePicker: React.FC<QuoteValidityDatePickerProps> = ({
  date,
  onSelect
}) => {
  return (
    <div>
      <Label htmlFor="validUntil">Valide jusqu'au</Label>
      <DatePicker
        date={date}
        onSelect={onSelect}
      />
    </div>
  );
};

export default QuoteValidityDatePicker;
