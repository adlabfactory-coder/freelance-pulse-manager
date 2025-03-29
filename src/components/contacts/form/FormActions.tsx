
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  onCancel?: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  isSubmitting, 
  submitLabel 
}) => {
  return (
    <div className="flex justify-end space-x-2">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            En cours...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
};

export default FormActions;
