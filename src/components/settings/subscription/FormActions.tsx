
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  isEditing: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ isSubmitting, onCancel, isEditing }) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Annuler
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enregistrement...
          </>
        ) : (
          isEditing ? 'Mettre à jour' : 'Créer le plan'
        )}
      </Button>
    </div>
  );
};

export default FormActions;
