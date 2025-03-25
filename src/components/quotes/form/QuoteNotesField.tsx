
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface QuoteNotesFieldProps {
  notes?: string;
  onChange: (notes: string) => void;
}

const QuoteNotesField: React.FC<QuoteNotesFieldProps> = ({
  notes,
  onChange
}) => {
  return (
    <div>
      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        placeholder="Notes ou commentaires sur le devis"
        value={notes || ""}
        onChange={e => onChange(e.target.value)}
        rows={4}
      />
    </div>
  );
};

export default QuoteNotesField;
