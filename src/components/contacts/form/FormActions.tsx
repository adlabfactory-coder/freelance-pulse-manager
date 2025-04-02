
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  onCancel?: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  disabled?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  isSubmitting, 
  submitLabel,
  disabled = false
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
      <Button 
        type="submit"
        disabled={isSubmitting || disabled}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement en cours
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
};

export default FormActions;
